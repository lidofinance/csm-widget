import { CHAINS } from '@lido-sdk/constants';
import { config } from 'config';

export type ChainMap = Partial<Record<CHAINS, string>>;

export const BLOCK_BY_NETWORK: ChainMap = {
  [CHAINS.Mainnet]: undefined,
  // @note devnet.1
  [CHAINS.Holesky]:
    process.env.DEVNET || config.isDevnet ? '0x1a3f67' : '0x1b143a',
};

export const getCSMDeplymentBlockNumber = (chainId: CHAINS | undefined) => {
  if (!chainId) {
    return undefined;
  }
  return BLOCK_BY_NETWORK[chainId];
};
