import { FC, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormTitle, SectionBlock, Stack, WhenLoaded } from 'shared/components';
import {
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
  REMOTE_SIGNER_OPTINS,
  SERVER_TYPE_OPTIONS,
  TOOL_OPTIONS,
  VALIDATOR_CLIENT_OPTIONS,
} from './consts';
import { useDefaultValues } from 'shared/hooks';
import {
  SetupRawData,
  transformFromRaw,
  SetupData,
  transformToRaw,
} from './data';

const required = { required: true };

export const SurveySetup: FC<{ id?: string }> = ({ id }) => {
  const { data, error, mutate } = useSurveysSWR<SetupRawData>(
    `setups${id ? '/' + id : ''}`,
  );

  const asyncDefaultValues = useDefaultValues(transformFromRaw(data));
  const formObject = useForm<SetupData>({
    defaultValues: id
      ? asyncDefaultValues
      : {
          clAsValidator: false,
        },
  });

  const doSubmit = useCallback(
    (data: SetupData) => mutate(transformToRaw(data)),
    [mutate],
  );

  return (
    <SectionBlock title={id ? `Setup #${id}` : 'Add Setup'}>
      <FormProvider {...formObject}>
        <WhenLoaded loading={formObject.formState.isLoading} error={error}>
          <form autoComplete="off" onSubmit={formObject.handleSubmit(doSubmit)}>
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

              <FormTitle>Which country are your EL and CL nodes in?</FormTitle>
              <SelectHookForm
                fieldName="clientsCountry"
                options={COUNTRY_OPTIONS}
                rules={required}
              />

              <FormTitle>Which Validator Client are you running?</FormTitle>
              {/* My Consensus Layer and Validator Client are the same */}
              {/* clAsValidator */}
              <SelectHookForm
                fieldName="validatorClient"
                options={VALIDATOR_CLIENT_OPTIONS}
                rules={required}
              />

              <FormTitle>
                What type of servers are your Validator Clients running on?
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

              <FormTitle>
                Do you use a remote signer for your validator keys?
              </FormTitle>
              <SelectHookForm
                fieldName="remoteSigner"
                options={REMOTE_SIGNER_OPTINS}
                rules={required}
              />

              <FormTitle>What is your MEV-boost min-bid value?</FormTitle>
              <TokenAmountInputHookForm
                fieldName="mevMinBid"
                label="Min bid"
                token="ETH"
                rules={required}
              />

              <SubmitButtonHookForm>
                {formObject.formState.isSubmitted ? 'Submitted' : 'Submit'}
              </SubmitButtonHookForm>
            </Stack>
          </form>
        </WhenLoaded>
      </FormProvider>
    </SectionBlock>
  );
};
