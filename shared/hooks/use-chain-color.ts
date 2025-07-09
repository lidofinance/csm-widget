import { CHAINS_COLORS } from 'consts';
import { useDappStatus } from 'modules/web3';

export const useChainColor = (): string => {
  const { chainId } = useDappStatus();
  return CHAINS_COLORS[chainId];
};
