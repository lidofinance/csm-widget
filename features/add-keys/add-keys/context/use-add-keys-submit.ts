import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { BytesLike } from 'ethers/lib/utils.js';
import { useCallback } from 'react';
import {
  GatherPermitSignatureResult,
  useCSModuleWeb3,
  useKeysCache,
  usePermitOrApprove,
  useSendTx,
} from 'shared/hooks';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { NodeOperatorId } from 'types';
import { addExtraWei, formatKeys, runWithTransactionLogger } from 'utils';
import { useTxModalStagesAddKeys } from '../hooks/use-tx-modal-stages-add-keys';
import { AddKeysFormInputType, AddKeysFormNetworkData } from './types';

type AddKeysOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type MethodParams = {
  nodeOperatorId: NodeOperatorId;
  bondAmount: BigNumber;
  keysCount: number;
  publicKeys: BytesLike;
  signatures: BytesLike;
  permit: GatherPermitSignatureResult;
};

// this encapsulates eth/steth/wsteth flows
const useAddKeysTx = () => {
  const CSModuleWeb3 = useCSModuleWeb3();

  return useCallback(
    async (token: TOKENS, params: MethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      switch (true) {
        case token === TOKENS.STETH || params.bondAmount.isZero():
          return {
            tx: await CSModuleWeb3.populateTransaction.addValidatorKeysStETH(
              params.nodeOperatorId,
              params.keysCount,
              params.publicKeys,
              params.signatures,
              params.permit,
            ),
            txName: 'addValidatorKeysStETH',
          };
        case token === TOKENS.ETH:
          return {
            tx: await CSModuleWeb3.populateTransaction.addValidatorKeysETH(
              params.nodeOperatorId,
              params.keysCount,
              params.publicKeys,
              params.signatures,
              { value: params.bondAmount },
            ),
            txName: 'addValidatorKeysETH',
          };
        case token === TOKENS.WSTETH:
          return {
            tx: await CSModuleWeb3.populateTransaction.addValidatorKeysWstETH(
              params.nodeOperatorId,
              params.keysCount,
              params.publicKeys,
              params.signatures,
              params.permit,
            ),
            txName: 'addValidatorKeysWstETH',
          };
        default: {
          throw new Error('Not implemented yet: true case');
        }
      }
    },
    [CSModuleWeb3],
  );
};

export const useAddKeysSubmit = ({ onConfirm, onRetry }: AddKeysOptions) => {
  const { txModalStages } = useTxModalStagesAddKeys();
  const getPermitOrApprove = usePermitOrApprove();
  const getTx = useAddKeysTx();
  const sendTx = useSendTx();

  const { addCacheKeys } = useKeysCache();

  return useCallback(
    async (
      { depositData, token, bondAmount }: AddKeysFormInputType,
      { nodeOperatorId }: AddKeysFormNetworkData,
    ): Promise<boolean> => {
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');
      invariant(depositData.length, 'Keys is not defined');
      invariant(token, 'Token is not defined');
      invariant(bondAmount, 'BondAmount is not defined');

      try {
        const { permit } = await getPermitOrApprove({
          token,
          amount: addExtraWei(bondAmount, token),
          txModalStages,
        });

        const { keysCount, publicKeys, signatures } = formatKeys(depositData);

        txModalStages.sign({
          keysCount,
          amount: bondAmount,
          token,
          nodeOperatorId,
        });

        const tx = await getTx(token, {
          nodeOperatorId,
          bondAmount,
          keysCount,
          publicKeys,
          signatures,
          permit,
        });

        const [txHash, waitTx] = await runWithTransactionLogger(
          'AddKeys signing',
          () => sendTx(tx),
        );

        txModalStages.pending(
          { keysCount, amount: bondAmount, token, nodeOperatorId },
          txHash,
        );

        await runWithTransactionLogger('AddKeys block confirmation', waitTx);

        await onConfirm?.();

        txModalStages.success(
          { nodeOperatorId, keys: depositData.map((key) => key.pubkey) },
          txHash,
        );

        // TODO: move to onConfirm
        void addCacheKeys(depositData.map(({ pubkey }) => pubkey));

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [
      getPermitOrApprove,
      txModalStages,
      getTx,
      onConfirm,
      addCacheKeys,
      sendTx,
      onRetry,
    ],
  );
};
