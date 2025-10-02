import { API } from '@lidofinance/next-api-wrapper';
import { Cache } from 'memory-cache';
import type { NextApiRequest } from 'next';
import { FetcherError } from 'utils/fetcher-error';
import { standardFetcher } from 'utils/standard-fetcher';
import Metrics from './metrics/metrics';

type ProxyOptions = {
  proxyUrl: string | ((req: NextApiRequest) => string);
  cacheTTL: number;
  timeout?: number;
  ignoreParams?: boolean;
  transformData?: (data: any) => any;
  metricsHost?: string;
};

// Simple wrapper for external metrics tracking
const responseTimeExternalMetricWrapper = async <T>({
  payload,
  request,
}: {
  payload: string;
  request: () => Promise<T>;
}): Promise<T> => {
  const endMetric = Metrics.request.apiTimingsExternal.startTimer({
    hostname: new URL(payload).hostname,
    route: 'cached-proxy',
    entity: 'external',
    status: '2xx',
  });

  try {
    const result = await request();
    endMetric({ status: '2xx' });
    return result;
  } catch (error) {
    let status = '5xx';
    if (
      error instanceof FetcherError &&
      error.status >= 400 &&
      error.status < 500
    ) {
      status = '4xx';
    }
    endMetric({ status });
    throw error;
  }
};

export const createCachedProxy = ({
  cacheTTL,
  proxyUrl,
  ignoreParams,
  timeout = 5000,
  transformData = (data) => data,
  metricsHost,
}: ProxyOptions): API => {
  const cache = new Cache<string, any>();
  return async (req, res) => {
    const params =
      ignoreParams || Object.keys(req.query).length === 0
        ? null
        : new URLSearchParams(
            Object.entries(req.query).reduce(
              (obj, [k, v]) => {
                if (typeof v === 'string') obj[k] = v;
                return obj;
              },
              {} as Record<string, string>,
            ),
          );

    // Generate the actual proxy URL, passing req if the function accepts it
    const proxyUrlString =
      typeof proxyUrl === 'function' ? proxyUrl(req) : proxyUrl;

    const cacheKey = `${proxyUrlString}-${params?.toString() ?? ''}`;

    const cachedValue = cache.get(cacheKey);
    if (cachedValue) {
      res.json(cachedValue);
      return;
    }
    const url = proxyUrlString + (params ? `?${params.toString()}` : '');

    try {
      const data = await responseTimeExternalMetricWrapper({
        payload: metricsHost || proxyUrlString,
        request: () =>
          standardFetcher(url, {
            signal: AbortSignal.timeout(timeout),
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }),
      });

      const transformedData = transformData(data) ?? data;

      cache.put(cacheKey, transformedData, cacheTTL);
      res.json(transformedData);
    } catch (e) {
      if (e instanceof FetcherError && e.status >= 400 && e.status < 500) {
        console.warn(`[CachedProxy]Forwarding ${e.status} error from ${url}`);
        res.status(e.status);
        res.json({ error: e.message });
        return;
      }
      console.warn(`[CachedProxy] Failed to proxy from ${url}`, e);
      res.status(500).end();
      throw e;
    }
  };
};
