import { API } from '@lidofinance/next-api-wrapper';
import { Cache } from 'memory-cache';
import type { NextApiRequest } from 'next';
import { FetcherError } from 'utils/fetcher-error';
import { CACHE_NO_STORE_HEADERS } from 'config/groups/cache';
import { standardFetcher } from 'utils/standard-fetcher';
import { responseTimeExternalMetricWrapper } from './external-metrics';

type ProxyOptions = {
  proxyUrl: string | ((req: NextApiRequest) => string);
  cacheTTL: number;
  timeout?: number;
  ignoreParams?: boolean;
  transformData?: (data: any) => any;
  metricsHost?: string;
  /** Extra upstream headers from the request; cache hits don't reach upstream. */
  forwardHeaders?: (req: NextApiRequest) => Record<string, string>;
};

export const createCachedProxy = ({
  cacheTTL,
  proxyUrl,
  ignoreParams,
  timeout = 5000,
  transformData = (data) => data,
  metricsHost,
  forwardHeaders,
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
      // set() is case-insensitive, so forwarded headers can't override these
      const headers = new Headers(forwardHeaders?.(req));
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');

      const data = await responseTimeExternalMetricWrapper({
        target: metricsHost || proxyUrlString,
        route: 'cached-proxy',
        request: () =>
          standardFetcher(url, {
            signal: AbortSignal.timeout(timeout),
            headers,
          }),
      });

      const transformedData = transformData(data) ?? data;

      cache.put(cacheKey, transformedData, cacheTTL);
      res.json(transformedData);
    } catch (e) {
      // route-level cacheControl set public caching before the handler ran
      res.setHeader('Cache-Control', CACHE_NO_STORE_HEADERS);
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
