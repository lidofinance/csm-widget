import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { useQuery } from '@tanstack/react-query';
import { useExternalLinks } from 'shared/hooks';
import {
  fetchWithFallback,
  standardFetcher,
  StandardMerkleTreeData,
} from 'utils';
import { Address } from 'viem';
import { useReadContract } from 'wagmi';
import { useCSEarlyAdoption } from './use-contracts';

type EATreeLeaf = [Address];

export const useEarlyAdoptionTree = () => {
  const { earlyAdoptionTree: url } = useExternalLinks();

  const { data: treeRoot } = useReadContract({
    ...useCSEarlyAdoption(),
    functionName: 'TREE_ROOT',
  });

  return useQuery({
    queryKey: ['early-adoption-tree', treeRoot],
    enabled: !!treeRoot,
    staleTime: Infinity,
    queryFn: async () => {
      const treeJson = await fetchWithFallback([url], (url) =>
        standardFetcher<StandardMerkleTreeData<EATreeLeaf>>(url, {
          headers: {},
        }),
      );

      if (!treeRoot) {
        throw new Error('Empty EarlyAdoption TREE_ROOT');
      }

      if (!treeJson) {
        throw new Error("Can't fetch EarlyAdoption json file");
      }

      const tree = StandardMerkleTree.load(treeJson);

      if (treeRoot !== tree.root) {
        throw new Error('Mismatch EarlyAdoption treeRoot');
      }

      return tree;
    },
  });
};
