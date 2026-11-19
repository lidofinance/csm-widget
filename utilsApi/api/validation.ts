import { Transform } from 'node:stream';

import { Cache } from 'memory-cache';
import { erc6492SignatureValidatorByteCode } from 'viem';

import {
  ClientError,
  InvalidRequestError,
  SizeTooLargeError,
  UnsupportedChainIdError,
  UnsupportedHTTPMethodError,
} from './errors';

import type { NextApiRequest } from 'next';
import { RpcRequest, ValidationContext } from './types';

// validation factories

const zeroBN = BigInt(0);

export const baseRequestValidationFactory = (
  defaultChain: number | string,
  providers: Record<string, unknown>,
  maxBatchSize?: number,
) => {
  return (req: NextApiRequest) => {
    if (req.method !== 'POST') {
      // We don't care about tracking blocked requests here
      throw new UnsupportedHTTPMethodError();
    }

    const chainId = Number(req.query.chainId || defaultChain);

    // Allow only chainId of specified chains
    if (providers[chainId] == null) {
      // We don't care about tracking blocked requests here
      throw new UnsupportedChainIdError();
    }

    const requests = Array.isArray(req.body) ? req.body : [req.body];

    if (typeof maxBatchSize === 'number' && requests.length > maxBatchSize) {
      throw new InvalidRequestError(`Too many batched requests`);
    }
    return { chainId, requests };
  };
};

export const rpcMethodsValidationFactory = (allowedMethods?: string[]) => {
  const methodsMap = new Set(allowedMethods ?? []);

  return (request: RpcRequest, context: ValidationContext) => {
    const method = request.method;
    if (typeof method !== 'string') {
      throw new InvalidRequestError(`RPC method isn't string`);
    }
    if (allowedMethods && !methodsMap.has(request.method)) {
      context.rpcRequestBlocked.inc({ reason: 'method not allowed' });
      throw new InvalidRequestError(`RPC method ${method} not allowed`);
    }
  };
};

const ERC6492_VALIDATOR_BYTECODE =
  erc6492SignatureValidatorByteCode.toLowerCase();

// To-less calls are allowed only for viem's deployless ERC-6492 signature verification
const isErc6492DeploylessCall = (data: unknown) =>
  typeof data === 'string' &&
  data.toLowerCase().startsWith(ERC6492_VALIDATOR_BYTECODE);

export const ethCallValidationFactory = (
  allowedAddress: Record<number, string[]>,
  method = 'eth_call',
) => {
  const allowedCallAddressMap = createAllowedAddressMap(allowedAddress);

  return (
    request: RpcRequest,
    { chainId, rpcRequestBlocked }: ValidationContext,
  ) => {
    const { params } = request;
    if (!Array.isArray(params) || !params[0] || typeof params[0] !== 'object') {
      throw new InvalidRequestError(`RPC method ${method} is invalid`);
    }
    const { to, data } = params[0] as { to?: unknown; data?: unknown };

    if (typeof to === 'string') {
      if (!allowedCallAddressMap[chainId]?.has(to.toLowerCase())) {
        rpcRequestBlocked.inc({ reason: `address not allowed for ${method}` });
        throw new InvalidRequestError(
          `Address ${to} is not allowed for ${method}`,
        );
      }
    } else if (to == null) {
      if (!isErc6492DeploylessCall(data)) {
        rpcRequestBlocked.inc({ reason: `${method} without address` });
        throw new InvalidRequestError(
          `Calls without address are not allowed for ${method}`,
        );
      }
    } else {
      rpcRequestBlocked.inc({ reason: `${method} invalid address` });
      throw new InvalidRequestError(`RPC method ${method} is invalid`);
    }
  };
};

