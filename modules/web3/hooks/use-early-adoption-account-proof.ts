import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { compareLowercase, findProofInTree } from 'utils';
import { useConfig } from 'wagmi';
import { readCsEarlyAdoptionIsConsumed } from '../generated';
import { useDappStatus } from './use-dapp-status';
import { useEarlyAdoptionTree } from './use-early-adoption-tree';

export const useEarlyAdoptionAccountProof = () => {
  const { address } = useDappStatus();
  const { data: tree } = useEarlyAdoptionTree();
  const config = useConfig();

  return useQuery({
    queryKey: ['early-adoption-proof', address, tree?.root],
    enabled: !!address && !!tree,
    staleTime: Infinity,
    queryFn: async () => {
      invariant(tree);
      invariant(address);

      const proof = findProofInTree(tree, (leaf) =>
        compareLowercase(leaf[0], address),
      );

      const consumed = await readCsEarlyAdoptionIsConsumed(config, {
        args: [address],
      });

      return { proof, consumed };
    },
  });
};
