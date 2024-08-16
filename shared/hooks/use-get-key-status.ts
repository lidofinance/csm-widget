import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import { HexString } from 'shared/keys';
import { KeyStatus } from 'types';
import { useNetworkDuplicates } from './use-network-duplicates';
import { useNodeOperatorInfo } from './useNodeOperatorInfo';
import { useNodeOperatorUnbondedKeys } from './useNodeOperatorUnbondedKeys';

/**
 * uint32 totalAddedKeys; // @dev increased and decreased when removed
 * uint32 totalWithdrawnKeys; // @dev only increased
 * uint32 totalDepositedKeys; // @dev only increased
 * uint32 totalVettedKeys; // @dev both increased and decreased
 * uint32 stuckValidatorsCount; // @dev both increased and decreased
 * uint32 depositableValidatorsCount; // @dev any value
 * uint32 totalExitedKeys; // @dev only increased
 * uint32 enqueuedCount; // Tracks how many places are occupied by the node operator's keys in the queue.
 * uint32 targetLimit;
 * uint8 targetLimitMode;
 */
/// @notice depositableValidatorsCount depends on:
///      - totalVettedKeys
///      - totalDepositedKeys
///      - totalExitedKeys
///      - targetLimitMode
///      - targetValidatorsCount
///      - totalUnbondedKeys
///      - totalStuckKeys

/**
 * added -> deposited -> withdrawn -> exited
 * added -> vetted -> deposited -> withdrawn
 */

/**
 * dashboard calc
 * depositable: info.depositableValidatorsCount
 * active: info.totalDepositedKeys - info.totalWithdrawnKeys
 * limit: info.targetLimitMode > 0 ? info.targetLimit : (eaTarget ?? '—')
 * exited: info.totalWithdrawnKeys
 * unbounded: unbonded?.toNumber() ?? '...'
 * stuck: info.stuckValidatorsCount
 * invalid: info.totalAddedKeys - info.totalVettedKeys
 */

export const useGetKeyStatus = () => {
  const nodeOperatorId = useNodeOperatorId();

  const { data: info } = useNodeOperatorInfo(nodeOperatorId);
  const { data: unbonded } = useNodeOperatorUnbondedKeys(nodeOperatorId);
  const { data: duplicates } = useNetworkDuplicates();

  return useCallback(
    (index: number, pubkey: HexString): KeyStatus | undefined => {
      if (!info) return undefined;

      if (unbonded && info?.totalAddedKeys - index < unbonded)
        return 'unbonded';
      if (index < info.totalWithdrawnKeys) return 'exited';
      if (index < info.totalDepositedKeys) {
        if (index >= info.totalAddedKeys - info.stuckValidatorsCount) {
          return 'stuck';
        }
        return 'active';
      }
      if (index >= info.totalVettedKeys) {
        if (duplicates?.includes(pubkey)) return 'duplicated';
        if (index > info.totalVettedKeys) return 'unvetted';
        return 'invalid';
      }

      return 'depositable';
      // TODO: handle targetLimit
    },
    [duplicates, info, unbonded],
  );
};
