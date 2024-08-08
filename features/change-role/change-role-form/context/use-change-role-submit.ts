import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { AddressZero } from '@ethersproject/constants';
import { ROLES } from 'consts/roles';
import { MultisigBreakError, useCSModuleWeb3, useSendTx } from 'shared/hooks';
import { NodeOperatorId } from 'types';
import { runWithTransactionLogger } from 'utils';
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
  address: string;
  nodeOperatorId: NodeOperatorId;
};

// encapsulates eth/steth/wsteth flows
const useChangeRoleTx = () => {
  const CSModuleWeb3 = useCSModuleWeb3();
  invariant(CSModuleWeb3, 'must have CSModuleWeb3');

  return useCallback(
    (
      {
        role,
        isManagerReset,
        isRewardsChange,
      }: { role: ROLES; isRewardsChange: boolean; isManagerReset: boolean },
      params: ChangeRoleMethodParams,
    ) => {
      switch (true) {
        case isRewardsChange:
          return CSModuleWeb3.populateTransaction.changeNodeOperatorRewardAddress(
            params.nodeOperatorId,
            params.address,
          );
        case isManagerReset:
          return CSModuleWeb3.populateTransaction.resetNodeOperatorManagerAddress(
            params.nodeOperatorId,
          );
        case role === ROLES.REWARDS:
          return CSModuleWeb3.populateTransaction.proposeNodeOperatorRewardAddressChange(
            params.nodeOperatorId,
            params.address,
          );
        case role === ROLES.MANAGER:
          return CSModuleWeb3.populateTransaction.proposeNodeOperatorManagerAddressChange(
            params.nodeOperatorId,
            params.address,
          );
        default: {
          throw new Error('Not implemented yet: true case');
        }
      }
    },
    [CSModuleWeb3],
  );
};

export const useChangeRoleSubmit = ({
  onConfirm,
  onRetry,
}: UseChangeRoleOptions) => {
  const { txModalStages } = useTxModalStagesChangeRole();

  const getTx = useChangeRoleTx();
  const sendTx = useSendTx();

  const confirmRepropose = useConfirmReproposeModal();
  const confirmRewardsRole = useConfirmRewardsRoleModal();

  const changeRole = useCallback(
    async (
      { address: addressRaw, isRevoke }: ChangeRoleFormInputType,
      {
        nodeOperatorId,
        proposedAddress,
        role,
        isPropose,
        isManagerReset,
        isRewardsChange,
      }: ChangeRoleFormNetworkData,
    ): Promise<boolean> => {
      const address = isRevoke ? AddressZero : addressRaw;
      invariant(role, 'Role is not defined');
      invariant(address, 'Addess is not defined');
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
        txModalStages.sign(address, role);

        const tx = await getTx(
          { role, isRewardsChange, isManagerReset },
          {
            nodeOperatorId,
            address,
          },
        );

        const [txHash, waitTx] = await runWithTransactionLogger(
          'ChangeRole signing',
          () => sendTx({ tx }),
        );

        txModalStages.pending(address, role, txHash);

        await runWithTransactionLogger('ChangeRole block confirmation', waitTx);

        await onConfirm?.();

        txModalStages.success(address, role, txHash);

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
      confirmRewardsRole,
      confirmRepropose,
      getTx,
      txModalStages,
      onConfirm,
      sendTx,
      onRetry,
    ],
  );

  return {
    changeRole,
  };
};
