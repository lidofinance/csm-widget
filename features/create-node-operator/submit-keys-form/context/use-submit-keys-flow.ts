import { MODULE_NAME, getNodeOperatorRoles } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts';
import { useOperatorCustomAddresses } from 'features/starter-pack/banner-operator-custom-addresses';
import { useAppendOperator, useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useKeysCache } from 'shared/hooks';
import { useNavigate } from 'shared/navigate';
import invariant from 'tiny-invariant';
import { useConfirmCustomAddressesModal } from '../hooks/use-confirm-modal';
import { useTxModalStagesSubmitKeys } from '../hooks/use-tx-modal-stages-submit-keys';
import { useSubmitKeysFormData } from './submit-keys-data-provider';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';

export type SubmitKeysFlow =
  | { action: 'cannot-submit' }
  | ({ action: 'submit-keys' } & Executable);

export const useSubmitKeysFlowResolver = (): FlowResolver<
  SubmitKeysFormInputType,
  SubmitKeysFormNetworkData,
  SubmitKeysFlow
> => {
  const sdk = useSmSDK(MODULE_NAME.CSM);
  const { addCachePubkeys, removeCachePubkeys } = useKeysCache();
  const appendNO = useAppendOperator();
  const [, setOperatorCustomAddresses] = useOperatorCustomAddresses();
  const n = useNavigate();
  const confirmCustomAddresses = useConfirmCustomAddressesModal();
  const buildCallback = useTxModalStagesSubmitKeys();

  return useCallback(
    (input, data) => {
      if (!sdk) return { action: 'cannot-submit' };

      const {
        referrer,
        depositData,
        token,
        bondAmount: amount,
        specifyCustomAddresses,
        rewardsAddress,
        managerAddress,
        extendedManagerPermissions,
      } = input;

      return {
        action: 'submit-keys' as const,
        confirm: async () =>
          !specifyCustomAddresses ||
          confirmCustomAddresses({
            managerAddress,
            rewardsAddress,
            extendedManagerPermissions,
          }),
        submit: async () => {
          invariant(amount !== undefined, 'BondAmount is not defined');

          const pubkeys = depositData.map(({ pubkey }) => pubkey);
          addCachePubkeys(pubkeys);

          const callback = buildCallback(input, data);

          const params = {
            token,
            amount,
            depositData,
            rewardsAddress: (specifyCustomAddresses && rewardsAddress) || '',
            managerAddress: (specifyCustomAddresses && managerAddress) || '',
            extendedManagerPermissions:
              specifyCustomAddresses && extendedManagerPermissions,
            referrer: referrer || undefined,
            callback,
          };

          const { result } = data.proof
            ? await sdk.icsGate.addNodeOperator({
                ...params,
                proof: data.proof,
              })
            : await sdk.permissionlessGate.addNodeOperator(params);

          if (result) {
            const roles = getNodeOperatorRoles(result, data.address);
            if (roles.length > 0) {
              appendNO(result);
            } else {
              setOperatorCustomAddresses(result.nodeOperatorId);
              void n(PATH.HOME);
            }
          }
        },
        onError: () => {
          const pubkeys = depositData.map(({ pubkey }) => pubkey);
          removeCachePubkeys(pubkeys);
        },
      };
    },
    [
      sdk,
      addCachePubkeys,
      removeCachePubkeys,
      appendNO,
      setOperatorCustomAddresses,
      n,
      confirmCustomAddresses,
      buildCallback,
    ],
  );
};

export const useSubmitKeysFlow = (): SubmitKeysFlow => {
  const resolve = useSubmitKeysFlowResolver();
  const data = useSubmitKeysFormData(true);
  return resolve({} as SubmitKeysFormInputType, data);
};
