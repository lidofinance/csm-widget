import {
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_KEYS_TO_MIGRATE,
  useNodeOperatorId,
  useOperatorInfo,
  useOperatorKeysWithStatus,
  useOperatorCurveId,
  useCurveParameters,
  KEY_DEPOSIT_QUEUE_BATCHES,
} from 'modules/web3';
import { useOperatorKeysToMigrate } from 'modules/web3/hooks/use-operator-keys-to-migrate';
import { FC, PropsWithChildren, useCallback, useMemo } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import { type TransferKeysFormNetworkData } from './types';
import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import { canAddMorePriorityKeys } from 'utils';

const useTransferKeysFormNetworkData: NetworkData<
  TransferKeysFormNetworkData
> = () => {
  const nodeOperatorId = useNodeOperatorId();

  const infoQuery = useOperatorInfo(nodeOperatorId);
  const keysToMigrateQuery = useOperatorKeysToMigrate(nodeOperatorId);

  const info = infoQuery.data;
  const keysToMigrate = keysToMigrateQuery.data;

  const isInfoLoading = infoQuery.isPending;
  const isKeysToMigrateLoading = keysToMigrateQuery.isPending;

  const { data: _keys, isPending: isKeysLoading } =
    useOperatorKeysWithStatus(nodeOperatorId);

  const { data: curveId } = useOperatorCurveId(nodeOperatorId);

  const { data: curveParameters } = useCurveParameters(curveId);

  const needCleanup =
    info && curveParameters && canAddMorePriorityKeys(info, curveParameters);

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([
      KEY_OPERATOR_INFO,
      KEY_OPERATOR_KEYS_TO_MIGRATE,
      KEY_DEPOSIT_QUEUE_BATCHES,
    ]);
  }, [invalidate]);

  const keys = useMemo(
    () =>
      _keys
        ?.filter((key) => key.statuses.includes(KEY_STATUS.DEPOSITABLE))
        .slice(0, keysToMigrate ?? 0),
    [_keys, keysToMigrate],
  );

  return {
    data: {
      nodeOperatorId,
      keysToMigrate,
      info,
      keys,
      needCleanup,
    } as TransferKeysFormNetworkData,
    isPending: isInfoLoading || isKeysLoading || isKeysToMigrateLoading,
    revalidate,
  };
};

export const useTransferKeysFormData = useFormData<TransferKeysFormNetworkData>;

export const TransferKeysDataProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const networkData = useTransferKeysFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
