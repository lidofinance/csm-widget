import { CHAINS } from '@lido-sdk/constants';

export type LinkGetterMap = Partial<Record<CHAINS, (key: string) => string>>;

export const VALIDATOR_LINK_NAME = 'beaconcha.in';

export const LINK_GETTER_BY_NETWORK: LinkGetterMap = {
  [CHAINS.Mainnet]: (key: string) => `https://beaconcha.in/validator/${key}`,
  [CHAINS.Holesky]: (key: string) =>
    `https://holesky.beaconcha.in/validator/${key}`,
};

export const getValidatorLinkGetter = (chainId: CHAINS | undefined) => {
  if (!chainId) {
    return undefined;
  }
  return LINK_GETTER_BY_NETWORK[chainId];
};
