import {
  NodeOperatorId,
  NodeOperatorShortInfo,
  ROLES,
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useAppendOperator, useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { handleTxError } from 'shared/transaction-modal';
import { Address, zeroAddress } from 'viem';
import { ChangeRoleFormInputType, ChangeRoleFormNetworkData } from '.';
import {
  useConfirmReproposeModal,
  useConfirmRewardsRoleModal,
} from '../hooks/use-confirm-modal';
import { useTxModalStagesChangeRole } from '../hooks/use-tx-modal-stages-change-role';

type ChangeRoleMethodParams = {
  address: Address;
  nodeOperatorId: NodeOperatorId;
  callback: TransactionCallback<NodeOperatorShortInfo>;
};

const useChangeRoleTx = () => {
  const { csm } = useLidoSDK();

  return useCallback(
    async (
      {
        role,
        isManagerReset,
        isRewardsChange,
      }: Pick<
        ChangeRoleFormNetworkData,
        'role' | 'isManagerReset' | 'isRewardsChange'
      >,
      params: ChangeRoleMethodParams,
    ) => {
      switch (true) {
        case isRewardsChange:
          return csm.roles.changeRewardsRole(params);
        case isManagerReset:
          return csm.roles.resetManagerRole(params);
        case role === ROLES.REWARDS:
          return csm.roles.proposeRewardsRole(params);
        case role === ROLES.MANAGER:
          return csm.roles.proposeManagerRole(params);
        default: {
          throw new Error('Not implemented yet: true case');
        }
      }
    },
    [csm],
  );
};

export const useChangeRoleSubmit: FormSubmitterHook<
  ChangeRoleFormInputType,
  ChangeRoleFormNetworkData
> = () => {
  const { txModalStages } = useTxModalStagesChangeRole();

  const changeRoleMethod = useChangeRoleTx();

  const appendNO = useAppendOperator();

  const confirmRepropose = useConfirmReproposeModal();
  const confirmRewardsRole = useConfirmRewardsRoleModal();

  return useCallback(
    async (
      { address: addressRaw, isRevoke },
      {
        nodeOperatorId,
        proposedAddress,
        currentAddress,
        role,
        isPropose,
        isManagerReset,
        isRewardsChange,
      },
      { onConfirm, onRetry },
    ) => {
      const address = isRevoke ? zeroAddress : (addressRaw ?? zeroAddress);
      if (!address) {
        throw new Error('Address is not defined');
      }

      if (
        !isRevoke &&
        isPropose &&
        role === ROLES.REWARDS &&
        !(await confirmRewardsRole({}))
      ) {
        return false;
      }

      if (
        !isRevoke &&
        isPropose &&
        proposedAddress &&
        !(await confirmRepropose({}))
      ) {
        return false;
      }

      try {
        const props = {
          address,
          currentAddress,
          role,
          isPropose,
          isRevoke,
          isRewardsChange,
          isManagerReset,
        };

        const callback: TransactionCallback<NodeOperatorShortInfo> = async ({
          stage,
          payload,
        }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign(props);
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending(props, payload.hash);
              break;
            case TransactionCallbackStage.DONE: {
              txModalStages.success(props, payload.hash);
              break;
            }
            case TransactionCallbackStage.MULTISIG_DONE:
              txModalStages.successMultisig();
              break;
            case TransactionCallbackStage.ERROR:
              txModalStages.failed(payload.error, onRetry);
              break;
            default:
          }
        };

        const { result } = await changeRoleMethod(
          { role, isRewardsChange, isManagerReset },
          {
            nodeOperatorId,
            address,
            callback,
          },
        );

        await onConfirm?.();

        if (result) {
          appendNO(result);
        }

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [
      confirmRewardsRole,
      confirmRepropose,
      changeRoleMethod,
      txModalStages,
      appendNO,
    ],
  );
};
