import { FC, useCallback, useMemo } from 'react';
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
import { transformIncoming, transformOutcoming } from './transform';
import { useModalStages } from './use-modal-stages';
import { useConfirmRemoveModal } from './confirm-remove-modal';
import { useNavigate } from 'shared/navigate';
import { PATH } from 'consts/urls';
import { SurveyButton } from '../components';
import { Button } from '@lidofinance/lido-ui';
import { Setup, SetupRaw, SetupsKeys } from '../types';

const required = { required: true };

export const SurveySetup: FC<{ id?: string }> = ({ id }) => {
  const {
    data: filled,
    error,
    mutate,
    remove,
  } = useSurveysSWR<Setup, SetupRaw>(`setups${id ? '/' + id : ''}`, {
    skipFetching: !id,
    transformIncoming,
    transformOutcoming,
  });

  const data = useMemo(() => (id ? filled : undefined), [id, filled]);

  const { data: keys, mutate: mutateKeys } =
    useSurveysSWR<SetupsKeys>('setups/keys');

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
    values: id ? data : undefined,
    defaultValues: {
      validatorSameAsCl: true,
    },
  });

  const validatorSameAsCl = formObject.watch('validatorSameAsCl');
  const keysCount = formObject.watch('keysCount');
  const keysRemain = Math.max(0, keysLeft - (keysCount ?? 0));

  const handleSubmit = useCallback(
    async (data: Setup) => {
      modals.pending();
      try {
        await mutate(data);
        void mutateKeys();
        void navigate(PATH.SURVEYS);
        modals.success();
      } catch (e) {
        modals.failed(e);
      }
    },
    [modals, mutate, mutateKeys, navigate],
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
                    fieldName="mevMinBid"
                    label="Min bid"
                    token="ETH"
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
