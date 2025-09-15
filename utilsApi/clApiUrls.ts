import { CSM_SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { secretConfig } from 'config';

export const clApiUrls: Record<CSM_SUPPORTED_CHAINS, [string, ...string[]]> = {
  [CHAINS.Mainnet]: secretConfig.clApiUrls_1,
  [CHAINS.Hoodi]: secretConfig.clApiUrls_560048,
};
