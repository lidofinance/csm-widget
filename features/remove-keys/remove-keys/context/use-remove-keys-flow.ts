import { type MethodAccess } from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useCanPerform, useKeysCache } from 'shared/hooks';
import { useTxModalStagesRemoveKeys } from '../hooks/use-tx-modal-stages-remove-keys';
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
  const { keys: keysSDK } = useSmSDK();
  const { removeCachePubkeys } = useKeysCache();
  const [canRemoveKeys, access] = useCanPerform(keysSDK, 'removeKeys');
  const buildCallback = useTxModalStagesRemoveKeys();

  return useCallback(
    (input, data) => {
      if (!canRemoveKeys) return { action: 'no-access', access };
      if (!data.keys?.length) return { action: 'no-keys' };

      return {
        action: 'remove' as const,
        submit: async (onRetry) => {
          const result = await keysSDK.removeKeys({
            nodeOperatorId: data.nodeOperatorId,
            startIndex: BigInt(
              data.info.totalDepositedKeys + input.selection.start,
            ),
            keysCount: BigInt(input.selection.count),
            callback: buildCallback(input, data, onRetry),
          });
          void removeCachePubkeys(
            data.keys
              .map(({ pubkey }) => pubkey)
              .slice(
                input.selection.start,
                input.selection.start + input.selection.count,
              ),
          );
          return result;
        },
      };
    },
    [canRemoveKeys, access, keysSDK, removeCachePubkeys, buildCallback],
  );
};

export const useRemoveKeysFlow = (): RemoveKeysFlow => {
  const resolve = useRemoveKeysFlowResolver();
  const data = useRemoveKeysFormData(true);
  return resolve({} as RemoveKeysFormInputType, data);
};
