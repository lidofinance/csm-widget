import { PATH } from 'consts/urls';
import { FC, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormTitle, SectionBlock, Stack, WhenLoaded } from 'shared/components';
import {
  SubmitButtonHookForm,
  TextInputHookForm,
} from 'shared/hook-form/controls';
import { useNavigate } from 'shared/navigate';
import { SurveyButton } from '../components';
import { useSurveysSWR } from '../shared/use-surveys-swr';
import { useConfirmRemoveModal } from './confirm-remove-modal';
import { useModalStages } from './use-modal-stages';

export type ContactData = {
  name?: string;
  discord?: string;
  telegram?: string;
  twitter?: string;
  allowShare: boolean;
};

export const SurveyContacts: FC = () => {
  const { data, mutate, remove } = useSurveysSWR<ContactData>('contacts');
  const { txModalStages: modals } = useModalStages();
  const confirmRemove = useConfirmRemoveModal();
  const navigate = useNavigate();

  const formObject = useForm<ContactData>({
    values: data,
  });

  const handleSubmit = useCallback(
    async (data: ContactData) => {
      modals.pending();
      await mutate(data);
      modals.success();
    },
    [modals, mutate],
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
    <SectionBlock title="Contact info">
      <FormProvider {...formObject}>
        <WhenLoaded loading={formObject.formState.isLoading}>
          <Stack direction="column">
            <form
              autoComplete="off"
              onSubmit={formObject.handleSubmit(handleSubmit)}
            >
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
