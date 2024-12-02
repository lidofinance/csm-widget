import {
  getProviderLabel,
  getStatusLabel,
  rpcMetricsFactory,
} from '@lidofinance/api-metrics';
import { Registry } from 'prom-client';
import { fetchApi } from './fetchApi';

export type TrackedFetchRpcFactoryParameters = {
  prefix: string;
  registry: Registry;
};

export type TrackedFetchApi = (
  base: string,
  method: string,
  chainId: string | number,
  params?: Record<string, string | readonly string[] | undefined>,
  init?: RequestInit,
) => Promise<Response>;

export const trackedFetchApiFactory = ({
  prefix,
  registry,
}: TrackedFetchRpcFactoryParameters): TrackedFetchApi => {
  const { rpcRequestCount, rpcRequestMethods, rpcResponseTime } =
    rpcMetricsFactory(prefix, registry);

  return async (base, method, chainId, params, init) => {
    const provider = getProviderLabel(base);

    rpcRequestCount.labels({ chainId, provider }).inc();
    rpcRequestMethods.labels({ method }).inc();
    const responseTime = rpcResponseTime.startTimer();

    const response = await fetchApi(`${base}/${method}`, params, init);

    const status = getStatusLabel(response.status);
    responseTime({ chainId, provider, status });

    return response;
  };
};
