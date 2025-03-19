import { FC, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormTitle, SectionBlock, Stack, WhenLoaded } from 'shared/components';
import {
  NumberInputHookForm,
  OptionsButtonsHookForm,
  SubmitButtonHookForm,
  TextInputHookForm,
} from 'shared/hook-form/controls';
import { useSurveysSWR } from '../shared/use-surveys-swr';
import { Experience } from '../types';
import {
  ExperienceForm,
  transformIncoming,
  transformOutcoming,
} from './transform';
import { useModalStages } from './use-modal-stages';

export const SurveyExperience: FC = () => {
  const { data, mutate } = useSurveysSWR<ExperienceForm, Experience>(
    'experience',
    {
      transformIncoming,
      transformOutcoming,
    },
  );
  const { txModalStages: modals } = useModalStages();

  const formObject = useForm<ExperienceForm>({
    values: data,
  });

  const otherModules = formObject.watch('otherModules');

  const handleSubmit = useCallback(
    async (data: ExperienceForm) => {
      modals.pending();
      try {
        await mutate(data);
        modals.success();
      } catch (e) {
        modals.failed(e);
      }
    },
    [modals, mutate],
  );

  return (
    <SectionBlock title="Your validation experience">
      <FormProvider {...formObject}>
        <WhenLoaded loading={formObject.formState.isLoading}>
          <Stack direction="column">
            <form
              autoComplete="off"
              onSubmit={formObject.handleSubmit(handleSubmit)}
            >
              <Stack direction="column" gap="xxl">
                <Stack direction="column">
                  <FormTitle>
                    Are you a professional node operator or an independent
                    staker?
                  </FormTitle>
                  <OptionsButtonsHookForm
                    fieldName="professional"
                    options={{
                      on: 'Professional operator',
                      off: 'Independent staker',
                    }}
                    rules={{ required: true }}
                  />
                </Stack>

                <Stack direction="column">
                  <FormTitle>
                    Have you ever validated on Ethereum Mainnet before joining
                    CSM?
                  </FormTitle>
                  <OptionsButtonsHookForm
                    fieldName="validatedBefore"
                    options={{ on: 'Yes', off: 'No' }}
                    rules={{ required: true }}
                  />
                </Stack>

                <Stack direction="column">
                  <FormTitle>
                    Are you an organization from the Curated Module or the
                    Simple DVT Module in Lido?
                  </FormTitle>
                  <OptionsButtonsHookForm
                    fieldName="otherModules"
                    options={{ on: 'Yes', off: 'No' }}
                    rules={{ required: true }}
                  />
                </Stack>

                {otherModules === 'on' && (
                  <Stack direction="column">
                    <FormTitle>
                      Which module you are participating in?
                    </FormTitle>
                    <OptionsButtonsHookForm
                      fieldName="modules"
                      options={{
                        curated: 'Curated',
                        sdvt: 'Simple DVT',
                        both: 'Both',
                      }}
                      rules={{ required: true }}
                    />
                  </Stack>
                )}

                {otherModules === 'on' && (
                  <Stack direction="column">
                    <FormTitle>
                      What is the name of your organization in the other Lido
                      modules?
                    </FormTitle>
                    <TextInputHookForm
                      fieldName="nameInModules"
                      label="Name of your organisation"
                      rules={{ required: true }}
                    />
                  </Stack>
                )}

                <Stack direction="column">
                  <FormTitle>
                    How many other mainnet validators do you run outside of Lido
                    CSM?
                  </FormTitle>
                  <NumberInputHookForm
                    fieldName="otherValidatorsCount"
                    label="Keys number"
                  />
                </Stack>

                <SubmitButtonHookForm>Submit</SubmitButtonHookForm>
              </Stack>
            </form>
          </Stack>
        </WhenLoaded>
      </FormProvider>
    </SectionBlock>
  );
};
