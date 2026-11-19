import type { ServerLogger } from '@lidofinance/api-logger';
import { RpcProviders } from '@lidofinance/next-pages';
import { iterateUrls } from '@lidofinance/rpc';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { ReadableStream } from 'node:stream/web';
import { Counter, Registry } from 'prom-client';
import type { TrackedFetchApi } from './trackedFetchApiFactory';
import { UnsupportedChainIdError, UnsupportedHTTPMethodError } from './errors';
import { maxSizeTransformFactory } from './validation';
import { DEFAULT_API_ERROR_MESSAGE } from '@lidofinance/next-api-wrapper';

export type ApiProxyRequest = {
  params: Record<string, string>;
  body?: string;
};

export type ApiFactoryParams = {
  metrics: {
    prefix: string;
    registry: Registry;
  };
  providers: RpcProviders;
  fetchApi: TrackedFetchApi;
  /**
   * @deprecated you should mask logs via pino & satanizer, see policies
   * for additional details or reach out ui/secops
   */
  serverLogger?: ServerLogger;
  defaultChain: string | number;
  // If we don't specify allowed Api methods, then we can't use
  //  fetchRPC with prometheus, otherwise it will blow up, if someone will send arbitrary
  //  methods
  allowedMethods: string[];
  parseRequest: (req: NextApiRequest) => ApiProxyRequest;
  maxResponseSize?: number;
};

export const apiFactory = ({
  metrics: { prefix, registry },
  providers,
  fetchApi,
  serverLogger = console,
  allowedMethods,
  parseRequest,
  maxResponseSize = 5_000_000,
}: ApiFactoryParams) => {
  const apiRequestBlocked = new Counter({
    name: prefix + 'api_service_request_blocked',
    help: 'Api service request blocked',
    labelNames: [],
    registers: [],
  });
  registry.registerMetric(apiRequestBlocked);

  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
      // Accept only GET and POST requests
      if (req.method !== 'GET' && req.method !== 'POST') {
        // We don't care about tracking blocked requests here
        throw new UnsupportedHTTPMethodError();
      }

      const { method: [chainString, ...methodParts] = [] } = req.query;
      const method = methodParts.join('/');

      const chainId = Number(chainString);

      // Allow only chainId of specified chains
      if (providers[chainId] == null) {
        // We don't care about tracking blocked requests here
        throw new UnsupportedChainIdError();
      }

      // Check if provided methods are allowed
      if (!allowedMethods.includes(method)) {
        apiRequestBlocked.inc();
        throw new Error(`Api method ${method} isn't allowed`);
      }

      const { params, body } = parseRequest(req);

      const requested = await iterateUrls(
        providers[chainId],
        // TODO: consider adding verification that body is actually matches FetchRpcInitBody
        (url) =>
          fetchApi(
            url,
            method,
            chainId,
            params,
            body !== undefined ? { method: 'POST', body } : undefined,
          ),
        serverLogger.error,
      );

      if (!requested.ok) {
        // an upstream failure must not inherit the route's public cache headers
        res.setHeader('Cache-Control', 'no-store');
      }

      res.setHeader(
        'Content-Type',
        requested.headers.get('Content-Type') ?? 'application/json',
      );
      res.status(requested.status);
      if (requested.body) {
        try {
          // destroys both the upstream body and res on error
          await pipeline(
            Readable.fromWeb(requested.body as ReadableStream),
            maxSizeTransformFactory(maxResponseSize, () =>
              apiRequestBlocked.inc(),
            ),
            res,
          );
        } catch (error) {
          // too late to send a status once the body has started
          if (!res.headersSent) throw error;
          serverLogger.error(
            error instanceof Error ? error.message : DEFAULT_API_ERROR_MESSAGE,
          );
        }
      } else {
        res.json('There are a problems with Api provider');
      }
    } catch (error) {
      if (error instanceof Error) {
        // TODO: check if there are errors duplication with iterateUrls
        serverLogger.error(error.message ?? DEFAULT_API_ERROR_MESSAGE);
      }
      throw error;
    }
  };
};
