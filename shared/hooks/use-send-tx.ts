import { useSDK } from '@lido-sdk/react';
import { config } from 'config';
import { PopulatedTransaction } from 'ethers';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { applyGasLimitRatio, getFeeData, trackMatomoTxEvent } from 'utils';
import { estimateGas } from 'utils/estimate-gas';
import { useCurrentStaticRpcProvider } from './use-current-static-rpc-provider';
import { useIsMultisig } from './useIsMultisig';
import { MULTISIG_BREAK } from 'shared/transaction-modal';

type SendTxProps = {
  tx: PopulatedTransaction;
  shouldApplyGasLimitRatio?: boolean;
  shouldApplyCalldataSuffix?: boolean;
  txName: string;
};

export const useSendTx = () => {
  const { isMultisig, isLoading: isMultisigLoading } = useIsMultisig();
  const { providerWeb3 } = useSDK();
  const staticRpcProvider = useCurrentStaticRpcProvider();

  const performTx = useCallback(
    async (tx: PopulatedTransaction, txName: string) => {
      invariant(providerWeb3, 'providerWeb3 not defined');
      trackMatomoTxEvent(txName, 'prepare');

      const txHash = await providerWeb3
        .getSigner()
        .sendUncheckedTransaction(tx);

      trackMatomoTxEvent(txName, 'done');

      return txHash;
    },
    [providerWeb3],
  );

  return useCallback(
    async ({
      tx,
      txName,
      shouldApplyGasLimitRatio = true,
      shouldApplyCalldataSuffix = false,
    }: SendTxProps) => {
      invariant(isMultisigLoading === false, 'isMultisig in not loaded');

      if (shouldApplyCalldataSuffix) applyCalldataSuffix(tx);

      if (isMultisig) {
        await performTx(tx, txName);
        throw MULTISIG_BREAK;
      }

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      tx.maxFeePerGas = maxFeePerGas;
      tx.maxPriorityFeePerGas = maxPriorityFeePerGas;

      const gasLimit = await estimateGas(tx, staticRpcProvider);

      tx.gasLimit = shouldApplyGasLimitRatio
        ? applyGasLimitRatio(gasLimit)
        : gasLimit;

      const txHash = await performTx(tx, txName);

      return [
        txHash,
        () => staticRpcProvider.waitForTransaction(txHash),
      ] as const;
    },
    [isMultisigLoading, isMultisig, staticRpcProvider, performTx],
  );
};

// adds metrics indicator for widget tx
export const applyCalldataSuffix = (tx: PopulatedTransaction) => {
  invariant(tx.data, 'transaction must have calldata');
  tx.data = tx.data + config.STAKE_WIDGET_METRIC_SUFFIX;
  return tx;
};
