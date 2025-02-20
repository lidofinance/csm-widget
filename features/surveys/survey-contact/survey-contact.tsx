import { FC } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormTitle, SectionBlock, Stack, WhenLoaded } from 'shared/components';
import {
  SubmitButtonHookForm,
  TextInputHookForm,
} from 'shared/hook-form/controls';
import { useDefaultValues } from 'shared/hooks';
import { useSurveysSWR } from '../shared/use-surveys-swr';

export type ContactData = {
  name?: string;
  discord?: string;
  telegram?: string;
  twitter?: string;
  allowShare: boolean;
};

export const SurveyContacts: FC = () => {
  const { data, mutate } = useSurveysSWR<ContactData>('contacts');

  const defaultValues = useDefaultValues(data);

  const formObject = useForm<ContactData>({
    defaultValues,
  });

  return (
    <SectionBlock title="Contact info">
      <FormProvider {...formObject}>
        <WhenLoaded loading={formObject.formState.isLoading}>
          <form autoComplete="off" onSubmit={formObject.handleSubmit(mutate)}>
            <Stack direction="column">
              <FormTitle>Name or pseudonym</FormTitle>
              <TextInputHookForm
                fieldName="name"
                label="Your name"
                rules={{ required: true }}
              />

              <FormTitle>Discord Handle</FormTitle>
              <TextInputHookForm fieldName="discord" label="Discord" />

              <FormTitle>Telegram Handle</FormTitle>
              <TextInputHookForm fieldName="telegram" label="Telegram" />

              <FormTitle>Twitter or Farcaster or both:</FormTitle>
              <TextInputHookForm
                fieldName="twitter"
                label="Social media account"
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
