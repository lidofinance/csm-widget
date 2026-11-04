import { type MethodAccess } from '@lidofinance/lido-csm-sdk';
import { useActiveOperatorSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useCanPerform } from 'shared/hooks';
import { useTxModalStagesRemoveKeys } from '../hooks/use-tx-modal-stages-remove-keys';
import { getRemoveKeysArgs } from '../remove-keys-state';
import { useRemoveKeysFormData } from './remove-keys-data-provider';
import { RemoveKeysFormInputType, RemoveKeysFormNetworkData } from './types';

export type RemoveKeysFlow =
  | { action: 'no-access'; access: MethodAccess }
  | { action: 'no-keys' }
  | ({ action: 'remove' } & Executable);

export const useRemoveKeysFlowResolver = (): FlowResolver<
  RemoveKeysFormInputType,
  RemoveKeysFormNetworkData,
  RemoveKeysFlow
> => {
  const { keys: keysSDK } = useActiveOperatorSDK();
  const [canRemoveKeys, access] = useCanPerform(keysSDK, 'removeKeys');
  const buildCallback = useTxModalStagesRemoveKeys();

  return useCallback(
    (input, data) => {
      if (!canRemoveKeys) return { action: 'no-access', access };
      if (!data.keys?.length) return { action: 'no-keys' };

      return {
        action: 'remove' as const,
        submit: async () =>
          keysSDK.removeKeys({
            nodeOperatorId: data.nodeOperatorId,
            ...getRemoveKeysArgs(
              data.keys,
              data.info.totalDepositedKeys,
              input.selection,
            ),
            callback: buildCallback(input, data),
          }),
      };
    },
    [canRemoveKeys, access, keysSDK, buildCallback],
  );
};

export const useRemoveKeysFlow = (): RemoveKeysFlow => {
  const resolve = useRemoveKeysFlowResolver();
  const data = useRemoveKeysFormData(true);
  return resolve({} as RemoveKeysFormInputType, data);
};
