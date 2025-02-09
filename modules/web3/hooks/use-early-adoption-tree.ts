import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { useQuery } from '@tanstack/react-query';
import { getExternalLinks } from 'consts/external-links';
import {
  fetchWithFallback,
  standardFetcher,
  StandardMerkleTreeData,
} from 'utils';
import { Address } from 'viem';
import { useConfig } from 'wagmi';
import { readCsEarlyAdoptionTreeRoot } from '../generated';

type EATreeLeaf = [Address];

export const useEarlyAdoptionTree = () => {
  const config = useConfig();
  const url = getExternalLinks().earlyAdoptionTree;

  return useQuery({
    queryKey: ['early-adoption-tree', url],
    staleTime: Infinity,
    queryFn: async () => {
      const treeRoot = await readCsEarlyAdoptionTreeRoot(config, {});

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
