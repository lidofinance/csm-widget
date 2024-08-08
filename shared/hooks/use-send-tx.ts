import { useCallback } from 'react';
import { useCurrentStaticRpcProvider } from './use-current-static-rpc-provider';
import { PopulatedTransaction } from 'ethers';
import { useSDK } from '@lido-sdk/react';
import invariant from 'tiny-invariant';
import { applyGasLimitRatio, getFeeData } from 'utils';
import { estimateGas } from 'utils/estimate-gas';
import { useIsMultisig } from './useIsMultisig';
import { config } from 'config';

type SendTxProps = {
  tx: PopulatedTransaction;
  shouldApplyGasLimitRatio?: boolean;
  shouldApplyCalldataSuffix?: boolean;
};

export const useSendTx = () => {
  const { isMultisig, isLoading: isMultisigLoading } = useIsMultisig();
  const { providerWeb3 } = useSDK();
  const { staticRpcProvider } = useCurrentStaticRpcProvider();

  return useCallback(
    async ({
      tx,
      shouldApplyGasLimitRatio = true,
      shouldApplyCalldataSuffix = false,
    }: SendTxProps) => {
      invariant(providerWeb3, 'providerWeb3 not defined');
      invariant(isMultisigLoading === false, 'isMultisig in not loaded');

      if (shouldApplyCalldataSuffix) applyCalldataSuffix(tx);

      if (isMultisig) {
        await providerWeb3.getSigner().sendUncheckedTransaction(tx);
        throw multisigBreak;
      }

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      tx.maxFeePerGas = maxFeePerGas;
      tx.maxPriorityFeePerGas = maxPriorityFeePerGas;

      const gasLimit = await estimateGas(tx, staticRpcProvider);

      tx.gasLimit = shouldApplyGasLimitRatio
        ? applyGasLimitRatio(gasLimit)
        : gasLimit;

      const txHash = await providerWeb3
        .getSigner()
        .sendUncheckedTransaction(tx);

      return [
        txHash,
        () => staticRpcProvider.waitForTransaction(txHash),
      ] as const;
    },
    [providerWeb3, isMultisigLoading, isMultisig, staticRpcProvider],
  );
};

// adds metrics indicator for widget tx
export const applyCalldataSuffix = (tx: PopulatedTransaction) => {
  invariant(tx.data, 'transaction must have calldata');
  tx.data = tx.data + config.STAKE_WIDGET_METRIC_SUFFIX;
  return tx;
};

export class MultisigBreakError extends Error {
  isMultisigBreak = true;
}

const multisigBreak = new MultisigBreakError();
