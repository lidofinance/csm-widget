import { KEY_STATUS } from 'consts/key-status';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { HexString } from 'shared/keys';
import invariant from 'tiny-invariant';
import { compareLowercase, hasNoInterception } from 'utils';
//import { useExitRequestedKeysFromEvents } from './use-exit-requested-keys-from-events';
import { useKeysCLStatus } from './use-keys-cl-status';
import { useNetworkDuplicates } from './use-network-duplicates';
//import { useWithdrawnKeyIndexesFromEvents } from './use-withdrawn-key-indexes-from-events';
import { useMergeSwr } from './useMergeSwr';
import { useNodeOperatorInfo } from './useNodeOperatorInfo';
import { useNodeOperatorKeys } from './useNodeOperatorKeys';
import { useNodeOperatorUnbondedKeys } from './useNodeOperatorUnbondedKeys';
// DAPPNODE
import { useWithdrawnKeyIndexesFromEvents } from 'dappnode/hooks/use-withdrawn-key-indexes-from-events-api';
import { useExitRequestedKeysFromEvents } from 'dappnode/hooks/use-exit-requested-keys-from-events-api';

export type KeyWithStatus = {
  key: HexString;
  index: number;
  statuses: KEY_STATUS[];
};

export const useKeysIndexes = (
  info?: ReturnType<typeof useNodeOperatorInfo>['data'],
  onlyRemovable?: boolean,
  maxCount?: number,
) => {
  return useMemo(() => {
    const startIndex = (onlyRemovable && info?.totalDepositedKeys) || 0;
    const count = (info?.totalAddedKeys ?? 0) - startIndex;
    return [startIndex, maxCount ? Math.min(count, maxCount) : count];
  }, [info?.totalAddedKeys, info?.totalDepositedKeys, maxCount, onlyRemovable]);
};

// FIXME: cache keys with status
export const useKeysWithStatus = (onlyRemovable = false) => {
  const nodeOperatorId = useNodeOperatorId();

  const swrInfo = useNodeOperatorInfo(nodeOperatorId);
  const [startIndex, count] = useKeysIndexes(swrInfo.data, onlyRemovable);
  const swrKeys = useNodeOperatorKeys(nodeOperatorId, startIndex, count);

  const swrClStatus = useKeysCLStatus(swrKeys.data);
  const swrUnbonded = useNodeOperatorUnbondedKeys(nodeOperatorId);
  const swrWithdrawn = useWithdrawnKeyIndexesFromEvents();
  const swrExitRequested = useExitRequestedKeysFromEvents();
  const swrDuplicates = useNetworkDuplicates();

  const { data: keys } = swrKeys;
  const { data: info } = swrInfo;
  const { data: unbonded } = swrUnbonded;
  const { data: withdrawnIndexes } = swrWithdrawn;
  const { data: exitRequestedKeys } = swrExitRequested;
  const { data: duplicates } = swrDuplicates;
  const { data: clStatus } = swrClStatus;

  const getKeyStatus = useCallback(
    (pubkey: HexString, nodeOperatorKeyIndex: number): KEY_STATUS[] => {
      invariant(info, 'Info is not defined');

      const statuses: KEY_STATUS[] = [];
      const prefilled = clStatus?.find((st) => st.pubkey === pubkey);

      if (prefilled?.slashed) {
        statuses.push(KEY_STATUS.SLASHED);
      }

      if (nodeOperatorKeyIndex >= info.totalVettedKeys) {
        if (duplicates?.includes(pubkey)) {
          return [...statuses, KEY_STATUS.DUPLICATED];
        } else if (nodeOperatorKeyIndex === info.totalVettedKeys) {
          return [...statuses, KEY_STATUS.INVALID];
        }
      }

      if (withdrawnIndexes?.includes(nodeOperatorKeyIndex)) {
        return [...statuses, KEY_STATUS.WITHDRAWN];
      }

      if (
        nodeOperatorKeyIndex >= info.totalDepositedKeys &&
        (info.stuckValidatorsCount > 0 ||
          info.enqueuedCount < info.depositableValidatorsCount)
      ) {
        statuses.push(KEY_STATUS.NON_QUEUED);
      } else if (nodeOperatorKeyIndex >= info.totalVettedKeys) {
        statuses.push(KEY_STATUS.UNCHECKED);
      } else if (prefilled?.status) {
        statuses.push(prefilled.status);
      } else if (nodeOperatorKeyIndex >= info.totalDepositedKeys) {
        statuses.push(KEY_STATUS.DEPOSITABLE);
      } else {
        // @note CL api don't know about "DEPOSITED" keys
        statuses.push(
          clStatus ? KEY_STATUS.ACTIVATION_PENDING : KEY_STATUS.ACTIVE,
        );
      }

      if (
        hasNoInterception(statuses, [
          KEY_STATUS.SLASHED,
          KEY_STATUS.WITHDRAWN,
          KEY_STATUS.WITHDRAWAL_PENDING,
          KEY_STATUS.EXITING,
        ]) &&
        exitRequestedKeys
      ) {
        const exitRequestIndex = exitRequestedKeys.findIndex((key) =>
          compareLowercase(pubkey, key),
        );

        if (exitRequestIndex >= 0) {
          if (info.stuckValidatorsCount > exitRequestIndex) {
            statuses.push(KEY_STATUS.STUCK);
          } else {
            statuses.push(KEY_STATUS.EXIT_REQUESTED);
          }
        }
      }

      if (
        hasNoInterception(statuses, [
          KEY_STATUS.STUCK,
          KEY_STATUS.SLASHED,
          KEY_STATUS.WITHDRAWN,
          KEY_STATUS.EXIT_REQUESTED,
        ]) &&
        unbonded &&
        info.totalAddedKeys - nodeOperatorKeyIndex < unbonded
      ) {
        statuses.push(KEY_STATUS.UNBONDED);
      }

      return statuses;
    },
    [clStatus, duplicates, exitRequestedKeys, info, unbonded, withdrawnIndexes],
  );

  const keysWithStatus: KeyWithStatus[] | undefined = useMemo(
    () =>
      swrClStatus.initialLoading
        ? undefined
        : keys?.map(({ key, index }) => {
            return {
              key,
              index,
              statuses: getKeyStatus(key, index),
            };
          }),
    [getKeyStatus, keys, swrClStatus.initialLoading],
  );

  return useMergeSwr(
    [
      swrInfo,
      swrKeys,
      swrUnbonded,
      swrWithdrawn,
      swrExitRequested,
      // swrDuplicates,
      swrClStatus,
    ],
    info && keys ? keysWithStatus : undefined,
  );
};
