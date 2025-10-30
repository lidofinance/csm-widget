import {
  cacheControl,
  wrapRequest as wrapNextRequest,
} from '@lidofinance/next-api-wrapper';
import { Cache } from 'memory-cache';
import { config } from 'config';
import { API_ROUTES } from 'consts/api';
import { defaultErrorHandler, rateLimit, responseTimeMetric } from 'utilsApi';
import Metrics from 'utilsApi/metrics';
import { API } from 'types';
import { getFirstParam } from 'utils';
import { getPerformance } from 'utilsApi/getPerformance';

const cache = new Cache<string, unknown>();

// Proxy for third-party API.
const performanceRate: API = async (req, res) => {
  const id = getFirstParam(req.query['node-operator-id']);
  if (!id) {
    res.statusCode = 400;
    throw new Error('Error: empty query param node-operator-id');
  }

  const cacheKey = `${config.CACHE_MIGALABS_RATE_KEY}_${id}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    res.json(cached);
  } else {
    const response = await getPerformance(id);
    cache.put(cacheKey, response, config.CACHE_MIGALABS_RATE_TTL);

    res.json(response);
  }
};

export default wrapNextRequest([
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.PERFORMANCE),
  cacheControl({ headers: config.CACHE_MIGALABS_RATE_HEADERS }),
  defaultErrorHandler,
])(performanceRate);
