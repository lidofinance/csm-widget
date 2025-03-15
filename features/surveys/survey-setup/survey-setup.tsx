import { FC, useCallback } from 'react';
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
  SetupsKeys,
} from './data';
import { useModalStages } from './use-modal-stages';
import { useConfirmRemoveModal } from './confirm-remove-modal';
import { useNavigate } from 'shared/navigate';
import { PATH } from 'consts/urls';
import { SurveyButton } from '../components';
import { Button } from '@lidofinance/lido-ui';

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

  const { data: keys, mutate: mutateKeys } =
    useSurveysSWR<SetupsKeys>('setups/keys');
  const keysLeft = (keys?.left ?? 0) + ((!!id && data?.keysCount) || 0);

  const { txModalStages: modals } = useModalStages();
  const confirmRemove = useConfirmRemoveModal();
  const navigate = useNavigate();

  const formObject = useForm<SetupData>({
    values: id ? data : undefined,
    defaultValues: {
      validatorSameAsCl: true,
    },
  });

  const validatorSameAsCl = formObject.watch('validatorSameAsCl');
  const keysCount = formObject.watch('keysCount');
  const keysRemain = Math.max(0, keysLeft - (keysCount ?? 0));

  const handleSubmit = useCallback(
    async (data: SetupData) => {
      modals.pending();
      try {
        const res = await mutate(data);
        void mutateKeys();
        if (!id && res?.index) {
          void navigate(`${PATH.SURVEYS_SETUP}/${res.index}` as PATH);
        }
        modals.success();
      } catch (e) {
        modals.failed(e);
      }
    },
    [modals, mutate, id, mutateKeys, navigate],
  );

  const handleRemove = useCallback(async () => {
    if (await confirmRemove({})) {
      modals.pendingRemove();
      try {
        await remove();
        void mutateKeys();
        void navigate(PATH.SURVEYS);
        modals.successRemove();
      } catch (e) {
        modals.failed(e);
      }
    }
  }, [confirmRemove, modals, mutateKeys, navigate, remove]);

  const onKeysClick = useCallback(() => {
    formObject.setValue('keysCount', keysLeft);
  }, [formObject, keysLeft]);

  return (
    <SectionBlock title={id ? `Setup #${data?.index}` : 'Add Setup'}>
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
                    label="Number"
                    rules={{ ...required, min: 1 }}
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
                    fieldName="clinetsServerType"
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
                    rules={required}
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
                      rules={required}
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
                    fieldName="mevMinBid"
                    label="Min bid"
                    token="ETH"
                    rules={required}
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
