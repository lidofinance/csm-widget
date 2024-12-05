import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import {
  KeyWithStatus,
  useGetKeyStatus,
  useNodeOperatorBalance,
  useNodeOperatorInfo,
  useNodeOperatorKeys,
} from 'shared/hooks';
import { type RemoveKeysFormNetworkData } from './types';

export const useRemoveKeysFormNetworkData = (): [
  RemoveKeysFormNetworkData,
  () => Promise<void>,
] => {
  const nodeOperatorId = useNodeOperatorId();
  const {
    data: bond,
    update: updateBond,
    initialLoading: isBondLoading,
  } = useNodeOperatorBalance(nodeOperatorId);
  const {
    data: info,
    update: updateInfo,
    initialLoading: isInfoLoading,
  } = useNodeOperatorInfo(nodeOperatorId);
  const {
    data: keys,
    update: updateKeys,
    initialLoading: isKeysLoading,
  } = useNodeOperatorKeys(nodeOperatorId, true);

  const { data: getStatus, initialLoading: isStatusLoading } =
    useGetKeyStatus();

  // FIXME: move out to keys with status
  const keysWithStatus = useMemo(() => {
    if (!keys || !getStatus || !info) return undefined;

    return keys.map(
      (key, index) =>
        ({
          key,
          statuses: getStatus(key, index + info?.totalDepositedKeys),
        }) as KeyWithStatus,
    );
  }, [getStatus, info, keys]);

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateBond(), updateInfo(), updateKeys()]);
  }, [updateBond, updateInfo, updateKeys]);

  const loading = useMemo(
    () => ({
      isBondLoading,
      isKeysLoading,
      isInfoLoading,
      isStatusLoading,
    }),
    [isBondLoading, isKeysLoading, isInfoLoading, isStatusLoading],
  );

  return [
    {
      nodeOperatorId,
      bond,
      keys,
      keysWithStatus,
      info,
      loading,
    },
    revalidate,
  ];
};
