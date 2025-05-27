import { useEthereumBalance } from '@lido-sdk/react';
import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { useCsmStatus, useShareLimit, useStakeLimit } from 'modules/web3';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import {
  useKeysAvailable,
  useNodeOperatorBalance,
  useNodeOperatorCurveId,
  useNonWithdrawnKeysCount,
  useSTETHBalance,
  useWSTETHBalance,
} from 'shared/hooks';
import { useBlockNumber } from 'wagmi';
import { type AddKeysFormNetworkData } from './types';

export const useAddKeysFormNetworkData = (): [
  AddKeysFormNetworkData,
  () => Promise<void>,
] => {
  const { data: blockNumber, isLoading: isBlockNumberLoading } =
    useBlockNumber();
  const { data: status, isPending: isStatusLoading } = useCsmStatus();
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

  const { data: maxStakeEther, isPending: isMaxStakeEtherLoading } =
    useStakeLimit();

  const { data: shareLimit, isPending: isShareLimitLoading } = useShareLimit();

  const { data: curveId } = useNodeOperatorCurveId(nodeOperatorId);

  const { data: nonWithdrawnKeys } = useNonWithdrawnKeysCount(nodeOperatorId);

  const { data: keysAvailable } = useKeysAvailable({
    curveId,
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
      updateShareLimit(),
      updateMaxStakeEther(),
    ]);
  }, [
    updateStethBalance,
    updateWstethBalance,
    updateEtherBalance,
    updateBond,
    updateShareLimit,
    updateMaxStakeEther,
  ]);

  const loading = useMemo(
    () => ({
      isEtherBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isMaxStakeEtherLoading,
      isBondLoading,
      isStatusLoading,
      isBlockNumberLoading,
      isShareLimitLoading,
    }),
    [
      isEtherBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isMaxStakeEtherLoading,
      isBondLoading,
      isStatusLoading,
      isBlockNumberLoading,
      isShareLimitLoading,
    ],
  );

  return [
    {
      blockNumber: blockNumber ? Number(blockNumber) : undefined,
      nodeOperatorId,
      keysAvailable,
      stethBalance,
      wstethBalance,
      etherBalance,
      bond,
      maxStakeEther,
      loading,
      shareLimit,
      isPaused: status?.isPaused,
    },
    revalidate,
  ];
};
