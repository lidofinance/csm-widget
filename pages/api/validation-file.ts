import type { NextApiRequest, NextApiResponse } from 'next';
import {
  wrapRequest as wrapNextRequest,
  cacheControl,
} from '@lidofinance/next-api-wrapper';

import { config } from 'config';
import { API_ROUTES } from 'consts/api';
import {
  defaultErrorHandler,
  responseTimeMetric,
  rateLimit,
  httpMethodGuard,
  HttpMethod,
} from 'utilsApi';
import Metrics from 'utilsApi/metrics';
import { loadValidationFile } from 'utilsApi/load-validation-file';

const handler = async (_: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json(await loadValidationFile());
};

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.GET]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.VALIDATION_FILE),
  cacheControl({ headers: config.CACHE_VALIDATION_HEADERS }),
  defaultErrorHandler,
])(handler);
