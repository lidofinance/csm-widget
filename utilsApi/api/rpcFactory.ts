import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { ReadableStream } from 'node:stream/web';

import { DEFAULT_API_ERROR_MESSAGE } from '@lidofinance/next-api-wrapper';
import type { FetchRpcInitBody } from '@lidofinance/rpc';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Counter } from 'prom-client';
import {
  canonicalizeEnvelope,
  readMethod,
  canonicalizeParams,
} from './canonical-request';
import { requestRpcFactory, redactUrls } from './request-rpc';
import {
  ClientError,
  HEALTHY_RPC_SERVICES_ARE_OVER,
  SizeTooLargeError,
} from './errors';
import {
  baseRequestValidationFactory,
  ethCallValidationFactory,
  ethGetLogsValidationFactory,
  rpcMethodsValidationFactory,
  shouldValidateRpcMethod,
  streamMaxSizeValidationFactory,
} from './validation';
import type { RPCFactoryParams, RpcRequest } from './types';

export const rpcFactory = ({
  metrics,
  providers,
  fetchRPC,
  defaultChain,
  validation,
  upstreamTimeoutMs,
}: RPCFactoryParams) => {
  const {
    allowedRPCMethods,
    allowedCallAddresses,
    allowedOverrideAddresses,
    allowedLogsAddresses,
    maxResponseSize = 1_000_000,
    maxBatchCount = 20,
    currentBlockTTLms = 60_000,
    maxGetLogsRange = 20_000,
    blockEmptyAddressGetLogs = true,
  } = validation;

  // optional metrics
  const { registry, prefix = '' } = metrics ?? {};
  const rpcRequestBlocked = new Counter({
    name: prefix + 'rpc_service_request_blocked',
    help: 'RPC service request blocked',
    labelNames: ['reason'],
    registers: [],
  });
  registry?.registerMetric(rpcRequestBlocked);

  const validateBaseRequest = baseRequestValidationFactory(
    defaultChain,
    providers,
    maxBatchCount,
  );

  const validateRpcMethod = rpcMethodsValidationFactory(allowedRPCMethods);

  const callValidators: Record<
    string,
    ReturnType<typeof ethCallValidationFactory>
  > = {};
  if (allowedCallAddresses) {
    for (const method of ['eth_call', 'eth_estimateGas']) {
      if (shouldValidateRpcMethod(method, allowedRPCMethods)) {
        callValidators[method] = ethCallValidationFactory(
          allowedCallAddresses,
          method,
          allowedOverrideAddresses,
        );
      }
    }
  }

  const validateEthGetLogs =
    (allowedLogsAddresses || blockEmptyAddressGetLogs) &&
    shouldValidateRpcMethod('eth_getLogs', allowedRPCMethods)
      ? ethGetLogsValidationFactory(
          allowedLogsAddresses,
          blockEmptyAddressGetLogs,
          maxGetLogsRange,
          currentBlockTTLms,
        )
      : undefined;

  const validateMaxSteamSize = streamMaxSizeValidationFactory(maxResponseSize);

  const requestRPC = requestRpcFactory({
    providers,
    fetchRPC,
    upstreamTimeoutMs,
  });

  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const abortController = new AbortController();
    try {
      const { chainId, requests, isBatch } = validateBaseRequest(req);

      const validationContext = {
        chainId,
        rpcRequestBlocked,
        requestRPC,
      };

      // We throw HTTP error for ANY invalid RPC request out of batch
      // because we assume that frontend must not send invalid requests at all
      const canonical: RpcRequest[] = [];
      for (const raw of requests) {
        const method = readMethod(raw);
        validateRpcMethod({ method }, validationContext);
        const envelope = canonicalizeEnvelope(raw, method);

        const item = canonicalizeParams(envelope, {
          allowOverrides: !!allowedOverrideAddresses && !!allowedCallAddresses,
        });

        callValidators[item.method]?.(item, validationContext);
        if (item.method === 'eth_getLogs' && validateEthGetLogs) {
          await validateEthGetLogs(item, validationContext);
        }
        canonical.push(item);
      }

      const proxyedRPC = await requestRPC(
        chainId,
        (isBatch ? canonical : canonical[0]) as FetchRpcInitBody,
      );

      // iterateUrls returns the last response when no provider answered ok
      if (!proxyedRPC.ok) {
        await proxyedRPC.body?.cancel().catch(() => undefined);
        res.status(502).json(DEFAULT_API_ERROR_MESSAGE);
        return;
      }

      const contentLength = Number(proxyedRPC.headers.get('Content-Length'));
      if (contentLength > maxResponseSize) {
        await proxyedRPC.body?.cancel().catch(() => undefined);
        rpcRequestBlocked.inc({ reason: 'response too large' });
        throw new SizeTooLargeError(
          `Stream size exceeds the maximum limit of ${maxResponseSize} bytes`,
        );
      }

      res.setHeader(
        'Content-Type',
        proxyedRPC.headers.get('Content-Type') ?? 'application/json',
      );
      if (!proxyedRPC.body) {
        throw new Error('There are a problems with RPC provider');
      }

      // auto closes both Readable.fromWeb() and underlying proxyedRPC streams on error
      await pipeline(
        Readable.fromWeb(proxyedRPC.body as ReadableStream),
        validateMaxSteamSize(validationContext),
        res,
        {
          signal: abortController.signal,
        },
      );
    } catch (error) {
      if (error instanceof ClientError) {
        if (!res.headersSent) {
          res
            .status(error instanceof SizeTooLargeError ? 413 : 400)
            .json(error.message ?? DEFAULT_API_ERROR_MESSAGE);
        }
      } else if (error instanceof Error) {
        console.error('[rpcFactory] ' + redactUrls(error.message));
        if (!res.headersSent) {
          res.status(500).json(DEFAULT_API_ERROR_MESSAGE);
        }
      } else {
        res.status(500).json(HEALTHY_RPC_SERVICES_ARE_OVER);
      }
    } finally {
      // forces pipeline closure in case of external error/abort
      abortController.abort();
    }
  };
};
