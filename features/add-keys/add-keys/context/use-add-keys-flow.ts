import { type MethodAccess } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useCanPerform, useKeysCache } from 'shared/hooks';
import { useNavigate } from 'shared/navigate';
import invariant from 'tiny-invariant';
import { useTxModalStagesAddKeys } from '../hooks/use-tx-modal-stages-add-keys';
import { useAddKeysFormData } from './add-keys-data-provider';
import { AddKeysFormInputType, AddKeysFormNetworkData } from './types';

export type AddKeysFlow =
  | { action: 'no-access'; access: MethodAccess }
  | ({ action: 'add-keys' } & Executable);

export const useAddKeysFlowResolver = (): FlowResolver<
  AddKeysFormInputType,
  AddKeysFormNetworkData,
  AddKeysFlow
> => {
  const { keys: keysSDK } = useSmSDK();
  const [canAddKeys, addKeysAccess] = useCanPerform(keysSDK, 'addKeys');
  const { addCachePubkeys, removeCachePubkeys } = useKeysCache();
  const n = useNavigate();
  const buildCallback = useTxModalStagesAddKeys();

  return useCallback(
    (input, data) => {
      if (!canAddKeys) return { action: 'no-access', access: addKeysAccess };

      const { depositData, token, bondAmount: amount } = input;

      return {
        action: 'add-keys' as const,
        submit: async (onRetry) => {
          invariant(amount !== undefined, 'BondAmount is not defined');

          const pubkeys = depositData.map(({ pubkey }) => pubkey);
          addCachePubkeys(pubkeys);

          await keysSDK.addKeys({
            nodeOperatorId: data.nodeOperatorId,
            token,
            amount,
            depositData,
            callback: buildCallback(input, data, onRetry),
          });

          void n(PATH.KEYS_VIEW);
        },
        onError: () => {
          const pubkeys = depositData.map(({ pubkey }) => pubkey);
          removeCachePubkeys(pubkeys);
        },
      };
    },
    [
      keysSDK,
      canAddKeys,
      addKeysAccess,
      addCachePubkeys,
      removeCachePubkeys,
      n,
      buildCallback,
    ],
  );
};

export const useAddKeysFlow = (): AddKeysFlow => {
  const resolve = useAddKeysFlowResolver();
  const data = useAddKeysFormData(true);
  return resolve({} as AddKeysFormInputType, data);
};
