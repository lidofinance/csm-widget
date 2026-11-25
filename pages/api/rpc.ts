import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';

import { trackedFetchRpcFactory } from '@lidofinance/api-rpc';
import { config } from 'config';
import { getServerConfig } from 'utilsApi/server-config';
import { API_ROUTES } from 'consts/api';
import { METRICS_PREFIX } from 'consts/metrics';
import {
  defaultErrorHandler,
  HttpMethod,
  httpMethodGuard,
  rateLimit,
  requestAddressMetric,
  responseTimeMetric,
  allowedCallAddresses,
  allowedOverrideAddresses,
  allowedLogsAddresses,
  rpcFactory,
} from 'utilsApi';
import Metrics from 'utilsApi/metrics';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

const serverConfig = getServerConfig();

const allowedRPCMethods = [
  'test',
  'eth_call',
  'eth_gasPrice',
  'eth_getCode',
  'eth_estimateGas',
  'eth_getBlockByNumber',
  'eth_feeHistory',
  'eth_maxPriorityFeePerGas',
  'eth_getBalance',
  'eth_blockNumber',
  'eth_getTransactionByHash',
  'eth_getTransactionReceipt',
  'eth_getTransactionCount',
  'eth_sendRawTransaction',
  'eth_getLogs',
  'eth_chainId',
  'net_version',
];

const rpc = rpcFactory({
  fetchRPC: trackedFetchRpcFactory({
    registry: Metrics.registry,
    prefix: METRICS_PREFIX,
  }),
  metrics: {
    prefix: METRICS_PREFIX,
    registry: Metrics.registry,
  },
  defaultChain: `${config.defaultChain}`,
  providers: {
    [CHAINS.Mainnet]: serverConfig.rpcUrls_1,
    [CHAINS.Hoodi]: serverConfig.rpcUrls_560048,
  },
  upstreamTimeoutMs: 30_000, // 1M-block eth_getLogs need time to first byte
  validation: {
    allowedRPCMethods,
    allowedCallAddresses,
    allowedOverrideAddresses,
    allowedLogsAddresses,
    maxBatchCount: config.PROVIDER_MAX_BATCH,
    blockEmptyAddressGetLogs: true,
    maxGetLogsRange: 1_000_000, // only 20k blocks size historical queries
    maxResponseSize: 1_000_000, // 1mb max response
  },
});

// first item is innermost: metrics run after method guard and rate limit
export default wrapNextRequest([
  requestAddressMetric(Metrics.request.ethCallToAddress),
  httpMethodGuard([HttpMethod.POST]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.RPC),
  defaultErrorHandler,
])(rpc);
