import {
  useCsmStatus,
  useEthereumBalance,
  useNodeOperatorId,
  useOperatorBalance,
  // useOperatorCurveId,
  useShareLimit,
  useStakeLimit,
  useStethBalance,
  useWstethBalance,
} from 'modules/web3';
import { useCallback, useMemo } from 'react';
// import { useNonWithdrawnKeysCount } from 'shared/hooks';
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
  const { data: ethBalance, isPending: isEthBalanceLoading } =
    useEthereumBalance();
  const { data: stethBalance, isPending: isStethBalanceLoading } =
    useStethBalance();
  const { data: wstethBalance, isPending: isWstethBalanceLoading } =
    useWstethBalance();
  const { data: bond, isPending: isBondLoading } =
    useOperatorBalance(nodeOperatorId);

  const { data: maxStakeEth, isPending: isMaxStakeEthLoading } =
    useStakeLimit();

  const { data: shareLimit, isPending: isShareLimitLoading } = useShareLimit();

  // const { data: curveId } = useOperatorCurveId(nodeOperatorId);

  // const { data: nonWithdrawnKeys } = useNonWithdrawnKeysCount(`${nodeOperatorId}`);

  // const { data: keysAvailable } = useKeysAvailable({
  //   curveId,
  //   nonWithdrawnKeys,
  //   bond,
  //   ethBalance,
  //   stethBalance,
  //   wstethBalance,
  // });

  const revalidate = useCallback(async () => {
    // await Promise.allSettled([
    //   updateStethBalance(),
    //   updateWstethBalance(),
    //   updateEthBalance(),
    //   updateBond(),
    //   updateShareLimit(),
    //   updateMaxStakeEth(),
    // ]);
  }, []);

  const loading = useMemo(
    () => ({
      isEthBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isMaxStakeEthLoading,
      isBondLoading,
      isStatusLoading,
      isBlockNumberLoading,
      isShareLimitLoading,
    }),
    [
      isEthBalanceLoading,
      isStethBalanceLoading,
      isWstethBalanceLoading,
      isMaxStakeEthLoading,
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
