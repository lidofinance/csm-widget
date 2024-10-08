import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import { HexString } from 'shared/keys';
import invariant from 'tiny-invariant';
import { KeyStatus } from 'types';
import { useExitRequestedKeysFromEvents } from './use-exit-requested-keys-from-events';
import { useNetworkDuplicates } from './use-network-duplicates';
import { useWithdrawnKeyIndexesFromEvents } from './use-withdrawn-key-indexes-from-events';
import { useMergeSwr } from './useMergeSwr';
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

  const swrInfo = useNodeOperatorInfo(nodeOperatorId);
  const swrUnbonded = useNodeOperatorUnbondedKeys(nodeOperatorId);
  const swrWithdrawn = useWithdrawnKeyIndexesFromEvents();
  const swrExitRequested = useExitRequestedKeysFromEvents();

  const { data: info } = swrInfo;
  const { data: unbonded } = swrUnbonded;
  const { data: withdrawnIndexes } = swrWithdrawn;
  const { data: exitRequestedKeys } = swrExitRequested;

  const { data: duplicates } = useNetworkDuplicates();

  const getStatus = useCallback(
    (pubkey: HexString, index: number): KeyStatus[] => {
      invariant(info, 'Info is not defined');
      const statuses: KeyStatus[] = [];

      if (withdrawnIndexes?.includes(index)) {
        return ['withdrawn'];
      }

      const exitRequestIndex = exitRequestedKeys?.findIndex(
        (key) => key === pubkey.toLowerCase(),
      );
      if (exitRequestIndex !== undefined && exitRequestIndex >= 0) {
        if (info.stuckValidatorsCount > exitRequestIndex)
          statuses.push('stuck');
        statuses.push('requested to exit');
      }

      if (unbonded && info?.totalAddedKeys - index < unbonded) {
        statuses.push('unbonded');
      }

      if (index < info.totalDepositedKeys) {
        statuses.push('active');
      }

      if (index >= info.totalVettedKeys) {
        if (duplicates?.includes(pubkey)) statuses.push('duplicated');
        else if (index > info.totalVettedKeys) statuses.push('unvetted');
        else statuses.push('invalid');
      }

      if (statuses.length > 0) {
        return statuses;
      }

      return ['depositable'];
    },
    [duplicates, exitRequestedKeys, info, unbonded, withdrawnIndexes],
  );

  return useMergeSwr(
    [swrInfo, swrUnbonded, swrWithdrawn, swrExitRequested],
    swrInfo ? getStatus : undefined,
  );
};
