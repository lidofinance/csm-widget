import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { HexString } from 'shared/keys';
import invariant from 'tiny-invariant';
import { KEY_STATUS } from 'types';
import { compareLowercase, filterOut } from 'utils';
import { useExitRequestedKeysFromEvents } from './use-exit-requested-keys-from-events';
import { useKeysCLStatus } from './use-keys-cl-status';
import { useNetworkDuplicates } from './use-network-duplicates';
import { useWithdrawnKeyIndexesFromEvents } from './use-withdrawn-key-indexes-from-events';
import { useMergeSwr } from './useMergeSwr';
import { useNodeOperatorInfo } from './useNodeOperatorInfo';
import { useNodeOperatorKeys } from './useNodeOperatorKeys';
import { useNodeOperatorUnbondedKeys } from './useNodeOperatorUnbondedKeys';

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

const key =
  '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
const sts: KEY_STATUS[][] = [
  [KEY_STATUS.INVALID],
  [KEY_STATUS.DUPLICATED],
  [KEY_STATUS.STUCK],
  [KEY_STATUS.UNBONDED],
  [KEY_STATUS.EXIT_REQUESTED],
  [KEY_STATUS.NON_QUEUED],
  [KEY_STATUS.UNCHECKED],
  [KEY_STATUS.DEPOSITABLE],
  [KEY_STATUS.ACTIVATION_PENDING],
  [KEY_STATUS.ACTIVE],
  [KEY_STATUS.EXITING],
  [KEY_STATUS.WITHDRAWAL_PENDING],
  [KEY_STATUS.WITHDRAWN],
  [KEY_STATUS.SLASHED],
  [KEY_STATUS.WITHDRAWN, KEY_STATUS.SLASHED],
  [KEY_STATUS.WITHDRAWAL_PENDING, KEY_STATUS.SLASHED],
  [KEY_STATUS.EXITING, KEY_STATUS.SLASHED],
  [KEY_STATUS.UNBONDED, KEY_STATUS.SLASHED],
  [KEY_STATUS.ACTIVE, KEY_STATUS.UNBONDED, KEY_STATUS.EXIT_REQUESTED],
  [KEY_STATUS.ACTIVE, KEY_STATUS.UNBONDED],
  [KEY_STATUS.ACTIVE, KEY_STATUS.EXIT_REQUESTED],
  [KEY_STATUS.ACTIVE, KEY_STATUS.STUCK],
  [KEY_STATUS.ACTIVATION_PENDING, KEY_STATUS.UNBONDED],
  [KEY_STATUS.EXITING, KEY_STATUS.UNBONDED],
  [KEY_STATUS.WITHDRAWAL_PENDING, KEY_STATUS.UNBONDED],
  [KEY_STATUS.NON_QUEUED, KEY_STATUS.UNBONDED],
];

const keysWithStatus: KeyWithStatus[] = sts.map((statuses, index) => ({
  key,
  index,
  statuses,
}));

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

      if (nodeOperatorKeyIndex >= info.totalVettedKeys) {
        if (duplicates?.includes(pubkey)) {
          return [KEY_STATUS.DUPLICATED];
        } else if (nodeOperatorKeyIndex === info.totalVettedKeys) {
          return [KEY_STATUS.INVALID];
        } else {
          statuses.push(KEY_STATUS.UNCHECKED);
        }
      }

      if (prefilled?.slashed) {
        statuses.push(KEY_STATUS.SLASHED);
      }

      if (withdrawnIndexes?.includes(nodeOperatorKeyIndex)) {
        statuses.push(KEY_STATUS.WITHDRAWN);
        return statuses;
      }

      if (prefilled?.status && prefilled.status !== KEY_STATUS.ACTIVE) {
        statuses.push(prefilled.status);
      }

      if (
        filterOut(statuses, [
          KEY_STATUS.SLASHED,
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
        filterOut(statuses, [
          KEY_STATUS.STUCK,
          KEY_STATUS.SLASHED,
          KEY_STATUS.WITHDRAWN,
        ]) &&
        unbonded &&
        info.totalAddedKeys - nodeOperatorKeyIndex < unbonded
      ) {
        statuses.push(KEY_STATUS.UNBONDED);
      }

      if (nodeOperatorKeyIndex < info.totalDepositedKeys) {
        if (
          filterOut(statuses, [
            KEY_STATUS.ACTIVATION_PENDING,
            KEY_STATUS.WITHDRAWAL_PENDING,
            KEY_STATUS.EXITING,
            KEY_STATUS.ACTIVE,
          ])
        ) {
          statuses.push(KEY_STATUS.ACTIVE);
        }
      } else if (
        info.stuckValidatorsCount > 0 ||
        info.enqueuedCount < info.depositableValidatorsCount
      ) {
        statuses.push(KEY_STATUS.NON_QUEUED);
      }

      if (statuses.length === 0) {
        statuses.push(KEY_STATUS.DEPOSITABLE);
      }

      return statuses;
    },
    [clStatus, duplicates, exitRequestedKeys, info, unbonded, withdrawnIndexes],
  );

  const _keysWithStatus: KeyWithStatus[] | undefined = useMemo(
    () =>
      keys?.map(({ key, index }) => {
        return {
          key,
          index,
          statuses: getKeyStatus(key, index),
        };
      }),
    [getKeyStatus, keys],
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
    info && keys ? (keysWithStatus ?? _keysWithStatus) : undefined,
  );
};
