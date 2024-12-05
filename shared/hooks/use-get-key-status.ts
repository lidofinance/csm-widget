import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import { HexString } from 'shared/keys';
import invariant from 'tiny-invariant';
import { KEY_STATUS } from 'types';
import { compareLowercase } from 'utils';
import { useExitRequestedKeysFromEvents } from './use-exit-requested-keys-from-events';
import { ClKeyStatus } from './use-keys-cl-status';
import { useNetworkDuplicates } from './use-network-duplicates';
import { useWithdrawnKeyIndexesFromEvents } from './use-withdrawn-key-indexes-from-events';
import { useMergeSwr } from './useMergeSwr';
import { useNodeOperatorInfo } from './useNodeOperatorInfo';
import { useNodeOperatorUnbondedKeys } from './useNodeOperatorUnbondedKeys';

type GetStatusFn = (
  pubkey: HexString,
  index: number,
  prefilled?: ClKeyStatus,
) => KEY_STATUS[];

const filterOut = <T>(input: T[], filter: T[]) =>
  input.every((st) => !filter.includes(st));

// TODO: merge with getKeys & clStatus
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

  const getStatus: GetStatusFn = useCallback(
    (pubkey, nodeOperatorKeyIndex, prefilled) => {
      invariant(info, 'Info is not defined');

      const statuses: KEY_STATUS[] = [];

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

      if (nodeOperatorKeyIndex < info.totalDepositedKeys || prefilled?.status) {
        statuses.push(prefilled?.status || KEY_STATUS.ACTIVE);
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
    [duplicates, exitRequestedKeys, info, unbonded, withdrawnIndexes],
  );

  return useMergeSwr(
    [swrInfo, swrUnbonded, swrWithdrawn, swrExitRequested],
    swrInfo ? getStatus : undefined,
  );
};
