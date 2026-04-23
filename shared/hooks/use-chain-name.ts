import { CHAIN_METADATA } from 'consts';
import { useDappStatus } from 'modules/web3';

export const useChainName = <T extends boolean = false>(
  capitalize?: T,
): T extends true ? string : Lowercase<string> => {
  const { chainId } = useDappStatus();
  const name = CHAIN_METADATA[chainId].name;
  return capitalize ? (name as any) : (name.toLowerCase() as any);
};
