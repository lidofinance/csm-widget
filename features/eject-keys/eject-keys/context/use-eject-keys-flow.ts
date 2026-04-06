import { type MethodAccess } from '@lidofinance/lido-csm-sdk';
import { HIGH_EJECTION_COST_THRESHOLD } from 'consts';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useCanPerform } from 'shared/hooks';
import { useEjectKeysFormData } from './eject-keys-data-provider';
import { EjectKeysFormInputType, EjectKeysFormNetworkData } from './types';
import { invariant } from '@lidofinance/lido-ethereum-sdk';
import { useConfirmHighCostModal } from '../hooks/use-confirm-high-cost-modal';
import { useConfirmEjectKeysModal } from '../hooks/use-confirm-modal';

export type EjectKeysFlow =
  | { action: 'no-access'; access: MethodAccess }
  | { action: 'no-keys' }
  | ({ action: 'eject' } & Executable);

export const useEjectKeysFlowResolver = (): FlowResolver<
  EjectKeysFormInputType,
  EjectKeysFormNetworkData,
  EjectKeysFlow
> => {
  const { keys: keysSDK } = useSmSDK();
  const [canEjectKeys, access] = useCanPerform(keysSDK, 'ejectKeys');
  const confirmEject = useConfirmEjectKeysModal();
  const confirmHighCost = useConfirmHighCostModal();

  return useCallback(
    (input, data) => {
      if (!canEjectKeys) return { action: 'no-access', access };
      if (!data.keys?.length) return { action: 'no-keys' };

      return {
        action: 'eject' as const,
        confirm: async () => {
          if (
            data.ejectKeyFee >= HIGH_EJECTION_COST_THRESHOLD &&
            !(await confirmHighCost({}))
          ) {
            return false;
          }

          return confirmEject({});
        },
        submit: (callback) => {
          invariant(input.feeAmount !== undefined, 'Fee amount is required');

          return keysSDK.ejectKeys({
            nodeOperatorId: data.nodeOperatorId,
            keyIndices: input.selection.map(BigInt),
            amount: input.feeAmount,
            callback,
          });
        },
      };
    },
    [keysSDK, canEjectKeys, access, confirmEject, confirmHighCost],
  );
};

export const useEjectKeysFlow = (): EjectKeysFlow => {
  const resolve = useEjectKeysFlowResolver();
  const data = useEjectKeysFormData(true);
  return resolve({} as EjectKeysFormInputType, data);
};
