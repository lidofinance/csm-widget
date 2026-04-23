import getConfigNext from 'next/config';
import { default as dynamics } from './dynamics';
import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfigNext();

export type PreConfigType = typeof publicRuntimeConfig &
  typeof dynamics & {
    defaultChain: SUPPORTED_CHAINS;
    BASE_PATH_ASSET: string;
  };

// `getPreConfig()` needs for internal using in 'config/groups/*'
// Do not use `getPreConfig()` outside of 'config/groups/*'
export const getPreConfig = (): PreConfigType => {
  const BASE_PATH_ASSET = dynamics.ipfsMode
    ? '.'
    : (serverRuntimeConfig.basePath ?? '') ||
      (publicRuntimeConfig.basePath ?? '');

  return {
    BASE_PATH_ASSET,

    ...publicRuntimeConfig,

    ...(typeof window !== 'undefined' ? window.__env__ : dynamics),
  };
};

// `preConfig` needs for external internal in 'config/groups/*'
// Not use `preConfig` outside of 'config/groups/*'
export const preConfig = getPreConfig();
