import {
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_KEYS,
  KEY_OPERATOR_KEYS_TO_MIGRATE,
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
import { useCallback, useMemo } from 'react';
// import { useNonWithdrawnKeysCount } from 'shared/hooks';
import { type AddKeysFormNetworkData } from './types';
import { useInvalidate } from 'shared/hooks';

export const useAddKeysFormNetworkData = (): [
  AddKeysFormNetworkData,
  () => Promise<void>,
] => {
  const { data: status, isPending: isStatusLoading } = useCsmStatus();
  const nodeOperatorId = useNodeOperatorId();
  const {
    data: ethBalance,
    isPending: isEthBalanceLoading,
    refetch: updateEthBalance,
  } = useEthereumBalance();
  const {
    data: stethBalance,
    isPending: isStethBalanceLoading,
    refetch: updateStethBalance,
  } = useStethBalance();
  const {
    data: wstethBalance,
    isPending: isWstethBalanceLoading,
    refetch: updateWstethBalance,
  } = useWstethBalance();
  const {
    data: bond,
    isPending: isBondLoading,
    refetch: updateBond,
  } = useOperatorBalance(nodeOperatorId);

  const {
    data: maxStakeEth,
    isPending: isMaxStakeEthLoading,
    refetch: updateMaxStakeEth,
  } = useStakeLimit();

  const {
    data: shareLimit,
    isPending: isShareLimitLoading,
    refetch: updateShareLimit,
  } = useShareLimit();

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

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      updateStethBalance(),
      updateWstethBalance(),
      updateEthBalance(),
      updateBond(),
      updateShareLimit(),
      updateMaxStakeEth(),
      invalidate([
        KEY_OPERATOR_INFO,
        KEY_OPERATOR_BALANCE,
        KEY_OPERATOR_KEYS,
        KEY_OPERATOR_KEYS_TO_MIGRATE,
      ]),
    ]);
  }, [
    updateBond,
    updateEthBalance,
    updateMaxStakeEth,
    updateShareLimit,
    updateStethBalance,
    updateWstethBalance,
    invalidate,
  ]);

  const loading = useMemo(
    () => ({
      isEthBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isMaxStakeEthLoading,
      isCurveParametersLoading,
      isBondLoading,
      isStatusLoading,
      isShareLimitLoading,
      isCurveIdLoading,
      isOperatorInfoLoading,
    }),
    [
      isEthBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isMaxStakeEthLoading,
      isCurveParametersLoading,
      isBondLoading,
      isStatusLoading,
      isShareLimitLoading,
      isCurveIdLoading,
      isOperatorInfoLoading,
    ],
  );

  return [
    {
      nodeOperatorId,
      curveId,
      operatorInfo,
      curveParameters,
      // keysAvailable,
      stethBalance,
      wstethBalance,
      ethBalance,
      bond,
      maxStakeEth,
      loading,
      shareLimit,
      isPaused: status?.isPaused,
    },
    revalidate,
  ];
};
