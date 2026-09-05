import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';

import { config as appConfig } from 'config';
import { API_ROUTES } from 'consts/api';
import { METRICS_PREFIX } from 'consts/metrics';
import {
  defaultErrorHandler,
  HttpMethod,
  httpMethodGuard,
  rateLimit,
  responseTimeMetric,
} from 'utilsApi';
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
  defaultChain: `${appConfig.defaultChain}`,
  providers: clApiUrls,
});

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.GET, HttpMethod.POST]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.CL),
  defaultErrorHandler,
])(api);

// SDK posts up to 5000 pubkeys per request (~0.5 MB); Next's default is 1 MB
export const config = { api: { bodyParser: { sizeLimit: '2mb' } } };
