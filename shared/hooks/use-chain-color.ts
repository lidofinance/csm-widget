import { CHAINS } from 'consts';
import { useDappStatus } from 'modules/web3';

export const CHAINS_COLORS: Record<CHAINS, string> = {
  [CHAINS.Mainnet]: '#29b6af',
  [CHAINS.Holesky]: '#AA346A',
  [CHAINS.Hoodi]: '#AA346A',
};

export const useChainColor = (): string => {
  const { chainId } = useDappStatus();
  return CHAINS_COLORS[chainId];
};
