import { CHAINS } from '@lido-sdk/constants';

export type KeyLinkMap = Partial<Record<CHAINS, (key: string) => string>>;

export const KEY_LINKS_BY_NETWORK: KeyLinkMap = {
  [CHAINS.Mainnet]: (key: string) => `https://beaconcha.in/validator/${key}`,
  [CHAINS.Holesky]: (key: string) =>
    `https://holesky.beaconcha.in/validator/${key}`,
};

export const getKeyLingGetter = (chainId: CHAINS | undefined) => {
  if (!chainId) {
    return undefined;
  }
  return KEY_LINKS_BY_NETWORK[chainId];
};
