import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';

import { config } from 'config';
import { API_ROUTES } from 'consts/api';
import { METRICS_PREFIX } from 'consts/metrics';
import { defaultErrorHandler, rateLimit, responseTimeMetric } from 'utilsApi';
import { apiFactory, trackedFetchApiFactory } from 'utilsApi/api';
import { clApiUrls } from 'utilsApi/clApiUrls';
import Metrics from 'utilsApi/metrics';

const fetchApi = trackedFetchApiFactory({
  registry: Metrics.registry,
  prefix: METRICS_PREFIX,
});

const api = apiFactory({
  fetchApi,
  serverLogger: console,
  metrics: {
    prefix: METRICS_PREFIX,
    registry: Metrics.registry,
  },
  allowedMethods: ['eth/v1/beacon/states/head/validators'],
  defaultChain: `${config.defaultChain}`,
  providers: clApiUrls,
});

export default wrapNextRequest([
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.CL),
  defaultErrorHandler,
])(api);
