import { useSDK } from '@lido-sdk/react';
import { config } from 'config';
import { PopulatedTransaction } from 'ethers';
import { useCallback } from 'react';
import { MULTISIG_BREAK } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { trackMatomoTxEvent } from 'utils';
import { useIsMultisig } from './useIsMultisig';

type SendTxProps = {
  tx: PopulatedTransaction;
  shouldApplyGasLimitRatio?: boolean;
  shouldApplyCalldataSuffix?: boolean;
  txName: string;
};

export const useSendTx = () => {
  const { isMultisig, isLoading: isMultisigLoading } = useIsMultisig();
  const { providerWeb3, providerRpc } = useSDK();

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
    async ({ tx, txName, shouldApplyCalldataSuffix = false }: SendTxProps) => {
      invariant(isMultisigLoading === false, 'isMultisig in not loaded');

      if (shouldApplyCalldataSuffix) applyCalldataSuffix(tx);

      if (isMultisig) {
        await performTx(tx, txName);
        throw MULTISIG_BREAK;
      }

      // const { maxFeePerGas, maxPriorityFeePerGas } = await getFeeData(config);

      // tx.maxFeePerGas = maxFeePerGas;
      // tx.maxPriorityFeePerGas = maxPriorityFeePerGas;

      const txHash = await performTx(tx, txName);

      return [txHash, () => providerRpc.waitForTransaction(txHash)] as const;
    },
    [isMultisigLoading, isMultisig, providerRpc, performTx],
  );
};

// adds metrics indicator for widget tx
export const applyCalldataSuffix = (tx: PopulatedTransaction) => {
  invariant(tx.data, 'transaction must have calldata');
  tx.data = tx.data + config.CSM_WIDGET_METRIC_SUFFIX;
  return tx;
};
