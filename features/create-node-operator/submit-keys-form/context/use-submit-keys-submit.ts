import { useDappStatus, useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useConfirmCustomAddressesModal } from '../hooks/use-confirm-modal';
import {
  useTxCallback,
  useTxModalStagesSubmitKeys,
} from '../hooks/use-tx-modal-stages-submit-keys';
import { SubmitKeysFormInputType } from './types';

type SubmitKeysOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useSubmitKeysSubmit = ({
  onConfirm,
  onRetry,
}: SubmitKeysOptions) => {
  const { csm } = useLidoSDK();
  const { address } = useDappStatus();

  const { txModalStages } = useTxModalStagesSubmitKeys();

  const confirmCustomAddresses = useConfirmCustomAddressesModal();
  const txCallback = useTxCallback();

  return useCallback(
    async ({
      referrer,
      depositData,
      token,
      bondAmount: amount,
      specifyCustomAddresses,
      rewardsAddress,
      managerAddress,
      extendedManagerPermissions,
    }: SubmitKeysFormInputType): Promise<boolean> => {
      invariant(depositData.length, 'Keys is not defined');
      invariant(token, 'Token is not defined');
      invariant(amount, 'BondAmount is not defined');
      invariant(address, 'Address is not deinfed');

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
        const callback = txCallback({
          amount,
          token,
          address,
          depositData,
          onRetry,
        });

        await csm.permissionlessGate.addNodeOperator({
          token,
          amount,
          depositData,
          rewardsAddress: (specifyCustomAddresses && rewardsAddress) || '',
          managerAddress: (specifyCustomAddresses && managerAddress) || '',
          extendedManagerPermissions:
            specifyCustomAddresses && extendedManagerPermissions,
          referrer,
          permit: undefined,
          callback,
        });

        void onConfirm?.();

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [
      address,
      confirmCustomAddresses,
      txCallback,
      onRetry,
      csm.permissionlessGate,
      onConfirm,
      txModalStages,
    ],
  );
};
