import {
  KEY_OPERATOR_BALANCE,
  KEY_IS_LOCK_EXPIRED,
  useIsLockExpired,
  useNodeOperatorId,
  useOperatorBalance,
  KEY_OPERATOR_PENALTIES,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import { getCompensationAmount } from '../unlock-bond-state';
import { type UnlockBondFormNetworkData } from './types';

const useUnlockBondFormNetworkData: NetworkData<
  UnlockBondFormNetworkData
> = () => {
  const nodeOperatorId = useNodeOperatorId<true>();

  const balanceQuery = useOperatorBalance({ nodeOperatorId });

  const isExpiredQuery = useIsLockExpired({ nodeOperatorId });

  const bond = balanceQuery.data;
  const isExpired = !!isExpiredQuery.data;

  const compensationAmount = getCompensationAmount(bond, isExpired);

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([
      KEY_OPERATOR_BALANCE,
      KEY_IS_LOCK_EXPIRED,
      KEY_OPERATOR_PENALTIES,
    ]);
  }, [invalidate]);

  return {
    data: {
      nodeOperatorId,
      bond,
      isExpired,
      compensationAmount,
    } as UnlockBondFormNetworkData,
    isPending: balanceQuery.isPending || isExpiredQuery.isPending,
    revalidate,
  };
};

export const useUnlockBondFormData = useFormData<UnlockBondFormNetworkData>;

export const UnlockBondDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useUnlockBondFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
