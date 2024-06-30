import { CHAINS } from '@lido-sdk/constants';

export type ChainTreeLinkMap = Partial<Record<CHAINS, string>>;

export const LINKS_BY_NETWORK: ChainTreeLinkMap = {
  [CHAINS.Mainnet]: undefined,
  // @note devnet.1
  [CHAINS.Holesky]: process.env.DEVNET
    ? 'https://raw.githubusercontent.com/lidofinance/community-staking-module/main/artifacts/devnet-1/early-adoption/merkle-tree.json'
    : 'https://raw.githubusercontent.com/lidofinance/community-staking-module/main/artifacts/holesky/early-adoption/merkle-tree.json',
};

export const getCSMEarlyAdoptionTreeUrl = (chainId: CHAINS | undefined) => {
  if (!chainId) {
    return undefined;
  }
  return LINKS_BY_NETWORK[chainId];
};
