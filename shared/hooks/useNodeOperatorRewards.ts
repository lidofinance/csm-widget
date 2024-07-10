import { Zero } from '@ethersproject/constants';
import { useContractSWR, useLidoSWR } from '@lido-sdk/react';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { STRATEGY_CONSTANT, STRATEGY_LAZY } from 'consts/swr-strategies';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { NodeOperatorId, RewardProof, RewardsBalance } from 'types';
import {
  StandardMerkleTreeData,
  findIndexAndLeaf,
  rewardsTreeFetcher,
} from 'utils';
import { useAccount } from './use-account';
import { useCSFeeDistributorRPC } from './useCsmContracts';
import { useMergeSwr } from './useMergeSwr';

type RewardsTreeLeaf = [NodeOperatorId, string];

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
      if (!cid) return null;
      const url = `https://ipfs.io/ipfs/${cid}`;

      const treeJson =
        await rewardsTreeFetcher<StandardMerkleTreeData<RewardsTreeLeaf>>(url);

      return StandardMerkleTree.load(treeJson);
    },
    config,
  );
};

export const useRewardsProof = (nodeOperatorId?: NodeOperatorId) => {
  const treeSwr = useFeeDistributorTree();

  const proofData = useMemo(() => {
    if (!nodeOperatorId || treeSwr.data === undefined) return undefined;

    return (
      (treeSwr.data && findProofAndAmount(treeSwr.data, nodeOperatorId)) || {
        proof: [],
        shares: Zero,
      }
    );
  }, [nodeOperatorId, treeSwr.data]);

  return useMergeSwr([treeSwr], proofData);
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
  const proofSwr = useRewardsProof(nodeOperatorId);

  const rewardsSwr = useFeeDistributorRewards(nodeOperatorId, proofSwr.data);

  const data: RewardsBalance | undefined = useMemo(() => {
    return proofSwr.data
      ? { ...proofSwr.data, available: rewardsSwr.data ?? Zero }
      : undefined;
  }, [proofSwr.data, rewardsSwr.data]);

  return useMergeSwr([proofSwr, rewardsSwr], data);
};
