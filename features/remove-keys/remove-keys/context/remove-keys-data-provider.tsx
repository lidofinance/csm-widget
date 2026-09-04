import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import {
  KEY_DEPOSIT_QUEUE_BATCHES,
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_KEYS,
  useKeyRemovalFee,
  useNodeOperator,
  useOperatorBalance,
  useOperatorCurveId,
  useOperatorInfo,
  useOperatorKeysWithStatus,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import { hasStatus } from 'utils';
import { type RemoveKeysFormNetworkData } from './types';

const useRemoveKeysFormNetworkData: NetworkData<
  RemoveKeysFormNetworkData
> = () => {
  const { nodeOperator } = useNodeOperator();
  const nodeOperatorId = nodeOperator?.nodeOperatorId;
  const bondQuery = useOperatorBalance(nodeOperatorId);
  const infoQuery = useOperatorInfo(nodeOperatorId);
  const keysQuery = useOperatorKeysWithStatus(nodeOperatorId, (keys) =>
    keys.filter(
      hasStatus([
        KEY_STATUS.DEPOSITABLE,
        KEY_STATUS.NON_QUEUED,
        KEY_STATUS.UNCHECKED,
        KEY_STATUS.DUPLICATED, // TODO: check active duplicated key is here?
        KEY_STATUS.INVALID,
      ]),
    ),
  );

  const bond = bondQuery.data;
  const info = infoQuery.data;
  const keys = keysQuery.data;

  const isBondLoading = bondQuery.isPending;
  const isInfoLoading = infoQuery.isPending;
  const isKeysLoading = keysQuery.isPending;

  const { data: curve, isPending: isCurveIdLoading } =
    useOperatorCurveId(nodeOperator);
  const { data: removalFee, isPending: isRemovalFeeLoading } =
    useKeyRemovalFee(curve);

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([
      KEY_OPERATOR_BALANCE,
      KEY_OPERATOR_INFO,
      KEY_OPERATOR_KEYS,
      KEY_DEPOSIT_QUEUE_BATCHES,
    ]);
  }, [invalidate]);

  const isPending =
    isBondLoading ||
    isInfoLoading ||
    isCurveIdLoading ||
    isRemovalFeeLoading ||
    isKeysLoading;

  return {
    data: {
      nodeOperatorId,
      curve,
      removalFee,
      bond,
      keys,
      info,
    } as RemoveKeysFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useRemoveKeysFormData = useFormData<RemoveKeysFormNetworkData>;

export const RemoveKeysDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useRemoveKeysFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
