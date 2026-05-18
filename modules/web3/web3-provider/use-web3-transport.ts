import { config } from 'config';
import { useMemo } from 'react';
import {
  type Transport,
  fallback,
  createTransport,
  http,
  Chain,
  UnsupportedProviderMethodError,
  InvalidParamsRpcError,
} from 'viem';

import type { OnResponseFn } from 'viem/_types/clients/transports/fallback';

// We disable those methods so wagmi uses getLogs instead to watch events
// Filters are not suitable for public rpc and break when changing between fallbacks
const DISABLED_METHODS = new Set([
  'eth_newFilter',
  'eth_getFilterChanges',
  'eth_uninstallFilter',
]);

// Viem fallback transport wrapped with project-wide request guards
const guardedFallbackTransport = (mainTransports: Transport[]): Transport => {
  return (params) => {
    const defaultTransport = fallback(mainTransports)(params);
    let externalOnResponse: OnResponseFn;

    const onResponse: OnResponseFn = (response) => {
      if (response.status === 'error' && !(response as any).skipLog) {
        console.warn('[guardedFallbackTransport] transport error', response);
      }
      externalOnResponse?.(response);
    };

    return createTransport(
      {
        key: 'GuardedFallbackTransport',
        name: 'GuardedFallbackTransport',
        //@ts-expect-error invalid typings
        async request(requestParams, options) {
          if (DISABLED_METHODS.has(requestParams.method)) {
            const error = new UnsupportedProviderMethodError(
              new Error(`Method ${requestParams.method} is not supported`),
            );
            onResponse({
              error,
              method: requestParams.method,
              params: params as unknown[],
              transport: defaultTransport,
              status: 'error',
              // skip logging because we expect wagmi to try those
              skipLog: true,
            } as any);
            throw error;
          }

          if (
            requestParams.method === 'eth_getLogs' &&
            Array.isArray(requestParams?.params) &&
            // works for empty array, empty string and all falsish values
            !requestParams.params[0]?.address?.length
          ) {
            const error = new InvalidParamsRpcError(
              new Error(`Empty address for eth_getLogs is not supported`),
            );
            onResponse({
              error,
              method: requestParams.method,
              params: params as unknown[],
              transport: defaultTransport,
              status: 'error',
            });
            throw error;
          }

          defaultTransport.value?.onResponse(onResponse);
          return defaultTransport.request(requestParams, options);
        },
        // crucial cause we quack like a fallback transport and some connectors(WC) rely on this
        type: 'fallback',
      },
      // transport.value contents
      {
        // this is fallbackTransport specific field, used by WC connectors to extract rpc Urls
        transports: defaultTransport.value?.transports,
        // providers that use this transport, use this to set onResponse callback for transport,
        onResponse: (fn: OnResponseFn) => (externalOnResponse = fn),
      },
    );
  };
};

// returns Viem transport map backed by the project's backend RPC
export const useWeb3Transport = (
  supportedChains: Chain[],
  backendRpcMap: Record<number, string>,
) => {
  return useMemo(() => {
    const batchConfig = {
      wait: config.PROVIDER_BATCH_TIME,
      batchSize: config.PROVIDER_MAX_BATCH,
    };

    return supportedChains.reduce(
      (transportMap, chain) => {
        transportMap[chain.id] = guardedFallbackTransport([
          http(backendRpcMap[chain.id], {
            batch: batchConfig,
            name: backendRpcMap[chain.id],
          }),
        ]);
        return transportMap;
      },
      {} as Record<number, Transport>,
    );
  }, [backendRpcMap, supportedChains]);
};
