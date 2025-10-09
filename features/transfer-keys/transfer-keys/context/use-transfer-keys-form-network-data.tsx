import {
  useNodeOperatorId,
  useOperatorInfo,
  useOperatorKeysWithStatus,
  useOperatorCurveId,
  useCurveParameters,
} from 'modules/web3';
import { useOperatorKeysToMigrate } from 'modules/web3/hooks/use-operator-keys-to-migrate';
import { useCallback, useMemo } from 'react';
import { type TransferKeysFormNetworkData } from './types';
import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import { canAddMorePriorityKeys } from 'utils';

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

  const { data: _keys, isPending: isKeysLoading } =
    useOperatorKeysWithStatus(nodeOperatorId);

  const { data: curveId, isPending: isCurveIdLoading } =
    useOperatorCurveId(nodeOperatorId);

  const { data: curveParameters, isPending: isCurveParametersLoading } =
    useCurveParameters(curveId);

  const needCleanup =
    info && curveParameters && canAddMorePriorityKeys(info, curveParameters);

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateInfo(), updateKeysToMigrate()]);
  }, [updateInfo, updateKeysToMigrate]);

  const loading = useMemo(
    () => ({
      isKeysToMigrateLoading,
      isKeysLoading,
      isInfoLoading,
      isCurveIdLoading,
      isCurveParametersLoading,
    }),
    [
      isKeysToMigrateLoading,
      isKeysLoading,
      isInfoLoading,
      isCurveIdLoading,
      isCurveParametersLoading,
    ],
  );

  const keys = _keys
    ?.filter((key) => key.statuses.includes(KEY_STATUS.DEPOSITABLE))
    .slice(0, keysToMigrate ?? 0);

  return [
    {
      nodeOperatorId,
      keysToMigrate,
      info,
      keys,
      needCleanup,
      loading,
    },
    revalidate,
  ];
};
