import { secretConfig } from 'config';
import { CHAINS } from 'consts/chains';

export const clApiUrls: Record<CHAINS, [string, ...string[]]> = {
  [CHAINS.Mainnet]: secretConfig.clApiUrls_1,
  [CHAINS.Holesky]: secretConfig.clApiUrls_17000,
};
