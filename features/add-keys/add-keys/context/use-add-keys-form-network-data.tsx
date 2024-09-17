import { useEthereumBalance } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import {
  useNonWithdrawnKeysCount,
  useKeysUploadLimit,
  useNodeOperatorBalance,
  useNodeOperatorCurveId,
  useStakingLimitInfo,
  useSTETHBalance,
  useWSTETHBalance,
} from 'shared/hooks';
import { type AddKeysFormNetworkData } from './types';
import { useKeysAvailable } from 'shared/hooks';

export const useAddKeysFormNetworkData = (): [
  AddKeysFormNetworkData,
  () => Promise<void>,
] => {
  const nodeOperatorId = useNodeOperatorId();
  const {
    data: etherBalance,
    update: updateEtherBalance,
    initialLoading: isEtherBalanceLoading,
  } = useEthereumBalance(undefined, STRATEGY_LAZY);
  const {
    data: stethBalance,
    update: updateStethBalance,
    initialLoading: isStethBalanceLoading,
  } = useSTETHBalance(STRATEGY_LAZY);
  const {
    data: wstethBalance,
    update: updateWstethBalance,
    initialLoading: isWstethBalanceLoading,
  } = useWSTETHBalance(STRATEGY_LAZY);
  const {
    data: bond,
    update: updateBond,
    initialLoading: isBondLoading,
  } = useNodeOperatorBalance(nodeOperatorId);
  const {
    data: maxStakeEther,
    update: updateMaxStakeEther,
    initialLoading: isMaxStakeEtherLoading,
  } = useStakingLimitInfo();

  const {
    data: keysUploadLimit,
    update: updateKeysUploadLimit,
    initialLoading: isKeysUploadLimitLoading,
  } = useKeysUploadLimit();

  const { data: curveId } = useNodeOperatorCurveId(nodeOperatorId);

  const { data: nonWithdrawnKeys } = useNonWithdrawnKeysCount(nodeOperatorId);

  const { data: keysAvailable } = useKeysAvailable({
    curveId,
    keysUploadLimit,
    nonWithdrawnKeys,
    bond,
    etherBalance,
    stethBalance,
    wstethBalance,
  });

  const revalidate = useCallback(async () => {
    await Promise.allSettled([
      updateStethBalance(),
      updateWstethBalance(),
      updateEtherBalance(),
      updateBond(),
      updateKeysUploadLimit(),
      updateMaxStakeEther(),
    ]);
  }, [
    updateStethBalance,
    updateWstethBalance,
    updateEtherBalance,
    updateBond,
    updateKeysUploadLimit,
    updateMaxStakeEther,
  ]);

  const loading = useMemo(
    () => ({
      isEtherBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isMaxStakeEtherLoading,
      isBondLoading,
      isKeysUploadLimitLoading,
    }),
    [
      isEtherBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isMaxStakeEtherLoading,
      isBondLoading,
      isKeysUploadLimitLoading,
    ],
  );

  return [
    {
      nodeOperatorId,
      keysUploadLimit,
      keysAvailable,
      stethBalance,
      wstethBalance,
      etherBalance,
      bond,
      maxStakeEther,
      loading,
    },
    revalidate,
  ];
};
