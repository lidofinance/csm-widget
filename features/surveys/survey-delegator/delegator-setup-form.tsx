import { FC, useCallback, useMemo } from 'react';
import { trackMatomoFormEvent } from 'utils/track-matomo-event';
import { FormProvider, useForm } from 'react-hook-form';
import {
  FormTitle,
  Plural,
  SectionBlock,
  Stack,
  WhenLoaded,
} from 'shared/components';
import {
  CheckboxHookForm,
  NumberInputHookForm,
  SelectHookForm,
  SubmitButtonHookForm,
  TokenAmountInputHookForm,
} from 'shared/hook-form/controls';
import { isAuthError, parseOperatorKey } from 'modules/surveys-sdk';
import {
  CL_CLIENT_OPTIONS,
  COUNTRY_OPTIONS,
  DVT_OPTIONS,
  EL_CLIENT_OPTIONS,
  REMOTE_SIGNER_OPTIONS,
  SERVER_TYPE_OPTIONS,
  TOOL_OPTIONS,
  VALIDATOR_CLIENT_OPTIONS,
} from '../survey-setup/options';
import { useOperatorSetup } from '../survey-setup/use-operator-setup';
import { useSetupsKeys } from '../survey-setup/use-setups-keys';
import { useModalStages } from '../survey-setup/use-modal-stages';
import { useConfirmRemoveModal } from '../survey-setup/confirm-remove-modal';
import { useNavigate } from 'shared/navigate';
import { PATH } from 'consts/urls';
import { SurveyButton } from '../components';
import { Button } from '@lidofinance/lido-ui';
import { Setup } from '../types';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { DelegatorBackButton } from './back-button';

const required = { required: true };

type DelegatorSetupFormProps = {
  operatorId: string;
  setupId?: string;
};

