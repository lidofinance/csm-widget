import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import dynamics from './dynamics';
import type { ClientEnv } from './dynamics';
import { parseDefaultChain } from './helpers';

export type PreConfigType = Omit<ClientEnv, 'defaultChain'> & {
  defaultChain: SUPPORTED_CHAINS;
  BASE_PATH_ASSET: string;
};

export const getPreConfig = (): PreConfigType => ({
  ...dynamics,
  // BASE_PATH is inlined at build by next.config `env`
  BASE_PATH_ASSET: process.env.BASE_PATH ?? '',
  defaultChain: parseDefaultChain(dynamics.defaultChain),
});
