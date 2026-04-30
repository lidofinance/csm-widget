import { CHAIN_METADATA } from 'consts';
import { useDappStatus } from 'modules/web3';

export const useChainColor = (): string => {
  const { chainId } = useDappStatus();
  return CHAIN_METADATA[chainId]?.color;
};
