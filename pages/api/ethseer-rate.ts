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
import { getEthSeerRate } from 'utilsApi/getEthSeerRate';

const cache = new Cache<string, unknown>();

// Proxy for third-party API.
const ethseerRate: API = async (req, res) => {
  const id = getFirstParam(req.query['node-operator-id']);
  if (!id) {
    res.statusCode = 400;
    throw new Error('Error: empty query param node-operator-id');
  }

  const cacheKey = `${config.CACHE_ETHSEER_RATE_KEY}_${id}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    res.json(cached);
  } else {
    const response = await getEthSeerRate(id);
    cache.put(cacheKey, response, config.CACHE_ETH_PRICE_TTL);

    res.json(response);
  }
};

export default wrapNextRequest([
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.ETHSEER_RATE),
  cacheControl({ headers: config.CACHE_ETHSEER_RATE_HEADERS }),
  defaultErrorHandler,
])(ethseerRate);
