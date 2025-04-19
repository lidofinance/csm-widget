import { CHAIN_NAMES, ChainNames } from 'consts';
import { useDappStatus } from 'modules/web3';

export const useChainName = <T extends boolean = false>(
  capitalize?: T,
): T extends true ? ChainNames : Lowercase<ChainNames> => {
  const { chainId } = useDappStatus();
  const name = CHAIN_NAMES[chainId];
  return capitalize ? (name as any) : (name.toLowerCase() as any);
};
