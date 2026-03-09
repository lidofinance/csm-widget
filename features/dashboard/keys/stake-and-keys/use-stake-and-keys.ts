import { KEY_STATUS, KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { useNodeOperatorId, useOperatorKeysWithStatus } from 'modules/web3';
import { parseEther } from 'viem';
import { hasStatus } from 'utils/has-status';

const MAX_EFFECTIVE_BALANCE = parseEther('2048');

type StakeAndKeysData = {
  activeStake: bigint;
  activeKeys: number;
  depositableStake: bigint;
  depositableKeys: number;
  potentialAdditionalStake: bigint;
  potentialAdditionalKeys: number;
};

const bigMax = (a: bigint, b: bigint) => (a > b ? a : b);

const selectStakeAndKeys = (keys: KeyWithStatus[]): StakeAndKeysData => {
  const activeKeysList = keys.filter(
    hasStatus([
      KEY_STATUS.ACTIVATION_PENDING,
      KEY_STATUS.ACTIVE,
      KEY_STATUS.EXITING,
      // KEY_STATUS.WITHDRAWAL_PENDING, // ???
    ]),
  );
  const activeKeys = activeKeysList.length;
  const activeStake = activeKeysList.reduce(
    (sum, key) => sum + (key.effectiveBalance ?? 0n),
    0n,
  );

  const depositableKeys = keys.filter(hasStatus(KEY_STATUS.DEPOSITABLE)).length;
  const depositableStake =
    BigInt(activeKeys + depositableKeys) * MAX_EFFECTIVE_BALANCE - activeStake;

  // TODO: calculate targetStake properly
  const targetStake = 0n;

  const potentialAdditionalStake = bigMax(
    0n,
    targetStake - (activeStake + depositableStake),
  );
  const potentialAdditionalKeys = Number(
    potentialAdditionalStake / MAX_EFFECTIVE_BALANCE,
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

export const useStakeAndKeys = () => {
  const id = useNodeOperatorId();

  return useOperatorKeysWithStatus(id, selectStakeAndKeys);
};
