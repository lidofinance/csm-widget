import {
  useEthereumBalance,
  useNodeOperatorId,
  useOperatorCurveId,
  useOperatorInfo,
  useWithdrawalRequestFee,
} from 'modules/web3';
import { useCallback, useMemo } from 'react';
import { useKeysWithStatus } from 'shared/hooks';
import { type EjectKeysFormNetworkData } from './types';

export const useEjectKeysFormNetworkData = (): [
  EjectKeysFormNetworkData,
  () => Promise<void>,
] => {
  const {
    data: ethBalance,
    isPending: isEthBalanceLoading,
    refetch: updateEthBalance,
  } = useEthereumBalance();
  const nodeOperatorId = useNodeOperatorId();
  const {
    data: info,
    isPending: isInfoLoading,
    refetch: updateInfo,
  } = useOperatorInfo(nodeOperatorId);

  const { data: curveId, isPending: isCurveIdLoading } =
    useOperatorCurveId(nodeOperatorId);
  const {
    data: withdrawalRequestFee,
    isPending: isWithdrawalRequestFeeLoading,
  } = useWithdrawalRequestFee(curveId);

  // FIXME: filter keys by status & activaion time
  const {
    data: keys,
    initialLoading: isKeysLoading,
    update: updateKeys,
  } = useKeysWithStatus(true);

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateInfo(), updateKeys(), updateEthBalance()]);
  }, [updateEthBalance, updateInfo, updateKeys]);

  const loading = useMemo(
    () => ({
      isInfoLoading,
      isCurveIdLoading,
      isEthBalanceLoading,
      isKeysLoading,
      isWithdrawalRequestFeeLoading,
    }),
    [
      isCurveIdLoading,
      isEthBalanceLoading,
      isInfoLoading,
      isKeysLoading,
      isWithdrawalRequestFeeLoading,
    ],
  );

  return [
    {
      ethBalance,
      nodeOperatorId,
      curveId,
      withdrawalRequestFee,
      keys,
      info,
      loading,
    },
    revalidate,
  ];
};
