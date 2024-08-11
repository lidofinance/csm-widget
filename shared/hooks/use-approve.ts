import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { BigNumber } from '@ethersproject/bignumber';
import type { ContractReceipt } from '@ethersproject/contracts';
import { getERC20Contract } from '@lido-sdk/contracts';
import { useAllowance, useSDK } from '@lido-sdk/react';

import { STRATEGY_LAZY } from 'consts/swr-strategies';
import { runWithTransactionLogger } from 'utils';
import { useSendTx } from './use-send-tx';

type ApproveOptions = {
  amount: BigNumber;
  onTxStart?: () => void | Promise<void>;
  onTxSent?: (tx: string) => void | Promise<void>;
  onTxAwaited?: (tx: ContractReceipt) => void | Promise<void>;
};

export type UseApproveResponse = {
  approve: (options: ApproveOptions) => Promise<string>;
  initialLoading: boolean;
  allowance: BigNumber | undefined;
  loading: boolean;
  error: unknown;
};

export const useApprove = (
  token: string,
  spender: string,
  owner?: string,
): UseApproveResponse => {
  const { providerWeb3 } = useSDK();
  const sendTx = useSendTx();

  invariant(token != null, 'Token is required');
  invariant(spender != null, 'Spender is required');

  const result = useAllowance(token, spender, owner, STRATEGY_LAZY);
  const { data: allowance, update: updateAllowance } = result;

  const approve = useCallback<UseApproveResponse['approve']>(
    async ({ amount, onTxStart, onTxSent, onTxAwaited }) => {
      invariant(providerWeb3 != null, 'Web3 provider is required');

      await onTxStart?.();
      const contractWeb3 = getERC20Contract(token, providerWeb3.getSigner());

      const processApproveTx = async () => {
        const tx = await contractWeb3.populateTransaction.approve(
          spender,
          amount,
        );
        return sendTx({
          tx,
          shouldApplyGasLimitRatio: false,
          txName: 'approve',
        });
      };

      const [approveTxHash, waitApproveTx] = await runWithTransactionLogger(
        'Approve signing',
        processApproveTx,
      );
      await onTxSent?.(approveTxHash);

      const receipt = await runWithTransactionLogger(
        'Approve block confirmation',
        waitApproveTx,
      );
      await onTxAwaited?.(receipt);

      await updateAllowance();

      return approveTxHash;
    },
    [providerWeb3, token, updateAllowance, spender, sendTx],
  );

  return {
    approve,
    allowance,

    /*
     * support dependency collection
     * https://swr.vercel.app/advanced/performance#dependency-collection
     */

    get initialLoading() {
      return result.initialLoading;
    },
    get loading() {
      return result.loading;
    },
    get error() {
      return result.error;
    },
  };
};
