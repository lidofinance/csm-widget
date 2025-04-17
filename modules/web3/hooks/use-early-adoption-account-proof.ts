import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { compareLowercase, findProofInTree } from 'utils';
import { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { useCSEarlyAdoption } from './use-contracts';
import { useDappStatus } from './use-dapp-status';
import { useEarlyAdoptionTree } from './use-early-adoption-tree';

export const useEarlyAdoptionAccountProof = () => {
  const { address } = useDappStatus();
  const { data: tree } = useEarlyAdoptionTree();

  const { data: consumed } = useReadContract({
    ...useCSEarlyAdoption(),
    functionName: 'isConsumed',
    args: [address as Address],
    query: {
      enabled: !!address,
    },
  });

  return useQuery({
    queryKey: ['early-adoption-proof', address, tree?.root, consumed],
    enabled: !!address && !!tree,
    staleTime: Infinity,
    queryFn: async () => {
      invariant(tree);
      invariant(address);

      const proof = findProofInTree(tree, (leaf) =>
        compareLowercase(leaf[0], address),
      );

      return { proof, consumed };
    },
  });
};
