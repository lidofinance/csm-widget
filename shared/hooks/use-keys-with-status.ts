import { HexString } from '@openzeppelin/merkle-tree/dist/bytes';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useMemo } from 'react';
import { KEY_STATUS } from 'types';
import { compareLowercase } from 'utils';
import { useGetKeyStatus } from './use-get-key-status';
import { useKeysCLStatus } from './use-keys-cl-status';
import { useMergeSwr } from './useMergeSwr';
import { useNodeOperatorKeys } from './useNodeOperatorKeys';

export type KeyWithStatus = {
  key: HexString;
  statuses: KEY_STATUS[];
};

export const useKeysWithStatus = () => {
  const nodeOperatorId = useNodeOperatorId();

  const swrKeys = useNodeOperatorKeys(nodeOperatorId);
  const swrClStatus = useKeysCLStatus(swrKeys.data);
  const swrGetStatus = useGetKeyStatus();

  const keys = swrKeys.data;
  const getStatus = swrGetStatus.data;
  const clStatus = swrClStatus.data;

  return useMergeSwr(
    [swrKeys, swrGetStatus, swrClStatus],
    useMemo(() => {
      if (
        swrKeys.initialLoading ||
        swrGetStatus.initialLoading ||
        !keys ||
        !getStatus
      ) {
        return undefined;
      }

      // FIXME: sort
      return keys.map(
        (key, index) =>
          ({
            key,
            statuses: getStatus(
              key,
              index,
              clStatus?.find(({ pubkey }) => compareLowercase(key, pubkey)),
            ),
          }) as KeyWithStatus,
      );
    }, [
      clStatus,
      getStatus,
      keys,
      swrGetStatus.initialLoading,
      swrKeys.initialLoading,
    ]),
  );
};
