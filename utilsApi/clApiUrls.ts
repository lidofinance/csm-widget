import { SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { getServerConfig } from './server-config';

export const clApiUrls: Record<SUPPORTED_CHAINS, [string, ...string[]]> = {
  [CHAINS.Mainnet]: getServerConfig().clApiUrls_1,
  [CHAINS.Hoodi]: getServerConfig().clApiUrls_560048,
};
