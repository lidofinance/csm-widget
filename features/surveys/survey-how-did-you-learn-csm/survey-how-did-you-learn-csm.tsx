import { FC, useCallback, useEffect } from 'react';
import { trackMatomoFormEvent } from 'utils/track-matomo-event';
import { FormProvider, useForm } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { FormCard, FormPage, SubmitButton } from 'shared/form-page';
import { SelectField, TextField } from 'shared/hook-form/fields';
import { Stack } from '@lidofinance/lido-app-ui';
import {
  callSurvey,
  isAuthError,
  surveyRequest,
  useOperatorSurvey,
} from 'modules/surveys-sdk';
import {
  howDidYouLearnCsmFindOne,
  howDidYouLearnCsmUpdate,
} from 'modules/surveys-sdk/generated';
import { HowDidYouLearnCsm } from '../types';
import { useModalStages } from './use-modal-stages';
import { sources } from './sources';
import { transformOutgoing } from './transform';

export const SurveyHowDidYouLearnCsm: FC = () => {
  const { data, mutate } = useOperatorSurvey<HowDidYouLearnCsm>(
    'how-did-you-learn-csm',
    {
      transformOutgoing,
      get: ({ nodeOperatorId, token, signal }) =>
        callSurvey(() =>
          howDidYouLearnCsmFindOne({
            ...surveyRequest(token, signal),
            path: { nodeOperatorId },
          }),
        ),
      update: (body, { nodeOperatorId, token }) =>
        callSurvey(() =>
          howDidYouLearnCsmUpdate({
            ...surveyRequest(token),
            path: { nodeOperatorId },
            body,
          }),
        ),
    },
  );
  const { txModalStages: modals } = useModalStages();

  const formObject = useForm<HowDidYouLearnCsm>({
    values: data,
  });

  const handleSubmit = useCallback(
    async (data: HowDidYouLearnCsm) => {
      trackMatomoFormEvent('surveyLearnCsm');
      modals.pending();
      try {
        await mutate(data);
        trackMatomoFormEvent('surveyLearnCsm', 'success');
        modals.success();
      } catch (e) {
        if (!isAuthError(e)) modals.failed(e);
      }
    },
    [modals, mutate],
  );

  const [sourceOne, sourceTwo] = formObject.watch(['sourceOne', 'sourceTwo']);
  const selected1 = sources.find((s) => s.value === sourceOne);
  const selected2 = selected1?.options?.find((s) => s.value === sourceTwo);

  useEffect(() => {
    formObject.resetField('sourceTwo', { defaultValue: '' });
  }, [formObject, sourceOne]);

  useEffect(() => {
    formObject.resetField('other', { defaultValue: '' });
  }, [formObject, sourceOne, sourceTwo]);

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
                <SelectField
                  name="sourceOne"
                  label="What led you to CSM?"
                  options={sources.map((s) => ({
                    value: s.value,
                    label: s.label,
                  }))}
                  required
                />
                {selected1?.options && (
                  <SelectField
                    name="sourceTwo"
                    label={selected1.subTitle}
                    options={selected1.options.map((s) => ({
                      value: s.value,
                      label: s.label,
                    }))}
                    required
                  />
                )}
                {(selected1?.otherTitle || selected2?.otherTitle) && (
                  <TextField
                    name="other"
                    label={selected1?.otherTitle || selected2?.otherTitle}
                    required
                  />
                )}
                <SubmitButton>Submit</SubmitButton>
              </Stack>
            </form>
          </FormCard>
        </FormPage>
      </WhenLoaded>
    </FormProvider>
  );
};
