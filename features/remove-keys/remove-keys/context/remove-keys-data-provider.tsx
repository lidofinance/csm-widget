import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import {
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_KEYS,
  useKeyRemovalFee,
  useNodeOperatorId,
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
  const nodeOperatorId = useNodeOperatorId();
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

  const { data: curveId, isPending: isCurveIdLoading } =
    useOperatorCurveId(nodeOperatorId);
  const { data: removalFee, isPending: isRemovalFeeLoading } =
    useKeyRemovalFee(curveId);

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([KEY_OPERATOR_BALANCE, KEY_OPERATOR_INFO, KEY_OPERATOR_KEYS]);
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
      curveId,
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
