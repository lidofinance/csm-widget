import { useNodeOperatorId, useOperatorInfo } from 'modules/web3';
import { useOperatorKeysToMigrate } from 'modules/web3/hooks/use-operator-keys-to-migrate';
import { useCallback, useMemo } from 'react';
import { useKeysWithStatus } from 'shared/hooks';
import { type TransferKeysFormNetworkData } from './types';
import { KEY_STATUS } from 'consts';

export const useTransferKeysFormNetworkData = (): [
  TransferKeysFormNetworkData,
  () => Promise<void>,
] => {
  const nodeOperatorId = useNodeOperatorId();

  const {
    data: info,
    isPending: isInfoLoading,
    refetch: updateInfo,
  } = useOperatorInfo(nodeOperatorId);

  const {
    data: keysToMigrate,
    isPending: isKeysToMigrateLoading,
    refetch: updateKeysToMigrate,
  } = useOperatorKeysToMigrate(nodeOperatorId);

  const { data: _keys, initialLoading: isKeysLoading } =
    useKeysWithStatus(true);

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateInfo(), updateKeysToMigrate()]);
  }, [updateInfo, updateKeysToMigrate]);

  const loading = useMemo(
    () => ({
      isKeysToMigrateLoading,
      isKeysLoading,
      isInfoLoading,
    }),
    [isInfoLoading, isKeysLoading, isKeysToMigrateLoading],
  );

  const keys = _keys
    ?.filter((key) => key.statuses.includes(KEY_STATUS.DEPOSITABLE))
    .slice(0, keysToMigrate ?? 0);

  // console.log('keys', keysToMigrate, keys);

  return [
    {
      nodeOperatorId,
      keysToMigrate,
      info,
      keys,
      loading,
    },
    revalidate,
  ];
};
