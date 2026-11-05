import getConfigNext from 'next/config';
import { default as dynamics } from './dynamics';
import { MODULE_NAME, SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { parseDefaultChain } from './helpers';
import { resolveClientModule } from './module-override';

const { publicRuntimeConfig, serverRuntimeConfig } = getConfigNext();

export type PreConfigType = Omit<typeof publicRuntimeConfig, 'module'> &
  typeof dynamics & {
    module: MODULE_NAME;
    envModule: MODULE_NAME;
    defaultChain: SUPPORTED_CHAINS;
    BASE_PATH_ASSET: string;
  };

const envConfig = {
  ...publicRuntimeConfig,
  ...(typeof window !== 'undefined' ? window.__env__ : dynamics),
};

const envModule = MODULE_NAME[publicRuntimeConfig.module];
const defaultChain = parseDefaultChain(envConfig.defaultChain);
const activeModule = envConfig.isTestEnv
  ? resolveClientModule(envModule, defaultChain)
  : envModule;

// `getPreConfig()` needs for internal using in 'config/groups/*'
// Do not use `getPreConfig()` outside of 'config/groups/*'
export const getPreConfig = (): PreConfigType => {
  const BASE_PATH_ASSET = dynamics.ipfsMode
    ? '.'
    : (serverRuntimeConfig.basePath ?? '') ||
      (publicRuntimeConfig.basePath ?? '');

  return {
    BASE_PATH_ASSET,
    ...envConfig,
    defaultChain,
    envModule,
    module: activeModule,
  };
};

// `preConfig` needs for external internal in 'config/groups/*'
// Not use `preConfig` outside of 'config/groups/*'
export const preConfig = getPreConfig();
