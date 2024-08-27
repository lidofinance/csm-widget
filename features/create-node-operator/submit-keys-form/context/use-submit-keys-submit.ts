import { TOKENS } from 'consts/tokens';
import { BigNumberish } from 'ethers';
import { BytesLike } from 'ethers/lib/utils.js';
import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import {
  GatherPermitSignatureResult,
  useAddressCompare,
  useCSModuleWeb3,
  useKeysCache,
  usePermitOrApprove,
  useSendTx,
} from 'shared/hooks';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { Proof } from 'types';
import {
  addExtraWei,
  addressOrZero,
  formatKeys,
  runWithTransactionLogger,
} from 'utils';
import { Address } from 'wagmi';
import { useConfirmCustomAddressesModal } from '../hooks/use-confirm-modal';
import { useTxModalStagesSubmitKeys } from '../hooks/use-tx-modal-stages-submit-keys';
import { getAddedNodeOperator } from 'utils';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';

type SubmitKeysOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type MethodParams = {
  bondAmount: BigNumberish;
  keysCount: BigNumberish;
  publicKeys: BytesLike;
  signatures: BytesLike;
  rewardsAddress: Address;
  managerAddress: Address;
  extendedManagerPermissions: boolean;
  permit: GatherPermitSignatureResult;
  eaProof: Proof;
  referrer: Address;
};

// this encapsulates eth/steth/wsteth flows
const useSubmitKeysTx = () => {
  const CSModuleWeb3 = useCSModuleWeb3();

  return useCallback(
    async (token: TOKENS, params: MethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      switch (token) {
        case TOKENS.ETH:
          return {
            tx: await CSModuleWeb3.populateTransaction.addNodeOperatorETH(
              params.keysCount,
              params.publicKeys,
              params.signatures,
              {
                managerAddress: params.managerAddress,
                rewardAddress: params.rewardsAddress,
                extendedManagerPermissions: params.extendedManagerPermissions,
              },
              params.eaProof,
              params.referrer,
              {
                value: params.bondAmount,
              },
            ),
            txName: 'addNodeOperatorETH',
          };
        case TOKENS.STETH:
          return {
            tx: await CSModuleWeb3.populateTransaction.addNodeOperatorStETH(
              params.keysCount,
              params.publicKeys,
              params.signatures,
              {
                managerAddress: params.managerAddress,
                rewardAddress: params.rewardsAddress,
                extendedManagerPermissions: params.extendedManagerPermissions,
              },
              params.permit,
              params.eaProof,
              params.referrer,
            ),
            txName: 'addNodeOperatorStETH',
          };
        case TOKENS.WSTETH:
          return {
            tx: await CSModuleWeb3.populateTransaction.addNodeOperatorWstETH(
              params.keysCount,
              params.publicKeys,
              params.signatures,
              {
                managerAddress: params.managerAddress,
                rewardAddress: params.rewardsAddress,
                extendedManagerPermissions: params.extendedManagerPermissions,
              },
              params.permit,
              params.eaProof,
              params.referrer,
            ),
            txName: 'addNodeOperatorWstETH',
          };
      }
    },
    [CSModuleWeb3],
  );
};

export const useSubmitKeysSubmit = ({
  onConfirm,
  onRetry,
}: SubmitKeysOptions) => {
  const { txModalStages } = useTxModalStagesSubmitKeys();
  const { append: appendNO } = useNodeOperatorContext();
  const getTx = useSubmitKeysTx();
  const getPermitOrApprove = usePermitOrApprove();
  const sendTx = useSendTx();
  const isUserOrZero = useAddressCompare(true);
  const saveKeys = useKeysCache();

  const confirmCustomAddresses = useConfirmCustomAddressesModal();

  const submitKeys = useCallback(
    async (
      {
        referrer,
        depositData,
        token,
        bondAmount,
        specifyCustomAddresses,
        rewardsAddress,
        managerAddress,
        extendedManagerPermissions,
      }: SubmitKeysFormInputType,
      { eaProof }: SubmitKeysFormNetworkData,
    ): Promise<boolean> => {
      invariant(depositData.length, 'Keys is not defined');
      invariant(token, 'Token is not defined');
      invariant(bondAmount, 'BondAmount is not defined');

      if (
        specifyCustomAddresses &&
        !(await confirmCustomAddresses({
          managerAddress,
          rewardsAddress,
          extendedManagerPermissions,
        }))
      ) {
        return false;
      }

      try {
        const { permit } = await getPermitOrApprove({
          token,
          amount: addExtraWei(bondAmount, token),
          txModalStages,
        });

        const { keysCount, publicKeys, signatures } = formatKeys(depositData);

        txModalStages.sign({ keysCount, amount: bondAmount, token });

        const tx = await getTx(token, {
          bondAmount,
          keysCount,
          publicKeys,
          signatures,
          permit,
          eaProof: eaProof || [],
          rewardsAddress: addressOrZero(
            specifyCustomAddresses && rewardsAddress,
          ),
          managerAddress: addressOrZero(
            specifyCustomAddresses && managerAddress,
          ),
          extendedManagerPermissions:
            specifyCustomAddresses && extendedManagerPermissions,
          referrer: addressOrZero(referrer),
        });

        const [txHash, waitTx] = await runWithTransactionLogger(
          'AddNodeOperator signing',
          () => sendTx(tx),
        );

        txModalStages.pending({ keysCount, amount: bondAmount, token }, txHash);

        const receipt = await runWithTransactionLogger(
          'AddNodeOperator block confirmation',
          waitTx,
        );

        const nodeOperator = getAddedNodeOperator(receipt);

        // TODO: possible add timeout
        await onConfirm?.();

        txModalStages.success({ nodeOperatorId: nodeOperator?.id }, txHash);

        // TODO: move to onConfirm
        if (nodeOperator) {
          appendNO({
            id: nodeOperator.id,
            manager: isUserOrZero(nodeOperator.managerAddress),
            rewards: isUserOrZero(nodeOperator.rewardsAddress),
          });
        }

        // TODO: move to onConfirm
        void saveKeys(depositData);

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [
      confirmCustomAddresses,
      getPermitOrApprove,
      txModalStages,
      getTx,
      onConfirm,
      saveKeys,
      sendTx,
      appendNO,
      isUserOrZero,
      onRetry,
    ],
  );

  return submitKeys;
};
