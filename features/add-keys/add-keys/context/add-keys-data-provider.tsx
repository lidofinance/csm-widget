import {
  KEY_DEPOSIT_QUEUE_BATCHES,
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_KEYS,
  KEY_OPERATOR_KEYS_TO_MIGRATE,
  KEY_SHARE_LIMIT,
  KEY_STAKE_LIMIT,
  useCsmStatus,
  useCurveParameters,
  useEthereumBalance,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorCurveId,
  useOperatorInfo,
  useShareLimit,
  useStakeLimit,
  useStethBalance,
  useWstethBalance,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useInvalidate } from 'shared/hooks';
import { type AddKeysFormNetworkData } from './types';

const useAddKeysFormNetworkData: NetworkData<AddKeysFormNetworkData> = () => {
  const { data: status, isPending: isStatusLoading } = useCsmStatus();
  const nodeOperatorId = useNodeOperatorId();

  const ethBalanceQuery = useEthereumBalance();
  const stethBalanceQuery = useStethBalance();
  const wstethBalanceQuery = useWstethBalance();
  const bondQuery = useOperatorBalance(nodeOperatorId);
  const maxStakeEthQuery = useStakeLimit();
  const shareLimitQuery = useShareLimit();

  const ethBalance = ethBalanceQuery.data;
  const stethBalance = stethBalanceQuery.data;
  const wstethBalance = wstethBalanceQuery.data;
  const bond = bondQuery.data;
  const maxStakeEth = maxStakeEthQuery.data;
  const shareLimit = shareLimitQuery.data;

  const isEthBalanceLoading = ethBalanceQuery.isPending;
  const isStethBalanceLoading = stethBalanceQuery.isPending;
  const isWstethBalanceLoading = wstethBalanceQuery.isPending;
  const isBondLoading = bondQuery.isPending;
  const isMaxStakeEthLoading = maxStakeEthQuery.isPending;
  const isShareLimitLoading = shareLimitQuery.isPending;

  const { data: curveId, isPending: isCurveIdLoading } =
    useOperatorCurveId(nodeOperatorId);
  const { data: curveParameters, isPending: isCurveParametersLoading } =
    useCurveParameters(curveId);

  const { data: operatorInfo, isPending: isOperatorInfoLoading } =
    useOperatorInfo(nodeOperatorId);

  // const { data: nonWithdrawnKeys } = useNonWithdrawnKeysCount(`${nodeOperatorId}`);

  // const { data: keysAvailable } = useKeysAvailable({
  //   curveId,
  //   nonWithdrawnKeys,
  //   bond,
  //   ethBalance,
  //   stethBalance,
  //   wstethBalance,
  // });

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([
      ethBalanceQuery.queryKey,
      stethBalanceQuery.queryKey,
      wstethBalanceQuery.queryKey,
      KEY_OPERATOR_BALANCE,
      KEY_SHARE_LIMIT,
      KEY_STAKE_LIMIT,
      KEY_OPERATOR_INFO,
      KEY_OPERATOR_KEYS,
      KEY_OPERATOR_KEYS_TO_MIGRATE,
      KEY_DEPOSIT_QUEUE_BATCHES,
    ]);
  }, [
    invalidate,
    ethBalanceQuery.queryKey,
    stethBalanceQuery.queryKey,
    wstethBalanceQuery.queryKey,
  ]);

  const isPending =
    isEthBalanceLoading ||
    isStethBalanceLoading ||
    isWstethBalanceLoading ||
    isMaxStakeEthLoading ||
    isCurveParametersLoading ||
    isBondLoading ||
    isStatusLoading ||
    isShareLimitLoading ||
    isCurveIdLoading ||
    isOperatorInfoLoading;

  return {
    data: {
      nodeOperatorId,
      curveId,
      operatorInfo,
      curveParameters,
      stethBalance,
      wstethBalance,
      ethBalance,
      bond,
      maxStakeEth,
      shareLimit,
      isPaused: status?.isPaused,
    } as AddKeysFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useAddKeysFormData = useFormData<AddKeysFormNetworkData>;

export const AddKeysDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useAddKeysFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
