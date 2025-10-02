import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useConfirmCustomAddressesModal } from '../hooks/use-confirm-modal';
import {
  useTxCallback,
  useTxModalStagesSubmitKeys,
} from '../hooks/use-tx-modal-stages-submit-keys';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';
import { useKeysCache } from 'shared/hooks';

type SubmitKeysOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useSubmitKeysSubmit = ({
  onConfirm,
  onRetry,
}: SubmitKeysOptions) => {
  const { csm } = useLidoSDK();

  const { txModalStages } = useTxModalStagesSubmitKeys();

  const { addCachePubkeys, removeCachePubkeys } = useKeysCache();

  const confirmCustomAddresses = useConfirmCustomAddressesModal();
  const txCallback = useTxCallback();

  return useCallback(
    async (
      {
        referrer,
        depositData,
        token,
        bondAmount: amount,
        specifyCustomAddresses,
        rewardsAddress,
        managerAddress,
        extendedManagerPermissions,
      }: SubmitKeysFormInputType,
      { proof, address }: SubmitKeysFormNetworkData,
    ): Promise<boolean> => {
      invariant(depositData?.length, 'Keys is not defined');
      invariant(token, 'Token is not defined');
      invariant(amount !== undefined, 'BondAmount is not defined');
      invariant(address, 'Address is not deinfed');

      const pubkeys = depositData.map(({ pubkey }) => pubkey);

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

        addCachePubkeys(pubkeys);

        if (proof) {
          await csm.icsGate.addNodeOperator({
            token,
            amount,
            depositData,
            rewardsAddress: (specifyCustomAddresses && rewardsAddress) || '',
            managerAddress: (specifyCustomAddresses && managerAddress) || '',
            extendedManagerPermissions:
              specifyCustomAddresses && extendedManagerPermissions,
            referrer,
            proof,
            callback,
          });
        } else {
          await csm.permissionlessGate.addNodeOperator({
            token,
            amount,
            depositData,
            rewardsAddress: (specifyCustomAddresses && rewardsAddress) || '',
            managerAddress: (specifyCustomAddresses && managerAddress) || '',
            extendedManagerPermissions:
              specifyCustomAddresses && extendedManagerPermissions,
            referrer,
            callback,
          });
        }

        void onConfirm?.();

        return true;
      } catch (error) {
        removeCachePubkeys(pubkeys);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [
      confirmCustomAddresses,
      txCallback,
      onRetry,
      addCachePubkeys,
      onConfirm,
      csm.icsGate,
      csm.permissionlessGate,
      removeCachePubkeys,
      txModalStages,
    ],
  );
};
