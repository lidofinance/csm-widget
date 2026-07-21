import {
  getNodeOperatorRoles,
  MODULE_NAME,
  OPERATOR_TYPE,
} from '@lidofinance/lido-csm-sdk';
import { config } from 'config';
import { PATH } from 'consts';
import { useOperatorCustomAddresses } from 'features/starter-pack/banner-operator-custom-addresses';
import { useDkgInFlowUpload } from 'features/idvtc/dkg/hooks/use-dkg-in-flow-upload';
import { TxStageDkgUploadFailed } from 'features/idvtc/dkg/tx-stages/tx-stage-dkg-upload-failed';
import { operatorKey } from 'modules/surveys-sdk';
import { useAppendOperator, useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useModuleOperatorTypeGetter } from 'shared/hooks';
import { useNavigate } from 'shared/navigate';
import { handleTxError, useTransitStage } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { renderCreateSuccess } from '../hooks/create-success-stage';
import { useConfirmCustomAddressesModal } from '../hooks/use-confirm-modal';
import { useTxModalStagesSubmitKeys } from '../hooks/use-tx-modal-stages-submit-keys';
import { useSubmitKeysFormData } from './submit-keys-data-provider';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';

export type SubmitKeysFlow =
  { action: 'cannot-submit' } | ({ action: 'submit-keys' } & Executable);

export const useSubmitKeysFlowResolver = (): FlowResolver<
  SubmitKeysFormInputType,
  SubmitKeysFormNetworkData,
  SubmitKeysFlow
> => {
  const sdk = useSmSDK(MODULE_NAME.CSM);
  const getOperatorType = useModuleOperatorTypeGetter();
  const appendNO = useAppendOperator();
  const [, setOperatorCustomAddresses] = useOperatorCustomAddresses();
  const n = useNavigate();
  const confirmCustomAddresses = useConfirmCustomAddressesModal();
  const buildCallback = useTxModalStagesSubmitKeys();
  const { ensureAuth, uploadStaged } = useDkgInFlowUpload();
  const transitStage = useTransitStage();

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

      // The node operator doesn't exist yet, so the DKG auth token (which needs
      // a signature, not gas) is obtained up-front in `confirm` — before the
      // tx — and threaded through to the post-tx upload in `submit`.
      let dkgAuthToken: string | undefined;

      return {
        action: 'submit-keys' as const,
        confirm: async () => {
          const okAddresses =
            !specifyCustomAddresses ||
            (await confirmCustomAddresses({
              managerAddress,
              rewardsAddress,
              extendedManagerPermissions,
            }));
          if (!okAddresses) return false;

          const files = input.dkgFiles ?? [];
          if (files.length > 0) {
            try {
              dkgAuthToken = await ensureAuth(files);
            } catch (error) {
              handleTxError(error);
              return false;
            }
          }
          return true;
        },
        submit: async () => {
          invariant(amount !== undefined, 'BondAmount is not defined');

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

          const type = getOperatorType(data.curveId);

          const { result } =
            type === OPERATOR_TYPE.CSM_ICS && data.proof
              ? await sdk.icsGate.addNodeOperator({
                  ...params,
                  proof: data.proof,
                })
              : type === OPERATOR_TYPE.CSM_IDVTC && data.proof
                ? await sdk.idvtcGate.addNodeOperator({
                    ...params,
                    proof: data.proof,
                  })
                : await sdk.permissionlessGate.addNodeOperator(params);

          // The node operator ID only exists now — run the deferred DKG
          // upload (the tx callback's `success` already switched to the
          // "uploading" stage) and render the final success/failed stage.
          const files = input.dkgFiles ?? [];
          if (result && files.length > 0) {
            const op = operatorKey(config.module, result.nodeOperatorId);
            const keys = depositData.map((k) => k.pubkey);
            const runUpload = async () => {
              invariant(op, 'operator key required for DKG upload');
              await uploadStaged(op, files, dkgAuthToken);
            };
            try {
              await runUpload();
              renderCreateSuccess(transitStage, result, data, keys);
            } catch (error) {
              transitStage(
                <TxStageDkgUploadFailed
                  nodeOperatorId={result.nodeOperatorId}
                  onRetry={() => {
                    void (async () => {
                      try {
                        await runUpload();
                        renderCreateSuccess(transitStage, result, data, keys);
                      } catch (e) {
                        handleTxError(e);
                      }
                    })();
                  }}
                />,
              );
            }
          }

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
      };
    },
    [
      sdk,
      getOperatorType,
      appendNO,
      setOperatorCustomAddresses,
      n,
      confirmCustomAddresses,
      buildCallback,
      ensureAuth,
      uploadStaged,
      transitStage,
    ],
  );
};

export const useSubmitKeysFlow = (): SubmitKeysFlow => {
  const resolve = useSubmitKeysFlowResolver();
  const data = useSubmitKeysFormData(true);
  return resolve({} as SubmitKeysFormInputType, data);
};