export const ethGetLogsValidationFactory = (
  allowedAddress: Record<number, string[]> | undefined,
  blockEmptyAddressGetLogs: boolean | undefined,
  maxBlockRange: number | undefined,
  currentBlockTTL = 60_000,
) => {
  const allowedAddressMap = createAllowedAddressMap(allowedAddress ?? {});

  const maxBlockRangeBN = maxBlockRange ? BigInt(maxBlockRange) : zeroBN;

  const currentBlock = new Cache<number, bigint>();

  return async (
    request: RpcRequest,
    { chainId, rpcRequestBlocked, requestRPC }: ValidationContext,
  ) => {
    try {
      const params = request.params[0] as any;
      const fromBlock: string = params.fromBlock;
      const toBlock: string = params.toBlock ?? 'latest';

      if (blockEmptyAddressGetLogs || allowedAddress) {
        // address validation
        const address: string | string[] = params.address;

        if (blockEmptyAddressGetLogs && !address)
          throw new InvalidRequestError(
            `RPC method eth_getLogs address is invalid`,
          );

        const addresses = Array.isArray(address) ? address : [address];

        if (blockEmptyAddressGetLogs && addresses.length === 0) {
          throw new InvalidRequestError(
            `RPC method eth_getLogs address is invalid`,
          );
        }
        if (
          allowedAddress &&
          addresses.some(
            (eventAddress) =>
              // needs this check before toLowerCase
              typeof eventAddress !== 'string' ||
              !allowedAddressMap[chainId]?.has(eventAddress.toLowerCase()),
          )
        ) {
          rpcRequestBlocked.inc({
            reason: 'address not allowed for eth_getLogs',
          });
          throw new InvalidRequestError(
            `Address ${params[0].to} is not allowed for eth_getLogs`,
          );
        }
      }

      // block range validation
      if (maxBlockRange) {
        if (fromBlock === 'earliest')
          throw new InvalidRequestError(
            `RPC method eth_getLogs fromBlock is invalid`,
          );

        const shouldValidateBlockDistance = fromBlock.startsWith('0x');

        if (shouldValidateBlockDistance) {
          const normalizedFromBlock = BigInt(fromBlock);
          let normalizedToBlock: bigint;
          if (toBlock.startsWith('0x')) normalizedToBlock = BigInt(toBlock);
          else {
            const cached = currentBlock.get(chainId);
            if (cached) {
              normalizedToBlock = cached;
            } else {
              normalizedToBlock = await requestRPC(chainId, {
                id: 1,
                jsonrpc: '2.0',
                method: 'eth_blockNumber',
              })
                .then((res) => res.json())
                .then((res) => BigInt(res.result));
              currentBlock.put(chainId, normalizedToBlock, currentBlockTTL);
            }
          }
          const range = normalizedToBlock - normalizedFromBlock;

          if (range < zeroBN || range > maxBlockRangeBN) {
            rpcRequestBlocked.inc({
              reason: 'eth_getLogs range is invalid',
            });
            throw new InvalidRequestError(
              `RPC method eth_getLogs range is invalid`,
            );
          }
        }
      }
    } catch (error) {
      if (error instanceof ClientError) throw error;
      throw new InvalidRequestError(`RPC method eth_getLogs is invalid`);
    }
  };
};

export const maxSizeTransformFactory = (
  MAX_SIZE: number,
  onExceed: () => void,
) => {
  let bytesWritten = 0;
  return new Transform({
    transform(chunk, _encoding, callback) {
      bytesWritten += chunk.length;
      if (bytesWritten > MAX_SIZE) {
        onExceed();
        return callback(
          new SizeTooLargeError(
            `Stream size exceeds the maximum limit of ${MAX_SIZE} bytes`,
          ),
        );
      }
      return callback(null, chunk);
    },
  });
};

export const streamMaxSizeValidationFactory =
  (MAX_SIZE: number) => (context: ValidationContext) =>
    maxSizeTransformFactory(MAX_SIZE, () =>
      context.rpcRequestBlocked.inc({ reason: 'response too large' }),
    );

// utils

export const shouldValidateRpcMethod = (
  method: string,
  allowedRPCMethods?: string[],
) => !allowedRPCMethods || allowedRPCMethods.includes(method);

const createAllowedAddressMap = (allowedAddress: Record<number, string[]>) => {
  return Object.entries(allowedAddress).reduce(
    (acc, [chainId, addresses]) => {
      acc[chainId] = new Set(addresses.map((a) => a.toLowerCase()));
      return acc;
    },
    {} as Record<string, Set<string>>,
  );
};
