import { wrapRequest as wrapNextRequest } from '@lidofinance/next-api-wrapper';
import { rpcFactory } from '@lidofinance/next-pages';

import { trackedFetchRpcFactory } from '@lidofinance/api-rpc';
import { config, secretConfig } from 'config';
import { API_ROUTES } from 'consts/api';
import { CHAINS } from 'consts/chains';
import { METRICS_PREFIX } from 'consts/metrics';
import {
  CONTRACT_CALL_ADDRESSES,
  CONTRACT_LOGS_ADDRESSES,
  defaultErrorHandler,
  /* `fetchRPC` is a function used to make RPC (Remote Procedure Call) requests to a server. It is
  likely responsible for handling the actual communication with the server. */
  rateLimit,
  requestAddressMetric,
  responseTimeMetric,
} from 'utilsApi';
import Metrics from 'utilsApi/metrics';

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
    [CHAINS.Holesky]: secretConfig.rpcUrls_17000,
    [CHAINS.Hoodi]: secretConfig.rpcUrls_560048,
  },
  validation: {
    allowedRPCMethods: [
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
    ],
    allowedCallAddresses: CONTRACT_CALL_ADDRESSES,
    allowedLogsAddresses: CONTRACT_LOGS_ADDRESSES,
    maxGetLogsRange: 3_000_000, // ~ 1 year in historical queries // TODO: improve
  },
});

export default wrapNextRequest([
  rateLimit,
  responseTimeMetric(Metrics.request.apiTimings, API_ROUTES.RPC),
  requestAddressMetric(Metrics.request.ethCallToAddress),
  defaultErrorHandler,
])(rpc);
