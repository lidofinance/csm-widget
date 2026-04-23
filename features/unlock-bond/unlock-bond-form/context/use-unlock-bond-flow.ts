import { type MethodAccess } from '@lidofinance/lido-csm-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useCanPerform } from 'shared/hooks';
import { useTxModalStagesCompensate } from '../hooks/use-tx-modal-stages-compensate';
import { useTxModalStagesUnlockExpired } from '../hooks/use-tx-modal-stages-unlock-expired';
import { useUnlockBondFormData } from './unlock-bond-data-provider';
import { UnlockBondFormInputType, UnlockBondFormNetworkData } from './types';

export type UnlockBondFlow =
  | { action: 'nothing' }
  | { action: 'no-access'; access: MethodAccess }
  | { action: 'insufficient-bond' }
  | ({ action: 'compensate' } & Executable)
  | ({ action: 'unlock-expired' } & Executable);

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
  const buildCompensateCallback = useTxModalStagesCompensate();
  const buildUnlockExpiredCallback = useTxModalStagesUnlockExpired();

  return useCallback(
    (input, data) => {
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
          submit: () =>
            bondSDK.unlockExpiredLock({
              nodeOperatorId: data.nodeOperatorId,
              callback: buildUnlockExpiredCallback(input, data),
            }),
        };

      return {
        action: 'compensate' as const,
        submit: () =>
          bondSDK.compensateLockedBond({
            nodeOperatorId: data.nodeOperatorId,
            callback: buildCompensateCallback(input, data),
          }),
      };
    },
    [
      bondSDK,
      canCompensate,
      compensateAccess,
      canUnlockExpired,
      unlockExpiredAccess,
      buildCompensateCallback,
      buildUnlockExpiredCallback,
    ],
  );
};

export const useUnlockBondFlow = (): UnlockBondFlow => {
  const resolve = useUnlockBondFlowResolver();
  const data = useUnlockBondFormData(true);
  const input: UnlockBondFormInputType = {};
  return resolve(input, data);
};
