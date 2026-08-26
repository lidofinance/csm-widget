import {
  getNodeOperatorRoles,
  type LidoSDKCsm,
  MODULE_NAME,
  OPERATOR_TYPE,
} from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts';
import { useOperatorCustomAddresses } from 'features/starter-pack/banner-operator-custom-addresses';
import { useDkgInFlowUpload } from 'features/idvtc/dkg/hooks/use-dkg-in-flow-upload';
import { TxStageDkgUploadFailed } from 'features/idvtc/dkg/tx-stages/tx-stage-dkg-upload-failed';
import { useMembersInFlowInit } from 'features/idvtc/members/hooks/use-members-in-flow-init';
import { TxStageMembersInitFailed } from 'features/idvtc/members/tx-stages/tx-stage-members-init-failed';
import { TxStageMembersSignin } from 'features/idvtc/members/tx-stages/tx-stage-members-signin';
import { keepsManageRole } from 'features/idvtc/members/utils/keeps-manage-role';
import { useSurveyInFlowAuth } from 'features/idvtc/shared/use-survey-in-flow-auth';
import { operatorKey } from 'modules/surveys-sdk';
import {
  type CsmFamilySDK,
  useAppendOperator,
  useSmSDKByModule,
} from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useModuleOperatorTypeGetter } from 'shared/hooks';
import { useNavigate } from 'shared/navigate';
import { handleTxError, useTransitStage } from 'shared/transaction-modal';
import invariant from 'tiny-invariant';
import { classifyErrorCode, ErrorCode } from 'utils/get-error-code';
import {
  trackMatomoRawError,
  trackMatomoSurveySigninDenied,
} from 'utils/track-matomo-event';
import { renderCreateSuccess } from '../hooks/create-success-stage';
import { useConfirmCustomAddressesModal } from '../hooks/use-confirm-modal';
import { useTxModalStagesSubmitKeys } from '../hooks/use-tx-modal-stages-submit-keys';
import { useSubmitKeysFormData } from './submit-keys-data-provider';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';
import { useTargetModule } from './use-target-module';

export type SubmitKeysFlow =
  { action: 'cannot-submit' } | ({ action: 'submit-keys' } & Executable);

export const useSubmitKeysFlowResolver = (): FlowResolver<
  SubmitKeysFormInputType,
  SubmitKeysFormNetworkData,
  SubmitKeysFlow
> => {
  const targetModule = useTargetModule();
  // useTargetModule narrows to CSM | CSM_02, but the overloads only discriminate
  // on literal module arguments.
  const sdk = useSmSDKByModule(targetModule) as CsmFamilySDK | undefined;
  // A curveId means a different operator type per module, so resolve against
  // the module being created.
  const getOperatorType = useModuleOperatorTypeGetter(targetModule);
  const appendNO = useAppendOperator(targetModule);
  const [, setOperatorCustomAddresses] = useOperatorCustomAddresses();
  const n = useNavigate();
  const confirmCustomAddresses = useConfirmCustomAddressesModal();
  const buildCallback = useTxModalStagesSubmitKeys();
  const surveyAuth = useSurveyInFlowAuth();
  const { ensureAuth, uploadStaged } = useDkgInFlowUpload(surveyAuth);
  const { checkBindable, initStaged } = useMembersInFlowInit(surveyAuth);
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
        dkgFiles = [],
      } = input;

      const type = getOperatorType(data.curveId);
      const isIdvtc = type === OPERATOR_TYPE.CSM_IDVTC;
      // Auto-init is possible only while the connected address keeps a
      // manager/rewards role on the new operator (survey API requirement).
      const mayInitMembers = isIdvtc && keepsManageRole(input, data.address);
      // Resolved in confirm() once the SIWE token exists; consumed in submit()
      let willInitMembers = false;

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

          if (dkgFiles.length > 0 || mayInitMembers) {
            try {
              if (dkgFiles.length > 0) {
                await ensureAuth(dkgFiles);
              } else {
                await surveyAuth.ensureAuth(<TxStageMembersSignin />);
              }
            } catch (error) {
              if (classifyErrorCode(error) === ErrorCode.DENIED_SIG) {
                trackMatomoSurveySigninDenied('create_idvtc');
              }
              // Staged DKG files must not be lost — abort. A declined sign-in
              // for auto-init alone must not block creating the operator.
              if (dkgFiles.length > 0) {
                handleTxError(error);
                return false;
              }
              return true;
            }
            if (mayInitMembers) {
              willInitMembers = await checkBindable();
            }
          }
          return true;
        },
        submit: async () => {
          invariant(amount !== undefined, 'BondAmount is not defined');

          const callback = buildCallback(input, { ...data, willInitMembers });

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

          const isCsm = targetModule === MODULE_NAME.CSM;
          const { result } =
            isCsm && type === OPERATOR_TYPE.CSM_ICS && data.proof
              ? await (sdk as LidoSDKCsm).icsGate.addNodeOperator({
                  ...params,
                  proof: data.proof,
                })
              : isCsm && type === OPERATOR_TYPE.CSM_IDVTC && data.proof
                ? await (sdk as LidoSDKCsm).idvtcGate.addNodeOperator({
                    ...params,
                    proof: data.proof,
                  })
                : await sdk.permissionlessGate.addNodeOperator(params);

          if (result && (dkgFiles.length > 0 || willInitMembers)) {
            const op = operatorKey(targetModule, result.nodeOperatorId);
            const keys = depositData.map((k) => k.pubkey);

            const runInit = async (): Promise<void> => {
              invariant(op, 'operator key required for members init');
              try {
                await initStaged(op);
                renderCreateSuccess(
                  transitStage,
                  result,
                  data,
                  keys,
                  targetModule,
                );
              } catch (error) {
                trackMatomoRawError('members_init', error);
                console.warn('[members] in-flow init failed', error);
                transitStage(
                  <TxStageMembersInitFailed
                    title="Node Operator created — cluster members not initialized"
                    onRetry={() => void runInit()}
                  />,
                );
              }
            };

            const runUpload = async (): Promise<void> => {
              invariant(op, 'operator key required for DKG upload');
              try {
                await uploadStaged(op, dkgFiles);
              } catch (error) {
                trackMatomoRawError('dkg_upload_create', error);
                transitStage(
                  <TxStageDkgUploadFailed
                    nodeOperatorId={result.nodeOperatorId}
                    onRetry={() => void runUpload()}
                  />,
                );
                return;
              }
              if (willInitMembers) {
                await runInit();
              } else {
                renderCreateSuccess(
                  transitStage,
                  result,
                  data,
                  keys,
                  targetModule,
                );
              }
            };

            if (dkgFiles.length > 0) {
              await runUpload();
            } else {
              await runInit();
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
      targetModule,
      getOperatorType,
      appendNO,
      setOperatorCustomAddresses,
      n,
      confirmCustomAddresses,
      buildCallback,
      surveyAuth,
      ensureAuth,
      uploadStaged,
      checkBindable,
      initStaged,
      transitStage,
    ],
  );
};

export const useSubmitKeysFlow = (): SubmitKeysFlow => {
  const resolve = useSubmitKeysFlowResolver();
  const data = useSubmitKeysFormData(true);
  return resolve({} as SubmitKeysFormInputType, data);
};
