import { CHAINS } from '@lido-sdk/constants';

export type ChainMap = Partial<Record<CHAINS, string>>;

export const BLOCK_BY_NETWORK: ChainMap = {
  // @note local mainnetish
  [CHAINS.Mainnet]: undefined,
  // @note devnet.1
  [CHAINS.Holesky]: '0x1a3f67',
};

export const getCSMDeplymentBlockNumber = (chainId: CHAINS | undefined) => {
  if (!chainId) {
    return undefined;
  }
  return BLOCK_BY_NETWORK[chainId];
};
