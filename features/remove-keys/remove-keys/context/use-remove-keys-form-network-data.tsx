import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import {
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

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateBond(), updateInfo(), updateKeys()]);
  }, [updateBond, updateInfo, updateKeys]);

  const loading = useMemo(
    () => ({
      isBondLoading,
      isKeysLoading,
      isInfoLoading,
    }),
    [isBondLoading, isKeysLoading, isInfoLoading],
  );

  return [
    {
      nodeOperatorId,
      bond,
      keys,
      info,
      loading,
    },
    revalidate,
  ];
};
