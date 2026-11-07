import { MODULE_NAME, SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import dynamics from './dynamics';
import type { ClientEnv } from './dynamics';
import { parseDefaultChain } from './helpers';

export type PreConfigType = Omit<ClientEnv, 'defaultChain'> & {
  module: MODULE_NAME;
  defaultChain: SUPPORTED_CHAINS;
  BASE_PATH_ASSET: string;
};

export const getPreConfig = (): PreConfigType => ({
  ...dynamics,
  // MODULE and BASE_PATH are inlined at build by next.config `env`
  BASE_PATH_ASSET: process.env.BASE_PATH ?? '',
  module: MODULE_NAME[process.env.MODULE as 'CSM' | 'CM'] ?? MODULE_NAME.CSM,
  defaultChain: parseDefaultChain(dynamics.defaultChain),
});
