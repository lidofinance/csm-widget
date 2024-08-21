import { CHAINS } from '@lido-sdk/constants';

/*
TODO: combine constants
- EA json url
- Rewards json url
*/

export type ChainTreeLinkMap = Partial<Record<CHAINS, string>>;

export const LINKS_BY_NETWORK: ChainTreeLinkMap = {
  [CHAINS.Mainnet]: undefined,
  [CHAINS.Holesky]:
    'https://raw.githubusercontent.com/lidofinance/community-staking-module/main/artifacts/holesky/early-adoption/merkle-tree.json',
};

export const getCsmEarlyAdoptionTreeUrl = (chainId: CHAINS | undefined) => {
  if (!chainId) {
    return undefined;
  }
  return LINKS_BY_NETWORK[chainId];
};
