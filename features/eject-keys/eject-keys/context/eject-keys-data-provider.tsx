import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import {
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_KEYS,
  useEthereumBalance,
  useKeyEjectFee,
  useNodeOperatorId,
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
import { type EjectKeysFormNetworkData } from './types';

const useEjectKeysFormNetworkData: NetworkData<
  EjectKeysFormNetworkData
> = () => {
  const ethBalanceQuery = useEthereumBalance();
  const nodeOperatorId = useNodeOperatorId();
  const infoQuery = useOperatorInfo(nodeOperatorId);
  const keysQuery = useOperatorKeysWithStatus(nodeOperatorId, (keys) =>
    keys.filter(hasStatus([KEY_STATUS.ACTIVE, KEY_STATUS.ACTIVATION_PENDING])),
  );

  const ethBalance = ethBalanceQuery.data;
  const info = infoQuery.data;
  const keys = keysQuery.data;

  const isEthBalanceLoading = ethBalanceQuery.isPending;
  const isInfoLoading = infoQuery.isPending;
  const isKeysLoading = keysQuery.isPending;

  const { data: curveId, isPending: isCurveIdLoading } =
    useOperatorCurveId(nodeOperatorId);
  const { data: ejectKeyFee, isPending: isEjectKeyFeeLoading } =
    useKeyEjectFee();

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([
      ethBalanceQuery.queryKey,
      KEY_OPERATOR_INFO,
      KEY_OPERATOR_KEYS,
    ]);
  }, [invalidate, ethBalanceQuery.queryKey]);

  const isPending =
    isInfoLoading ||
    isCurveIdLoading ||
    isEthBalanceLoading ||
    isKeysLoading ||
    isEjectKeyFeeLoading;

  return {
    data: {
      ethBalance,
      nodeOperatorId,
      curveId,
      ejectKeyFee,
      keys,
      info,
    } as EjectKeysFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useEjectKeysFormData = useFormData<EjectKeysFormNetworkData>;

export const EjectKeysDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useEjectKeysFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
