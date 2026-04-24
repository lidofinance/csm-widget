import getConfigNext from 'next/config';
import { type Modify, parseUrlList, toBoolean } from './helpers';
import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';

const { serverRuntimeConfig } = getConfigNext();

export type SecretConfigType = Modify<
  typeof serverRuntimeConfig,
  {
    defaultChain: SUPPORTED_CHAINS;

    rpcUrls_1: [string, ...string[]];
    rpcUrls_560048: [string, ...string[]];

    clApiUrls_1: [string, ...string[]];
    clApiUrls_560048: [string, ...string[]];

    cspReportOnly: boolean;

    rateLimit: number;
    rateLimitTimeFrame: number;
  }
>;

// 'getSecretConfig()' is required for the backend side.
// We can't merge with 'getPreConfig()' because we want to split responsibility
//
// Also you can note that 'getSecretConfig' is just a proxy for 'serverRuntimeConfig'
// because we want similar approach with 'getConfig'
export const getSecretConfig = (): SecretConfigType => {
  return {
    ...serverRuntimeConfig,

    // Keep fallback as in 'env-dynamics.mjs'
    defaultChain: Number(serverRuntimeConfig.defaultChain) || 560048,

    // Hack: in the current implementation we can treat an empty array as a "tuple" (conditionally)
    rpcUrls_1: parseUrlList(serverRuntimeConfig.rpcUrls_1) as [
      string,
      ...string[],
    ],
    rpcUrls_560048: parseUrlList(serverRuntimeConfig.rpcUrls_560048) as [
      string,
      ...string[],
    ],

    clApiUrls_1: parseUrlList(serverRuntimeConfig.clApiUrls_1) as [
      string,
      ...string[],
    ],
    clApiUrls_560048: parseUrlList(serverRuntimeConfig.clApiUrls_560048) as [
      string,
      ...string[],
    ],

    cspReportOnly: toBoolean(serverRuntimeConfig.cspReportOnly),

    rateLimit: Number(serverRuntimeConfig.rateLimit) || 100,
    rateLimitTimeFrame: Number(serverRuntimeConfig.rateLimitTimeFrame) || 60, // 1 minute;
  };
};

export const secretConfig = getSecretConfig();
