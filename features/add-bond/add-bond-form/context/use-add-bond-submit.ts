import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { TOKENS } from 'consts/tokens';
import {
  MultisigBreakError,
  useCSAccountingRPC,
  useCSModuleWeb3,
  usePermitOrApprove,
  useSendTx,
} from 'shared/hooks';
import { GatherPermitSignatureResult } from 'shared/hooks/use-csm-permit-signature';
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
  invariant(CSModuleWeb3, 'must have CSModuleWeb3');

  return useCallback(
    (token: TOKENS, params: AddBondMethodParams) => {
      switch (token) {
        case TOKENS.ETH:
          return CSModuleWeb3.populateTransaction.depositETH(
            params.nodeOperatorId,
            {
              value: params.amount,
            },
          );
        case TOKENS.STETH:
          return CSModuleWeb3.populateTransaction.depositStETH(
            params.nodeOperatorId,
            params.amount,
            params.permit,
          );
        case TOKENS.WSTETH:
          return CSModuleWeb3.populateTransaction.depositWstETH(
            params.nodeOperatorId,
            params.amount,
            params.permit,
          );
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
          () => sendTx({ tx }),
        );

        txModalStages.pending(amount, token, txHash);

        await runWithTransactionLogger('AddBond block confirmation', waitTx);

        // TODO: move to onConfirm
        const { current } = await CSAccounting.getBondSummary(nodeOperatorId);

        await onConfirm?.();

        txModalStages.success(current, TOKENS.STETH, txHash);

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
