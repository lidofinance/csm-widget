import type { ServerLogger } from '@lidofinance/api-logger';
import {
  DEFAULT_API_ERROR_MESSAGE,
  HEALTHY_RPC_SERVICES_ARE_OVER,
  RpcProviders,
  UnsupportedChainIdError,
  UnsupportedHTTPMethodError,
} from '@lidofinance/next-pages';
import { iterateUrls } from '@lidofinance/rpc';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Readable } from 'node:stream';
import { ReadableStream } from 'node:stream/web';
import { Counter, Registry } from 'prom-client';
import type { TrackedFetchApi } from './trackedFetchApiFactory';

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
};

export const apiFactory = ({
  metrics: { prefix, registry },
  providers,
  fetchApi,
  serverLogger = console,
  allowedMethods,
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
      // Accept only GET requests
      if (req.method !== 'GET') {
        // We don't care about tracking blocked requests here
        throw new UnsupportedHTTPMethodError();
      }

      const { method: [chainString, ...methodParts] = [], ...params } =
        req.query;
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

      const requested = await iterateUrls(
        providers[chainId],
        // TODO: consider adding verification that body is actually matches FetchRpcInitBody
        (url) => fetchApi(url, method, chainId, params),
        serverLogger.error,
      );

      res.setHeader(
        'Content-Type',
        requested.headers.get('Content-Type') ?? 'application/json',
      );
      if (requested.body) {
        Readable.fromWeb(requested.body as ReadableStream).pipe(res);
      } else {
        res
          .status(requested.status)
          .json('There are a problems with Api provider');
      }
    } catch (error) {
      if (error instanceof Error) {
        // TODO: check if there are errors duplication with iterateUrls
        serverLogger.error(error.message ?? DEFAULT_API_ERROR_MESSAGE);
        res.status(500).json(error.message ?? DEFAULT_API_ERROR_MESSAGE);
      } else {
        res.status(500).json(HEALTHY_RPC_SERVICES_ARE_OVER);
      }
    }
  };
};
