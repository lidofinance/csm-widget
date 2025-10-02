import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';

import { trackedFetchRpcFactory } from '@lidofinance/api-rpc';
import { config, secretConfig } from 'config';
import { API_ROUTES } from 'consts/api';
import { METRICS_PREFIX } from 'consts/metrics';
import {
  defaultErrorHandler,
  HttpMethod,
  httpMethodGuard,
  /* `fetchRPC` is a function used to make RPC (Remote Procedure Call) requests to a server. It is
  likely responsible for handling the actual communication with the server. */
  rateLimit,
  requestAddressMetric,
  responseTimeMetric,
  allowedCallAddresses,
  allowedLogsAddresses,
  rpcFactory,
} from 'utilsApi';
import Metrics from 'utilsApi/metrics';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

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
    [CHAINS.Mainnet]: secretConfig.rpcUrls_1,
    [CHAINS.Hoodi]: secretConfig.rpcUrls_560048,
  },
  validation: {
    allowedRPCMethods,
    allowedCallAddresses,
    allowedLogsAddresses,
    maxBatchCount: config.PROVIDER_MAX_BATCH,
    blockEmptyAddressGetLogs: true,
    maxGetLogsRange: 1_000_000, // only 20k blocks size historical queries // FIXME: limit to 20K
    maxResponseSize: 1_000_000, // 1mb max response
  },
});

export default wrapNextRequest([
  httpMethodGuard([HttpMethod.POST]),
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.RPC),
  requestAddressMetric(Metrics.request.ethCallToAddress),
  defaultErrorHandler,
])(rpc);
