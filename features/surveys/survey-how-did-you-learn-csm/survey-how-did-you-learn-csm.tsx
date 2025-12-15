import { FC, useCallback, useEffect } from 'react';
import { trackMatomoFormEvent } from 'utils/track-matomo-event';
import { FormProvider, useForm } from 'react-hook-form';
import { FormTitle, SectionBlock, Stack, WhenLoaded } from 'shared/components';
import {
  SelectHookForm,
  SubmitButtonHookForm,
  TextInputHookForm,
} from 'shared/hook-form/controls';
import { useSurveysSWR } from '../shared/use-surveys-swr';
import { HowDidYouLearnCsm } from '../types';
import { useModalStages } from './use-modal-stages';
import { sources } from './sources';
import { transformOutcoming } from './transform';

export const SurveyHowDidYouLearnCsm: FC = () => {
  const { data, mutate } = useSurveysSWR<HowDidYouLearnCsm>(
    'how-did-you-learn-csm',
    { transformOutcoming },
  );
  const { txModalStages: modals } = useModalStages();

  const formObject = useForm<HowDidYouLearnCsm>({
    values: data,
  });

  const handleSubmit = useCallback(
    async (data: HowDidYouLearnCsm) => {
      trackMatomoFormEvent('survey-learn-csm', 'prepare');
      modals.pending();
      try {
        await mutate(data);
        trackMatomoFormEvent('survey-learn-csm', 'done');
        modals.success();
      } catch (e) {
        modals.failed(e);
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
    <SectionBlock title="How did you learn about CSM?">
      <FormProvider {...formObject}>
        <WhenLoaded loading={formObject.formState.isLoading}>
          <Stack direction="column">
            <form
              autoComplete="off"
              onSubmit={formObject.handleSubmit(handleSubmit)}
            >
              <Stack direction="column" gap="xxl">
                <Stack direction="column">
                  <FormTitle>What led you to CSM?</FormTitle>
                  <SelectHookForm
                    fieldName="sourceOne"
                    options={sources.map((s) => ({
                      value: s.value,
                      label: s.label,
                    }))}
                    rules={{ required: true }}
                  />
                </Stack>

                {selected1?.options && (
                  <Stack direction="column">
                    <FormTitle>{selected1?.subTitle}</FormTitle>
                    <SelectHookForm
                      fieldName="sourceTwo"
                      options={selected1?.options?.map((s) => ({
                        value: s.value,
                        label: s.label,
                      }))}
                      rules={{ required: true }}
                    />
                  </Stack>
                )}

                {(selected1?.otherTitle || selected2?.otherTitle) && (
                  <Stack direction="column">
                    <FormTitle>
                      {selected1?.otherTitle || selected2?.otherTitle}
                    </FormTitle>
                    <TextInputHookForm
                      fieldName="other"
                      label=""
                      rules={{ required: true }}
                    />
                  </Stack>
                )}

                <SubmitButtonHookForm>Submit</SubmitButtonHookForm>
              </Stack>
            </form>
          </Stack>
        </WhenLoaded>
      </FormProvider>
    </SectionBlock>
  );
};
