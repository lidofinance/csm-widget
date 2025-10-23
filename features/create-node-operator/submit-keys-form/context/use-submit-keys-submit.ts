import { useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { useKeysCache } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { useConfirmCustomAddressesModal } from '../hooks/use-confirm-modal';
import {
  useTxCallback,
  useTxModalStagesSubmitKeys,
} from '../hooks/use-tx-modal-stages-submit-keys';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';

export const useSubmitKeysSubmit: FormSubmitterHook<
  SubmitKeysFormInputType,
  SubmitKeysFormNetworkData
> = () => {
  const { csm } = useLidoSDK();
  const { addCachePubkeys, removeCachePubkeys } = useKeysCache();
  const { txModalStages } = useTxModalStagesSubmitKeys();

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
      },
      { address, proof },
      { onConfirm, onRetry },
    ) => {
      invariant(amount !== undefined, 'BondAmount is not defined');

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
      addCachePubkeys,
      csm.icsGate,
      csm.permissionlessGate,
      removeCachePubkeys,
      txModalStages,
    ],
  );
};
