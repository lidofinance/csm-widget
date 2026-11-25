import { FC, useCallback } from 'react';
import { trackMatomoFormEvent } from 'utils/track-matomo-event';
import { FormProvider, useForm } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { FormCard, FormPage, SubmitButton } from 'shared/form-page';
import {
  NumberField,
  SegmentCardsField,
  TextField,
} from 'shared/hook-form/fields';
import { Field, Stack } from '@lidofinance/lido-app-ui';
import {
  callSurvey,
  isAuthError,
  surveyRequest,
  useOperatorSurvey,
} from 'modules/surveys-sdk';
import {
  experienceFindOne,
  experienceUpdate,
} from 'modules/surveys-sdk/generated';
import { Experience } from '../types';
import {
  ExperienceForm,
  transformIncoming,
  transformOutgoing,
} from './transform';
import { useModalStages } from './use-modal-stages';

const YES_NO_OPTIONS = [
  { value: 'on', title: 'Yes' },
  { value: 'off', title: 'No' },
];

const MODULE_OPTIONS = [
  { value: 'curated', title: 'Curated' },
  { value: 'sdvt', title: 'Simple DVT' },
  { value: 'both', title: 'Both' },
];

export const SurveyExperience: FC = () => {
  const { data, mutate } = useOperatorSurvey<ExperienceForm, Experience>(
    'experience',
    {
      transformIncoming,
      transformOutgoing,
      get: ({ nodeOperatorId, token, signal }) =>
        callSurvey(() =>
          experienceFindOne({
            ...surveyRequest(token, signal),
            path: { nodeOperatorId },
          }),
        ),
      update: (body, { nodeOperatorId, token }) =>
        callSurvey(() =>
          experienceUpdate({
            ...surveyRequest(token),
            path: { nodeOperatorId },
            body,
          }),
        ),
    },
  );
  const { txModalStages: modals } = useModalStages();

  const formObject = useForm<ExperienceForm>({
    values: data,
  });

  const otherModules = formObject.watch('otherModules');

  const handleSubmit = useCallback(
    async (data: ExperienceForm) => {
      trackMatomoFormEvent('surveyExperience');
      modals.pending();
      try {
        await mutate(data);
        trackMatomoFormEvent('surveyExperience', 'success');
        modals.success();
      } catch (e) {
        if (!isAuthError(e)) modals.failed(e);
      }
    },
    [modals, mutate],
  );

  return (
    <FormProvider {...formObject}>
      <WhenLoaded loading={formObject.formState.isLoading}>
        <FormPage>
          <FormCard>
            <form
              autoComplete="off"
              onSubmit={formObject.handleSubmit(handleSubmit)}
            >
              <Stack gap={32}>
                <Field
                  id="professional"
                  label="Are you a professional node operator or an independent staker?"
                  group
                >
                  <SegmentCardsField
                    name="professional"
                    aria-label="Professional operator or independent staker"
                    required
                    options={[
                      { value: 'on', title: 'Professional operator' },
                      { value: 'off', title: 'Independent staker' },
                    ]}
                  />
                </Field>
                <Field
                  id="validatedBefore"
                  label="Have you ever validated on Ethereum Mainnet before joining CSM?"
                  group
                >
                  <SegmentCardsField
                    name="validatedBefore"
                    aria-label="Validated on Ethereum Mainnet before"
                    required
                    options={YES_NO_OPTIONS}
                  />
                </Field>
                <Field
                  id="otherModules"
                  label="Are you an organization from the Curated Module or the Simple DVT Module in Lido?"
                  group
                >
                  <SegmentCardsField
                    name="otherModules"
                    aria-label="Organization from other Lido modules"
                    required
                    options={YES_NO_OPTIONS}
                  />
                </Field>
                {otherModules === 'on' && (
                  <Field
                    id="modules"
                    label="Which module you are participating in?"
                    group
                  >
                    <SegmentCardsField
                      name="modules"
                      aria-label="Participating module"
                      required
                      options={MODULE_OPTIONS}
                    />
                  </Field>
                )}
                {otherModules === 'on' && (
                  <TextField
                    name="nameInModules"
                    label="What is the name of your organization in the other Lido modules?"
                    placeholder="Name of your organisation"
                    required
                  />
                )}
                <NumberField
                  name="otherValidatorsCount"
                  label="How many other Mainnet validators do you run outside of Lido CSM?"
                  placeholder="Keys number"
                  min={0}
                  minMessage="Minimum keys amount is 0"
                  max={999999999}
                  maxMessage="Maximum keys amount is 999 999 999"
                />
                <SubmitButton>Submit</SubmitButton>
              </Stack>
            </form>
          </FormCard>
        </FormPage>
      </WhenLoaded>
    </FormProvider>
  );
};
