import { CHAINS } from '@lido-sdk/constants';

export type ChainTreeLinkMap = Partial<Record<CHAINS, string>>;

export const LINKS_BY_NETWORK: ChainTreeLinkMap = {
  // @note local mainnetish
  [CHAINS.Mainnet]: '/artifacts/merkle-tree.json',
  // @note devnet.1
  [CHAINS.Holesky]:
    'https://raw.githubusercontent.com/lidofinance/community-staking-module/main/artifacts/devnet-1/early-adoption/addresses.json',
};

export const getCSMEarlyAdoptionTreeUrl = (chainId: CHAINS | undefined) => {
  if (!chainId) {
    return undefined;
  }
  return LINKS_BY_NETWORK[chainId];
};
