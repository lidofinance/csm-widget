import { useLidoSWR } from '@lido-sdk/react';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { getExternalLinks } from 'consts/external-links';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import {
  compareLowercase,
  fetchWithFallback,
  rewardsTreeFetcher,
  StandardMerkleTreeData,
  trackMatomoError,
} from 'utils';
import { useAccount } from './use-account';
import { useCSFeeDistributorRPC } from './useCsmContracts';
import { RewardsTreeLeaf } from './useNodeOperatorRewards';

export const useFeeDistributorTree = (config = STRATEGY_CONSTANT) => {
  const feeDistributorRPC = useCSFeeDistributorRPC();
  const { chainId } = useAccount();
  return useLidoSWR(
    ['fee-distributor-tree', chainId],
    async () => {
      const [cid, root] = await Promise.all([
        feeDistributorRPC.treeCid(),
        feeDistributorRPC.treeRoot(),
      ]);

      if (!root) {
        return null;
      }

      const githubUrl = getExternalLinks(chainId).rewardsTree;
      const ipfsUrl = cid ? `https://ipfs.io/ipfs/${cid}` : null;

      return fetchWithFallback([githubUrl, ipfsUrl], (url) =>
        fetchRewardsTree(url, root),
      );
    },
    config,
  );
};

const fetchRewardsTree = async (url: string, treeRoot: string) => {
  const treeJson =
    await rewardsTreeFetcher<StandardMerkleTreeData<RewardsTreeLeaf>>(url);

  const tree = StandardMerkleTree.load(treeJson);

  if (compareLowercase(tree.root, treeRoot)) return tree;

  trackMatomoError(
    `Mismatch tree root on ${url}`,
    'rewards_tree_root_mismatch',
  );

  return null;
};
