import {
  cacheControl,
  wrapRequest as wrapNextRequest,
} from '@lidofinance/next-api-wrapper';
import { config } from 'config';
import { API_ROUTES } from 'consts/api';
import { API } from 'types';
import { getFirstParam } from 'utils';
import { defaultErrorHandler, rateLimit, responseTimeMetric } from 'utilsApi';
import Metrics from 'utilsApi/metrics';
import { getWrappedStats } from 'utilsApi/wrapped-stats';

const wrapped: API = async (req, res) => {
  const id = getFirstParam(req.query['node-operator-id']);
  if (!id) {
    res.statusCode = 400;
    throw new Error('Error: empty query param node-operator-id');
  }

  const response = await getWrappedStats(id);

  res.json(response);
};

export default wrapNextRequest([
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.WRAPPED),
  cacheControl({ headers: config.CACHE_DEFAULT_HEADERS }),
  defaultErrorHandler,
])(wrapped);
