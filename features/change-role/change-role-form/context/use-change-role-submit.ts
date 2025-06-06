import {
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { NodeOperatorId } from '@lidofinance/lido-csm-sdk/common';
import { ROLES } from 'consts/roles';
import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { handleTxError } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { Address, zeroAddress } from 'viem';
import { ChangeRoleFormInputType, ChangeRoleFormNetworkData } from '.';
import {
  useConfirmReproposeModal,
  useConfirmRewardsRoleModal,
} from '../hooks/use-confirm-modal';
import { useTxModalStagesChangeRole } from '../hooks/use-tx-modal-stages-change-role';

type UseChangeRoleOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type ChangeRoleMethodParams = {
  address: Address;
  nodeOperatorId: NodeOperatorId;
  callback: TransactionCallback;
};

const useChangeRoleTx = () => {
  const { csm } = useLidoSDK();

  return useCallback(
    async (
      {
        role,
        isManagerReset,
        isRewardsChange,
      }: { role: ROLES; isRewardsChange: boolean; isManagerReset: boolean },
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

export const useChangeRoleSubmit = ({
  onConfirm,
  onRetry,
}: UseChangeRoleOptions) => {
  const { txModalStages } = useTxModalStagesChangeRole();

  const changeRoleMethod = useChangeRoleTx();

  const confirmRepropose = useConfirmReproposeModal();
  const confirmRewardsRole = useConfirmRewardsRoleModal();

  const changeRole = useCallback(
    async (
      { address: addressRaw, isRevoke }: ChangeRoleFormInputType,
      {
        nodeOperatorId,
        proposedAddress,
        currentAddress,
        role,
        isPropose,
        isManagerReset,
        isRewardsChange,
      }: ChangeRoleFormNetworkData,
    ): Promise<boolean> => {
      const address = isRevoke ? zeroAddress : (addressRaw ?? zeroAddress);
      invariant(role, 'Role is not defined');
      invariant(address, 'Addess is not defined');
      invariant(currentAddress, 'CurrentAddess is not defined');
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');

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

        const callback: TransactionCallback = async ({ stage, payload }) => {
          switch (stage) {
            case TransactionCallbackStage.SIGN:
              txModalStages.sign(props);
              break;
            case TransactionCallbackStage.RECEIPT:
              txModalStages.pending(props, payload.hash);
              break;
            case TransactionCallbackStage.DONE: {
              payload;
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

        await changeRoleMethod(
          { role, isRewardsChange, isManagerReset },
          {
            nodeOperatorId,
            address,
            callback,
          },
        );

        await onConfirm?.();

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [
      confirmRewardsRole,
      confirmRepropose,
      changeRoleMethod,
      onConfirm,
      txModalStages,
      onRetry,
    ],
  );

  return {
    changeRole,
  };
};