export const DelegatorSetupForm: FC<DelegatorSetupFormProps> = ({
  operatorId,
  setupId,
}) => {
  const isEditMode = !!setupId && setupId !== 'new';
  const operatorKey = parseOperatorKey(operatorId) ?? undefined;
  const index = isEditMode ? Number(setupId) : undefined;

  const {
    data: filled,
    error,
    mutate,
    remove,
  } = useOperatorSetup(index, { operatorKey, invalidateOnMutate: true });

  const data = useMemo(
    () => (isEditMode ? filled : undefined),
    [isEditMode, filled],
  );

  const { data: keys, mutate: mutateKeys } = useSetupsKeys(operatorKey);

  const filledWitoutCurrent = Math.max(
    0,
    (keys?.filled ?? 0) - (data?.keysCount ?? 0),
  );
  const keysLeft = Math.max(0, (keys?.total ?? 0) - filledWitoutCurrent);

  const maxKeys = Math.max(keysLeft, data?.keysCount ?? 0);

  const { txModalStages: modals } = useModalStages();
  const confirmRemove = useConfirmRemoveModal();
  const navigate = useNavigate();

  const formObject = useForm<Setup>({
    values: isEditMode ? data : undefined,
    defaultValues: {
      validatorSameAsCl: true,
    },
  });

  const validatorSameAsCl = formObject.watch('validatorSameAsCl');
  const keysCount = formObject.watch('keysCount');
  const keysRemain = Math.max(0, keysLeft - (keysCount ?? 0));

  const handleSubmit = useCallback(
    async (data: Setup) => {
      trackMatomoFormEvent('surveyDelegatorSetup');
      modals.pending();
      try {
        const res = await mutate(data);
        void mutateKeys();
        if (!isEditMode && res?.index) {
          void navigate(
            `${PATH.SURVEYS_DELEGATOR}/${operatorId}/${res.index}` as PATH,
          );
        }
        trackMatomoFormEvent('surveyDelegatorSetup', 'success');
        modals.success();
      } catch (e) {
        if (!isAuthError(e)) modals.failed(e);
      }
    },
    [modals, mutate, mutateKeys, isEditMode, navigate, operatorId],
  );

  const handleRemove = useCallback(async () => {
    if (await confirmRemove({})) {
      modals.pendingRemove();
      try {
        await remove();
        void mutateKeys();
        void navigate(`${PATH.SURVEYS_DELEGATOR}/${operatorId}` as PATH);
        modals.successRemove();
      } catch (e) {
        if (!isAuthError(e)) modals.failed(e);
      }
    }
  }, [confirmRemove, modals, mutateKeys, navigate, remove, operatorId]);

  const onKeysClick = useCallback(() => {
    formObject.setValue('keysCount', keysLeft);
  }, [formObject, keysLeft]);

  return (
    <SectionBlock
      title={isEditMode ? `Setup #${data?.index}` : 'Add Setup'}
      mainPrefix={<DelegatorBackButton operatorId={operatorId} />}
    >
      <FormProvider {...formObject}>
        <WhenLoaded loading={formObject.formState.isLoading} error={error}>
          <Stack direction="column">
            <form
              autoComplete="off"
              onSubmit={formObject.handleSubmit(handleSubmit)}
            >
              <Stack direction="column" gap="xxl">
                <Stack direction="column">
                  <FormTitle>Number of keys in this setup</FormTitle>
                  <NumberInputHookForm
                    fieldName="keysCount"
                    label="Number of keys"
                    rules={{
                      ...required,
                      min: { value: 1, message: 'Minimum keys amount is 1' },
                      max: {
                        value: maxKeys,
                        message: `Maximum keys amount is ${maxKeys}`,
                      },
                    }}
                    rightDecorator={
                      keys && (
                        <Button
                          size="xs"
                          variant="translucent"
                          onClick={onKeysClick}
                        >
                          {keysRemain}{' '}
                          <Plural
                            value={keysRemain}
                            variants={['key', 'keys']}
                          />{' '}
                          left
                        </Button>
                      )
                    }
                  />
                </Stack>

                <Stack direction="column">
                  <FormTitle>
                    Are you using Distributed Validator Technology to run these
                    validators?
                  </FormTitle>
                  <SelectHookForm
                    fieldName="dvt"
                    options={DVT_OPTIONS}
                    rules={required}
                  />
                </Stack>

                <Stack direction="column">
                  <FormTitle>
                    Which tool do you use to run your nodes/keys?
                  </FormTitle>
                  <SelectHookForm
                    fieldName="installationTool"
                    options={TOOL_OPTIONS}
                    rules={required}
                  />
                </Stack>

                <Stack direction="column">
                  <FormTitle>
                    Which Execution Layer Client are you running?
                  </FormTitle>
                  <SelectHookForm
                    fieldName="elClient"
                    options={EL_CLIENT_OPTIONS}
                    rules={required}
                  />
                </Stack>

                <Stack direction="column">
                  <FormTitle>
                    Which Consensus Layer Client are you running?
                  </FormTitle>
                  <SelectHookForm
                    fieldName="clClient"
                    options={CL_CLIENT_OPTIONS}
                    rules={required}
                  />
                </Stack>

                <Stack direction="column">
                  <FormTitle>
                    What type of servers are your EL and CL nodes running on?
                  </FormTitle>
                  <SelectHookForm
                    fieldName="clientsServerType"
                    options={SERVER_TYPE_OPTIONS}
                    rules={required}
                  />
                </Stack>

                <Stack direction="column">
                  <FormTitle>
                    Which country are your EL and CL nodes in?
                  </FormTitle>
                  <SelectHookForm
                    fieldName="clientsCountry"
                    options={COUNTRY_OPTIONS}
                  />
                </Stack>

                <Stack direction="column">
                  <FormTitle>Which Validator Client are you running?</FormTitle>
                  <CheckboxHookForm
                    fieldName="validatorSameAsCl"
                    label="My Consensus Layer Client and Validator Client are the same"
                  />
                  {!validatorSameAsCl && (
                    <SelectHookForm
                      fieldName="validatorClient"
                      options={VALIDATOR_CLIENT_OPTIONS}
                      rules={required}
                    />
                  )}
                </Stack>

                {!validatorSameAsCl && (
                  <Stack direction="column">
                    <FormTitle>
                      What type of servers are your Validator Clients running
                      on?
                    </FormTitle>
                    <SelectHookForm
                      fieldName="validatorServerType"
                      options={SERVER_TYPE_OPTIONS}
                      rules={required}
                    />
                  </Stack>
                )}

                {!validatorSameAsCl && (
                  <Stack direction="column">
                    <FormTitle>
                      Which country are your Validator Clients in?
                    </FormTitle>
                    <SelectHookForm
                      fieldName="validatorCountry"
                      options={COUNTRY_OPTIONS}
                    />
                  </Stack>
                )}

                <Stack direction="column">
                  <FormTitle>
                    Do you use a remote signer for your validator keys?
                  </FormTitle>
                  <SelectHookForm
                    fieldName="remoteSigner"
                    options={REMOTE_SIGNER_OPTIONS}
                    rules={required}
                  />
                </Stack>

                <Stack direction="column">
                  <FormTitle>What is your MEV-boost min-bid value?</FormTitle>
                  <TokenAmountInputHookForm
                    fieldName="mevMinBidWei"
                    label="Min bid"
                    token={TOKENS.eth}
                  />
                </Stack>
                <SubmitButtonHookForm>Submit</SubmitButtonHookForm>
              </Stack>
            </form>
            {!!data && (
              <SurveyButton
                title="Delete"
                fullwidth
                color="error"
                onClick={handleRemove}
              />
            )}
          </Stack>
        </WhenLoaded>
      </FormProvider>
    </SectionBlock>
  );
};
