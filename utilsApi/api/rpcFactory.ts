import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { ReadableStream } from 'node:stream/web';

import { DEFAULT_API_ERROR_MESSAGE } from '@lidofinance/next-api-wrapper';
import type { FetchRpcInitBody } from '@lidofinance/rpc';
import { iterateUrls } from '@lidofinance/rpc';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Counter } from 'prom-client';
import { redactUrls } from './redact-urls';
import {
  ClientError,
  HEALTHY_RPC_SERVICES_ARE_OVER,
  SizeTooLargeError,
} from './errors';
import {
  DEFAULT_UPSTREAM_TIMEOUT_MS,
  withUpstreamTimeout,
} from './upstream-timeout';
import type { RPCFactoryParams } from './types';
import {
  baseRequestValidationFactory,
  ethCallValidationFactory,
  ethGetLogsValidationFactory,
  rpcMethodsValidationFactory,
  shouldValidateRpcMethod,
  streamMaxSizeValidationFactory,
} from './validation';

export const rpcFactory = ({
  metrics,
  providers,
  fetchRPC,
  defaultChain,
  validation,
  serverLogger = console,
  upstreamTimeoutMs = DEFAULT_UPSTREAM_TIMEOUT_MS,
}: RPCFactoryParams) => {
  const {
    allowedRPCMethods,
    allowedCallAddresses,
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

  const validateEthCall =
    allowedCallAddresses &&
    shouldValidateRpcMethod('eth_call', allowedRPCMethods)
      ? ethCallValidationFactory(allowedCallAddresses)
      : undefined;

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

  const requestRPC = (chainId: number, body: FetchRpcInitBody) =>
    iterateUrls(
      providers[chainId],
      // TODO: consider adding verification that body is actually matches FetchRpcInitBody
      (url) =>
        withUpstreamTimeout(upstreamTimeoutMs, (signal) =>
          fetchRPC(url, { body, ...(signal ? { signal } : {}) }, { chainId }),
        ),
      (error, { failedUrl, nextUrl, attempt }) => {
        const failedProvider = redactUrls(failedUrl);
        const message = redactUrls(
          error instanceof Error ? error.message : String(error),
        );
        if (nextUrl) {
          const nextProvider = redactUrls(nextUrl);
          serverLogger.warn(
            `[rpcFactory] RPC provider ${failedProvider} failed on attempt ${attempt} (${message}), switching to fallback ${nextProvider}`,
            { chainId, failedProvider, nextProvider, attempt },
          );
        } else {
          serverLogger.error(
            `[rpcFactory] all RPC providers for chain ${chainId} failed after ${attempt} attempts (${message})`,
            { chainId, failedProvider, attempt },
          );
        }
      },
    );

  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const abortController = new AbortController();
    try {
      const { chainId, requests } = validateBaseRequest(req);

      const validationContext = {
        chainId,
        rpcRequestBlocked,
        requestRPC,
      };

      // We throw HTTP error for ANY invalid RPC request out of batch
      // because we assume that frontend must not send invalid requests at all
      for (const request of requests) {
        validateRpcMethod(request, validationContext);

        const method = request.method;

        if (method === 'eth_call' && validateEthCall) {
          validateEthCall(request, validationContext);
        }
        if (method === 'eth_getLogs' && validateEthGetLogs) {
          await validateEthGetLogs(request, validationContext);
        }
      }

      const proxyedRPC = await requestRPC(
        chainId,
        req.body as FetchRpcInitBody,
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
        serverLogger.error(
          '[rpcFactory]' +
            redactUrls(error.message ?? DEFAULT_API_ERROR_MESSAGE),
        );
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
