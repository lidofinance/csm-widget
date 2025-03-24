import { PATH } from 'consts/urls';
import { FC, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormTitle, SectionBlock, Stack, WhenLoaded } from 'shared/components';
import {
  BooleanButtonsHookForm,
  SubmitButtonHookForm,
  TextInputHookForm,
} from 'shared/hook-form/controls';
import { useNavigate } from 'shared/navigate';
import { SurveyButton } from '../components';
import { useSurveysSWR } from '../shared/use-surveys-swr';
import { useConfirmRemoveModal } from './confirm-remove-modal';
import { useModalStages } from './use-modal-stages';
import { Text } from '@lidofinance/lido-ui';
import { Contact } from '../types';

export const SurveyContacts: FC = () => {
  const { data, mutate, remove } = useSurveysSWR<Contact>('contacts');
  const { txModalStages: modals } = useModalStages();
  const confirmRemove = useConfirmRemoveModal();
  const navigate = useNavigate();

  const formObject = useForm<Contact>({
    values: data,
    defaultValues: {
      allowShare: true,
    },
  });

  const handleSubmit = useCallback(
    async (data: Contact) => {
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

  const handleRemove = useCallback(async () => {
    if (await confirmRemove({})) {
      modals.pendingRemove();
      try {
        await remove();
        void navigate(PATH.SURVEYS);
        modals.successRemove();
      } catch (e) {
        modals.failed(e);
      }
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
              <Stack direction="column" gap="xxl">
                <Stack direction="column">
                  <FormTitle>Name or pseudonym</FormTitle>
                  <TextInputHookForm
                    fieldName="name"
                    label="Your name"
                    rules={{ required: true }}
                  />
                </Stack>

                <Stack direction="column">
                  <FormTitle>Discord Handle</FormTitle>
                  <TextInputHookForm fieldName="discord" label="Discord" />
                </Stack>

                <Stack direction="column">
                  <FormTitle>Telegram Handle</FormTitle>
                  <TextInputHookForm fieldName="telegram" label="Telegram" />
                </Stack>

                <Stack direction="column">
                  <FormTitle>Twitter or Farcaster or both:</FormTitle>
                  <TextInputHookForm
                    fieldName="twitter"
                    label="Social media account"
                  />
                </Stack>

                <Stack direction="column">
                  <FormTitle>
                    Do you allow your ID and name to be shared with others?
                    <Text size="xs" color="secondary">
                      (e.g. create a public directory for Node Opeators in our
                      community)
                    </Text>
                  </FormTitle>
                  <BooleanButtonsHookForm fieldName="allowShare" />
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
