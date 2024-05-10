import { useContractSWR, useLidoSWR } from '@lido-sdk/react';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { STRATEGY_CONSTANT, STRATEGY_LAZY } from 'consts/swr-strategies';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { NodeOperatorId, Proof } from 'types';
import { jsonTreeFetcher } from 'utils';
import { useAccount } from './use-account';
import { useCSFeeDistributorRPC } from './useCsmContracts';

type RewardsTreeLeaf = [string, string];

interface StandardMerkleTreeData<T extends any[]> {
  format: 'standard-v1';
  tree: string[];
  values: {
    value: T;
    treeIndex: number;
  }[];
  leafEncoding: string[];
}

type RewardProof = {
  shares: BigNumber;
  proof: Proof;
};

const findProofInTree = (
  tree: StandardMerkleTree<RewardsTreeLeaf>,
  nodeOperatorId: NodeOperatorId,
) => {
  const entry = Array.from(tree.entries()).find(
    ([, value]) => value[0] === nodeOperatorId,
  );

  if (entry) {
    const data: RewardProof = {
      proof: tree.getProof(entry[0]),
      shares: BigNumber.from(entry[1][1]),
    };
    return data;
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
        await jsonTreeFetcher<StandardMerkleTreeData<RewardsTreeLeaf>>(url);

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
      ? findProofInTree(tree, nodeOperatorId)
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
