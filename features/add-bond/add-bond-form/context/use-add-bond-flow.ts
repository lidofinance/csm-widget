import {
  type AddBondResult,
  type MethodAccess,
} from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useCanPerform } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { useAddBondFormData } from './add-bond-data-provider';
import { AddBondFormInputType, AddBondFormNetworkData } from './types';

export type AddBondFlow =
  | { action: 'no-access'; access: MethodAccess }
  | { action: 'paused' }
  | ({ action: 'add-bond' } & Executable<AddBondResult>);

export const useAddBondFlowResolver = (): FlowResolver<
  AddBondFormInputType,
  AddBondFormNetworkData,
  AddBondFlow
> => {
  const { bond: bondSDK } = useSmSDK();
  const [canAddBond, addBondAccess] = useCanPerform(bondSDK, 'addBond');

  return useCallback(
    (input, data) => {
      if (!canAddBond) return { action: 'no-access', access: addBondAccess };
      if (data.isPaused) return { action: 'paused' };

      return {
        action: 'add-bond' as const,
        submit: (callback) => {
          invariant(
            input.bondAmount !== undefined,
            'BondAmount is not defined',
          );
          return bondSDK.addBond({
            nodeOperatorId: data.nodeOperatorId,
            token: input.token,
            amount: input.bondAmount,
            callback,
          });
        },
      };
    },
    [bondSDK, canAddBond, addBondAccess],
  );
};

export const useAddBondFlow = (): AddBondFlow => {
  const resolve = useAddBondFlowResolver();
  const data = useAddBondFormData(true);
  return resolve({} as AddBondFormInputType, data);
};
