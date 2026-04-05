import { type MethodAccess } from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useCanPerform } from 'shared/hooks';
import { useUnlockBondFormData } from './unlock-bond-data-provider';
import { UnlockBondFormInputType, UnlockBondFormNetworkData } from './types';

type TxResult = bigint | undefined;

export type UnlockBondFlow =
  | { action: 'nothing' }
  | { action: 'no-access'; access: MethodAccess }
  | { action: 'insufficient-bond' }
  | ({ action: 'compensate' } & Executable<TxResult>)
  | ({ action: 'unlock-expired' } & Executable<TxResult>);

export const useUnlockBondFlowResolver = (): FlowResolver<
  UnlockBondFormInputType,
  UnlockBondFormNetworkData,
  UnlockBondFlow
> => {
  const { bond: bondSDK } = useSmSDK();
  const [canCompensate, compensateAccess] = useCanPerform(
    bondSDK,
    'compensateLockedBond',
  );
  const [canUnlockExpired, unlockExpiredAccess] = useCanPerform(
    bondSDK,
    'unlockExpiredLock',
  );

  return useCallback(
    (_input, data) => {
      if (!data.bond?.locked) return { action: 'nothing' };
      if (data.isExpired && !canUnlockExpired)
        return { action: 'no-access', access: unlockExpiredAccess };
      if (!data.isExpired && !canCompensate)
        return { action: 'no-access', access: compensateAccess };
      if (!data.isExpired && !data.compensationAmount)
        return { action: 'insufficient-bond' };

      if (data.isExpired)
        return {
          action: 'unlock-expired' as const,
          submit: (callback) =>
            bondSDK.unlockExpiredLock({
              nodeOperatorId: data.nodeOperatorId,
              callback,
            }),
        };

      return {
        action: 'compensate' as const,
        submit: (callback) =>
          bondSDK.compensateLockedBond({
            nodeOperatorId: data.nodeOperatorId,
            callback,
          }),
      };
    },
    [
      bondSDK,
      canCompensate,
      compensateAccess,
      canUnlockExpired,
      unlockExpiredAccess,
    ],
  );
};

export const useUnlockBondFlow = (): UnlockBondFlow => {
  const resolve = useUnlockBondFlowResolver();
  const data = useUnlockBondFormData(true);
  const input: UnlockBondFormInputType = {};
  return resolve(input, data);
};
