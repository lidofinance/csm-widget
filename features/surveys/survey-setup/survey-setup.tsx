import { FC, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormTitle, SectionBlock, Stack, WhenLoaded } from 'shared/components';
import {
  CheckboxHookForm,
  NumberInputHookForm,
  SelectHookForm,
  SubmitButtonHookForm,
  TokenAmountInputHookForm,
} from 'shared/hook-form/controls';
import { useSurveysSWR } from '../shared/use-surveys-swr';
import {
  CL_CLIENT_OPTIONS,
  COUNTRY_OPTIONS,
  DVT_OPTIONS,
  EL_CLIENT_OPTIONS,
  REMOTE_SIGNER_OPTIONS,
  SERVER_TYPE_OPTIONS,
  TOOL_OPTIONS,
  VALIDATOR_CLIENT_OPTIONS,
} from './options';
import {
  SetupRawData,
  transformFromRaw,
  SetupData,
  transformToRaw,
} from './data';
import { useModalStages } from './use-modal-stages';
import { useConfirmRemoveModal } from './confirm-remove-modal';
import { useNavigate } from 'shared/navigate';
import { PATH } from 'consts/urls';
import { SurveyButton } from '../components';

const required = { required: true };

export const SurveySetup: FC<{ id?: string }> = ({ id }) => {
  const { data, error, mutate, remove } = useSurveysSWR<
    SetupData,
    SetupRawData
  >(`setups${id ? '/' + id : ''}`, {
    skipFetching: !id,
    transformIncoming: transformFromRaw,
    transformOutcoming: transformToRaw,
  });

  const { txModalStages: modals } = useModalStages();
  const confirmRemove = useConfirmRemoveModal();
  const navigate = useNavigate();

  const formObject = useForm<SetupData>({
    values: id ? data : undefined,
    defaultValues: {
      clAsValidator: false,
    },
  });

  const clAsValidator = formObject.watch('clAsValidator');

  const handleSubmit = useCallback(
    async (data: SetupData) => {
      modals.pending();
      const res = await mutate(data);
      if (!id && res?.id) {
        void navigate(`${PATH.SURVEYS_SETUP}/${res.id}` as PATH);
      }
      modals.success();
    },
    [modals, mutate, navigate, id],
  );

  const handleRemove = useCallback(async () => {
    if (await confirmRemove({})) {
      modals.pendingRemove();
      await remove();
      void navigate(PATH.SURVEYS);
      modals.successRemove();
    }
  }, [confirmRemove, modals, navigate, remove]);

  return (
    <SectionBlock title={id ? `Setup #${id}` : 'Add Setup'}>
      <FormProvider {...formObject}>
        <WhenLoaded loading={formObject.formState.isLoading} error={error}>
          <Stack direction="column">
            <form
              autoComplete="off"
              onSubmit={formObject.handleSubmit(handleSubmit)}
            >
              <Stack direction="column">
                <FormTitle>Number of keys in this setup</FormTitle>
                <NumberInputHookForm
                  fieldName="keysCount"
                  label="Number"
                  rules={required}
                />

                <FormTitle>
                  Are you using Distributed Validator Technology to run these
                  validators?
                </FormTitle>
                <SelectHookForm
                  fieldName="dvt"
                  options={DVT_OPTIONS}
                  rules={required}
                />

                <FormTitle>
                  Which tool do you use to run your nodes/keys?
                </FormTitle>
                <SelectHookForm
                  fieldName="installationTool"
                  options={TOOL_OPTIONS}
                  rules={required}
                />

                <FormTitle>
                  Which Execution Layer Client are you running?
                </FormTitle>
                <SelectHookForm
                  fieldName="elClient"
                  options={EL_CLIENT_OPTIONS}
                  rules={required}
                />

                <FormTitle>
                  Which Consensus Layer Client are you running?
                </FormTitle>
                <SelectHookForm
                  fieldName="clClient"
                  options={CL_CLIENT_OPTIONS}
                  rules={required}
                />

                <FormTitle>
                  What type of servers are your EL and CL nodes running on?
                </FormTitle>
                <SelectHookForm
                  fieldName="clinetsServerType"
                  options={SERVER_TYPE_OPTIONS}
                  rules={required}
                />

                <FormTitle>
                  Which country are your EL and CL nodes in?
                </FormTitle>
                <SelectHookForm
                  fieldName="clientsCountry"
                  options={COUNTRY_OPTIONS}
                  rules={required}
                />

                <FormTitle>Which Validator Client are you running?</FormTitle>
                <CheckboxHookForm
                  fieldName="clAsValidator"
                  label="My Consensus Layer Client and Validator Client are the same"
                />
                {!clAsValidator && (
                  <>
                    <SelectHookForm
                      fieldName="validatorClient"
                      options={VALIDATOR_CLIENT_OPTIONS}
                      rules={required}
                    />

                    <FormTitle>
                      What type of servers are your Validator Clients running
                      on?
                    </FormTitle>
                    <SelectHookForm
                      fieldName="validatorServerType"
                      options={SERVER_TYPE_OPTIONS}
                      rules={required}
                    />

                    <FormTitle>
                      Which country are your Validator Clients in?
                    </FormTitle>
                    <SelectHookForm
                      fieldName="validatorCountry"
                      options={COUNTRY_OPTIONS}
                      rules={required}
                    />
                  </>
                )}

                <FormTitle>
                  Do you use a remote signer for your validator keys?
                </FormTitle>
                <SelectHookForm
                  fieldName="remoteSigner"
                  options={REMOTE_SIGNER_OPTIONS}
                  rules={required}
                />

                <FormTitle>What is your MEV-boost min-bid value?</FormTitle>
                <TokenAmountInputHookForm
                  fieldName="mevMinBid"
                  label="Min bid"
                  token="ETH"
                  rules={required}
                />

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
