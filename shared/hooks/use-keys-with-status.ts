import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useMemo } from 'react';
import { useGetKeyStatus } from './use-get-key-status';
import { useMergeSwr } from './useMergeSwr';
import { useNodeOperatorKeys } from './useNodeOperatorKeys';

export const useKeysWithStatus = () => {
  const nodeOperatorId = useNodeOperatorId();

  const swrKeys = useNodeOperatorKeys(nodeOperatorId);
  const swrGetStatus = useGetKeyStatus();

  const keys = swrKeys.data;
  const getStatus = swrGetStatus.data;

  return useMergeSwr(
    [swrKeys, swrGetStatus],
    useMemo(() => {
      if (
        swrKeys.initialLoading ||
        swrGetStatus.initialLoading ||
        !keys ||
        !getStatus
      ) {
        return undefined;
      }

      return keys.map((key, index) => [key, getStatus(key, index)] as const);
    }, [getStatus, keys, swrGetStatus.initialLoading, swrKeys.initialLoading]),
  );
};
