import {
  NodeOperatorId,
  NodeOperatorInfo,
  OperatorStakeInfo,
} from '@lidofinance/lido-csm-sdk';
import { useOperatorInfo } from 'modules/web3';
import { useOperatorStakeInfo } from 'modules/web3/hooks/use-operator-stake-info';
import { useMemo } from 'react';
import { parseEther } from 'viem';

const MAX_EFFECTIVE_BALANCE = parseEther('2048');
const MIN_EFFECTIVE_BALANCE = parseEther('32');

type StakeAndKeysData = {
  activeStake: bigint;
  activeKeys: number;
  depositableStake: bigint;
  depositableKeys: number;
  potentialAdditionalStake: bigint;
  potentialAdditionalKeys: number;
};

const bigMax = (a: bigint, b: bigint) => (a > b ? a : b);

const selectStakeAndKeys =
  (info: NodeOperatorInfo | undefined) =>
  (meta: OperatorStakeInfo): StakeAndKeysData | undefined => {
    if (!info) return undefined;

    const activeKeys = info.totalDepositedKeys - info.totalWithdrawnKeys;
    const activeStake = meta.currentStake;

    const depositableKeys = info.depositableValidatorsCount;
    const depositableStake = bigMax(
      0n,
      BigInt(activeKeys + depositableKeys) * MAX_EFFECTIVE_BALANCE -
        activeStake,
    );

    const targetStake = meta.targetStake;
    const potentialAdditionalStake = bigMax(
      0n,
      targetStake - (activeStake + depositableStake),
    );
    const potentialAdditionalKeys = Math.max(
      Number(potentialAdditionalStake / MAX_EFFECTIVE_BALANCE),
      potentialAdditionalStake >= MIN_EFFECTIVE_BALANCE ? 1 : 0,
    );

    return {
      activeStake,
      activeKeys,
      depositableStake,
      depositableKeys,
      potentialAdditionalStake,
      potentialAdditionalKeys,
    };
  };

export const useStakeAndKeys = (id: NodeOperatorId | undefined) => {
  const { data: info } = useOperatorInfo(id);

  const select = useMemo(() => selectStakeAndKeys(info), [info]);

  // TODO: check targetKeys
  return useOperatorStakeInfo(id, select);
};
