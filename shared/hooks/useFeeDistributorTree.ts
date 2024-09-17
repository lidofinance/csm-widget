import { useLidoSWR } from '@lido-sdk/react';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { getExternalLinks } from 'consts/external-links';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import {
  compareLowercase,
  rewardsTreeFetcher,
  StandardMerkleTreeData,
  trackMatomoError,
} from 'utils';
import { useAccount } from './use-account';
import { useCSFeeDistributorRPC } from './useCsmContracts';
import { RewardsTreeLeaf } from './useNodeOperatorRewards';

// TODO: mainnet - use paid IPFS key
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

      return fetchRewardsTreeWithFallback([githubUrl, ipfsUrl], root);
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

const fetchRewardsTreeWithFallback = async (
  urls: Array<string | null>,
  treeRoot: string,
) => {
  for (const url of urls) {
    if (!url) continue;
    try {
      const tree = await fetchRewardsTree(url, treeRoot);
      if (tree) return tree;
    } catch {
      /* noop */
    }
  }
};
