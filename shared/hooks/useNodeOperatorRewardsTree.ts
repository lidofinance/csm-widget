import { useContractSWR, useLidoSWR } from '@lido-sdk/react';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { STRATEGY_CONSTANT, STRATEGY_LAZY } from 'consts/swr-strategies';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { NodeOperatorId, Proof } from 'types';
import {
  StandardMerkleTreeData,
  findIndexAndLeaf,
  rewardsTreeFetcher,
} from 'utils';
import { useAccount } from './use-account';
import { useCSFeeDistributorRPC } from './useCsmContracts';

type RewardsTreeLeaf = [NodeOperatorId, string];

type RewardProof = {
  shares: BigNumber;
  proof: Proof;
};

const findProofAndAmount = (
  tree: StandardMerkleTree<RewardsTreeLeaf>,
  nodeOperatorId: NodeOperatorId,
): RewardProof | undefined => {
  const [index, leaf] = findIndexAndLeaf(
    tree,
    (leaf) => leaf[0] === nodeOperatorId,
  );
  if (index !== undefined && leaf) {
    return {
      proof: tree.getProof(index),
      shares: BigNumber.from(leaf[1]),
    };
  }

  return undefined;
};

export const useFeeDistributorTree = (config = STRATEGY_CONSTANT) => {
  const feeDistributorRPC = useCSFeeDistributorRPC();
  const { chainId } = useAccount();
  return useLidoSWR(
    ['fee-distributor-tree', chainId],
    async () => {
      const cid = await feeDistributorRPC.treeCid();
      const url = `https://ipfs.io/ipfs/${cid}`;

      const treeJson =
        await rewardsTreeFetcher<StandardMerkleTreeData<RewardsTreeLeaf>>(url);

      return StandardMerkleTree.load(treeJson);
    },
    config,
  );
};

export const useFeeDistributorRewards = (
  nodeOperatorId?: NodeOperatorId,
  proofData?: RewardProof,
  config = STRATEGY_LAZY,
) => {
  return useContractSWR({
    contract: useCSFeeDistributorRPC(),
    method: 'getFeesToDistribute',
    params: [nodeOperatorId, proofData?.shares, proofData?.proof],
    shouldFetch: !!nodeOperatorId && !!proofData?.shares.gt(0),
    config,
  });
};

export const useNodeOperatorRewards = (nodeOperatorId?: NodeOperatorId) => {
  const { data: tree, loading: isTreeLoading } = useFeeDistributorTree();

  const proofData = useMemo(() => {
    return tree && nodeOperatorId
      ? findProofAndAmount(tree, nodeOperatorId)
      : undefined;
  }, [nodeOperatorId, tree]);

  const {
    data: available,
    loading: isRewardsLoading,
    ...swr
  } = useFeeDistributorRewards(nodeOperatorId, proofData);

  return {
    ...swr,
    data: { ...proofData, available },
    loading: isTreeLoading || isRewardsLoading,
  };
};
