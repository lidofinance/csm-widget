import { type MethodAccess } from '@lidofinance/lido-csm-sdk';
import { config } from 'config';
import { PATH } from 'consts/urls';
import { useDkgInFlowUpload } from 'features/idvtc/dkg/hooks/use-dkg-in-flow-upload';
import { useSurveyInFlowAuth } from 'features/idvtc/shared/use-survey-in-flow-auth';
import { operatorKey } from 'modules/surveys-sdk';
import { useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useCanPerform } from 'shared/hooks';
import { useNavigate } from 'shared/navigate';
import { handleTxError } from 'shared/transaction-modal';
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
  const n = useNavigate();
  const buildCallback = useTxModalStagesAddKeys();
  const surveyAuth = useSurveyInFlowAuth();
  const { ensureAuth, uploadStaged } = useDkgInFlowUpload(surveyAuth);

  return useCallback(
    (input, data) => {
      if (!canAddKeys) return { action: 'no-access', access: addKeysAccess };

      const { depositData, token, bondAmount: amount, dkgFiles = [] } = input;

      return {
        action: 'add-keys' as const,
        // The operator already exists, so auth + upload both happen here
        // (before the tx) rather than being split like the create flow.
        confirm: async () => {
          if (dkgFiles.length === 0) return true;
          try {
            const op = operatorKey(config.module, data.nodeOperatorId);
            invariant(op, 'nodeOperatorId is required to upload DKG files');
            await ensureAuth(dkgFiles);
            await uploadStaged(op, dkgFiles);
            return true;
          } catch (error) {
            handleTxError(error);
            return false;
          }
        },
        submit: async () => {
          invariant(amount !== undefined, 'BondAmount is not defined');

          await keysSDK.addKeys({
            nodeOperatorId: data.nodeOperatorId,
            token,
            amount,
            depositData,
            callback: buildCallback(input, data),
          });

          void n(PATH.KEYS_VIEW);
        },
      };
    },
    [
      keysSDK,
      canAddKeys,
      addKeysAccess,
      n,
      buildCallback,
      ensureAuth,
      uploadStaged,
    ],
  );
};

export const useAddKeysFlow = (): AddKeysFlow => {
  const resolve = useAddKeysFlowResolver();
  const data = useAddKeysFormData(true);
  return resolve({} as AddKeysFormInputType, data);
};
