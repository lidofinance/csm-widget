import type { NextApiRequest, NextApiResponse } from 'next';
import {
  wrapRequest as wrapNextRequest,
  cacheControl,
} from '@lidofinance/next-api-wrapper';
import { config } from 'config';
import { API_ROUTES } from 'consts/api';
import { responseTimeMetric, defaultErrorHandler, rateLimit } from 'utilsApi';

import Metrics from 'utilsApi/metrics';
import { metricsFactory } from '@lidofinance/next-pages';

const metricsHandler = metricsFactory({ registry: Metrics.registry });

// metricsFactory sends a string with no Content-Type, and Next sets none for strings
const metrics = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Content-Type', Metrics.registry.contentType);
  return metricsHandler(req, res);
};

export default wrapNextRequest([
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.METRICS),
  cacheControl({ headers: config.CACHE_NO_STORE_HEADERS }),
  defaultErrorHandler,
])(metrics);
