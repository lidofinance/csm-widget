import { CHAINS } from '@lido-sdk/constants';
import { getConfig } from 'config';

const { defaultChain } = getConfig();

// TODO: useChainName
export const getChainName = (chainId = defaultChain) => {
  return CHAINS[chainId]?.toLowerCase();
};
