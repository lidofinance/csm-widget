import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { TOKENS } from 'consts/tokens';
import {
  MultisigBreakError,
  useCSAccountingRPC,
  useCSModuleWeb3,
  useSendTx,
} from 'shared/hooks';
import { NodeOperatorId } from 'types';
import { runWithTransactionLogger } from 'utils';
import { UnlockBondFormInputType, UnlockBondFormNetworkData } from '../context';
import { useTxModalStagesUnlockBond } from '../hooks/use-tx-modal-stages-unlock-bond';

type UseUnlockBondOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type UnlockBondMethodParams = {
  nodeOperatorId: NodeOperatorId;
  amount: BigNumber;
};

// encapsulates eth/steth/wsteth flows
const useUnlockBondTx = () => {
  const CSModuleWeb3 = useCSModuleWeb3();
  invariant(CSModuleWeb3, 'must have CSModuleWeb3');

  return useCallback(
    (params: UnlockBondMethodParams) => {
      return CSModuleWeb3.populateTransaction.compensateELRewardsStealingPenalty(
        params.nodeOperatorId,
        { value: params.amount },
      );
    },
    [CSModuleWeb3],
  );
};

export const useUnlockBondSubmit = ({
  onConfirm,
  onRetry,
}: UseUnlockBondOptions) => {
  const { txModalStages } = useTxModalStagesUnlockBond();
  const CSAccounting = useCSAccountingRPC();

  const getTx = useUnlockBondTx();
  const sendTx = useSendTx();

  const unlockBond = useCallback(
    async (
      { amount }: UnlockBondFormInputType,
      { nodeOperatorId }: UnlockBondFormNetworkData,
    ): Promise<boolean> => {
      invariant(amount, 'BondAmount is not defined');
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');

      try {
        txModalStages.sign(amount, TOKENS.ETH);

        const tx = await getTx({
          nodeOperatorId,
          amount,
        });

        const [txHash, waitTx] = await runWithTransactionLogger(
          'UnlockBond signing',
          () => sendTx({ tx }),
        );

        txModalStages.pending(amount, TOKENS.ETH, txHash);

        await runWithTransactionLogger('UnlockBond block confirmation', waitTx);

        await onConfirm?.();

        // TODO: move to onConfirm
        const current = await CSAccounting.getActualLockedBond(nodeOperatorId);

        txModalStages.success(current, TOKENS.ETH, txHash);

        return true;
      } catch (error) {
        if (error instanceof MultisigBreakError) {
          txModalStages.successMultisig();
          return true;
        }

        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [getTx, txModalStages, onConfirm, CSAccounting, sendTx, onRetry],
  );

  return {
    unlockBond,
  };
};
