import {
  NodeOperatorId,
  NodeOperatorShortInfo,
  ROLES,
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { useAppendOperator, useSmSDK } from 'modules/web3';
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
  const sdk = useSmSDK();

  return useCallback(
    async (
      { role, mode }: Pick<ChangeRoleFormNetworkData, 'role' | 'mode'>,
      params: ChangeRoleMethodParams,
    ) => {
      switch (mode) {
        case 'rewardsChange':
          return sdk.roles.changeRewardsAddress(params);
        case 'managerReset':
          return sdk.roles.resetManagerAddress(params);
        case 'propose':
          return role === ROLES.REWARDS
            ? sdk.roles.proposeRewardsAddress(params)
            : sdk.roles.proposeManagerAddress(params);
        default:
          throw new Error(`Unexpected mode: ${mode}`);
      }
    },
    [sdk],
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
      { nodeOperatorId, proposedAddress, currentAddress, role, mode },
      { onConfirm, onRetry },
    ) => {
      const address = isRevoke ? zeroAddress : (addressRaw ?? zeroAddress);
      if (!address) {
        throw new Error('Address is not defined');
      }

      if (
        !isRevoke &&
        mode === 'propose' &&
        role === ROLES.REWARDS &&
        !(await confirmRewardsRole({}))
      ) {
        return false;
      }

      if (
        !isRevoke &&
        mode === 'propose' &&
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
          mode,
          isRevoke,
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
          { role, mode },
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
        return handleTxError(error);
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
