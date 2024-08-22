import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { TOKENS } from 'consts/tokens';
import {
  useCSAccountingRPC,
  useCSModuleWeb3,
  usePermitOrApprove,
  useSendTx,
} from 'shared/hooks';
import { GatherPermitSignatureResult } from 'shared/hooks';
import { handleTxError } from 'shared/transaction-modal';
import { NodeOperatorId } from 'types';
import { addExtraWei, runWithTransactionLogger } from 'utils';
import { AddBondFormInputType, AddBondFormNetworkData } from '../context';
import { useTxModalStagesAddBond } from '../hooks/use-tx-modal-stages-add-bond';

type UseAddBondOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type AddBondMethodParams = {
  amount: BigNumber;
  permit: GatherPermitSignatureResult;
  nodeOperatorId: NodeOperatorId;
};

// encapsulates eth/steth/wsteth flows
const useAddBondTx = () => {
  const CSModuleWeb3 = useCSModuleWeb3();

  return useCallback(
    async (token: TOKENS, params: AddBondMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      switch (token) {
        case TOKENS.ETH:
          return {
            tx: await CSModuleWeb3.populateTransaction.depositETH(
              params.nodeOperatorId,
              {
                value: params.amount,
              },
            ),
            txName: 'depositETH',
          };
        case TOKENS.STETH:
          return {
            tx: await CSModuleWeb3.populateTransaction.depositStETH(
              params.nodeOperatorId,
              params.amount,
              params.permit,
            ),
            txName: 'depositStETH',
          };
        case TOKENS.WSTETH:
          return {
            tx: await CSModuleWeb3.populateTransaction.depositWstETH(
              params.nodeOperatorId,
              params.amount,
              params.permit,
            ),
            txName: 'depositWstETH',
          };
      }
    },
    [CSModuleWeb3],
  );
};

export const useAddBondSubmit = ({ onConfirm, onRetry }: UseAddBondOptions) => {
  const { txModalStages } = useTxModalStagesAddBond();
  const CSAccounting = useCSAccountingRPC();

  const getTx = useAddBondTx();
  const sendTx = useSendTx();
  const getPermitOrApprove = usePermitOrApprove();

  const addBond = useCallback(
    async (
      { bondAmount: amount, token }: AddBondFormInputType,
      { nodeOperatorId }: AddBondFormNetworkData,
    ): Promise<boolean> => {
      invariant(token, 'Token is not defined');
      invariant(amount, 'BondAmount is not defined');
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');

      try {
        const { permit } = await getPermitOrApprove({
          token,
          amount: addExtraWei(amount, token),
          txModalStages,
        });

        txModalStages.sign(amount, token);

        const tx = await getTx(token, {
          nodeOperatorId,
          amount,
          permit,
        });

        const [txHash, waitTx] = await runWithTransactionLogger(
          'AddBond signing',
          () => sendTx(tx),
        );

        txModalStages.pending(amount, token, txHash);

        await runWithTransactionLogger('AddBond block confirmation', waitTx);

        // TODO: move to onConfirm
        const { current } = await CSAccounting.getBondSummary(nodeOperatorId);

        await onConfirm?.();

        txModalStages.success(current, TOKENS.STETH, txHash);

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [
      getTx,
      getPermitOrApprove,
      txModalStages,
      CSAccounting,
      onConfirm,
      sendTx,
      onRetry,
    ],
  );

  return {
    addBond,
  };
};
