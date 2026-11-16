import { PATH } from 'consts/urls';
import { FC, useCallback } from 'react';
import { trackMatomoFormEvent } from 'utils/track-matomo-event';
import { FormProvider, useForm } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { FormCard, FormPage, SubmitButton } from 'shared/form-page';
import { SegmentCardsField, TextField } from 'shared/hook-form/fields';
import { useNavigate } from 'shared/navigate';
import {
  callSurvey,
  isAuthError,
  surveyRequest,
  useOperatorSurvey,
} from 'modules/surveys-sdk';
import {
  contactsDeleteOne,
  contactsFindOne,
  contactsUpdate,
} from 'modules/surveys-sdk/generated';
import { Button, Field, Stack } from '@lidofinance/lido-app-ui';
import { useConfirmRemoveContactsModal } from './confirm-remove-modal-app';
import { useModalStages } from './use-modal-stages';
import { Contact } from '../types';

type ContactForm = Omit<Contact, 'allowShare'> & { allowShare: 'on' | 'off' };

const SHARE_OPTIONS = [
  { value: 'on', title: 'Yes' },
  { value: 'off', title: 'No' },
];

const transformIncoming = (data: Contact): ContactForm => ({
  ...data,
  allowShare: data.allowShare ? 'on' : 'off',
});

const transformOutgoing = (data: ContactForm): Contact => ({
  ...data,
  allowShare: data.allowShare === 'on',
});

export const SurveyContacts: FC = () => {
  const { data, mutate, remove } = useOperatorSurvey<ContactForm, Contact>(
    'contacts',
    {
      transformIncoming,
      transformOutgoing,
      get: ({ nodeOperatorId, token, signal }) =>
        callSurvey(() =>
          contactsFindOne({
            ...surveyRequest(token, signal),
            path: { nodeOperatorId },
          }),
        ),
      update: (body, { nodeOperatorId, token }) =>
        callSurvey(() =>
          contactsUpdate({
            ...surveyRequest(token),
            path: { nodeOperatorId },
            body,
          }),
        ),
      remove: async ({ nodeOperatorId, token }) => {
        await callSurvey(() =>
          contactsDeleteOne({
            ...surveyRequest(token),
            path: { nodeOperatorId },
          }),
        );
      },
    },
  );
  const { txModalStages: modals } = useModalStages();
  const confirmRemove = useConfirmRemoveContactsModal();
  const navigate = useNavigate();

  const formObject = useForm<ContactForm>({
    values: data,
    defaultValues: {
      allowShare: 'on',
    },
  });

  const handleSubmit = useCallback(
    async (data: ContactForm) => {
      trackMatomoFormEvent('surveyContacts');
      modals.pending();
      try {
        await mutate(data);
        trackMatomoFormEvent('surveyContacts', 'success');
        modals.success();
      } catch (e) {
        if (!isAuthError(e)) modals.failed(e);
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
        if (!isAuthError(e)) modals.failed(e);
      }
    }
  }, [confirmRemove, modals, navigate, remove]);

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
                <Stack gap={32}>
                  <TextField
                    name="name"
                    label="Name or pseudonym"
                    placeholder="Your name"
                    required
                  />
                  <TextField
                    name="discord"
                    label="Discord Handle"
                    placeholder="Discord"
                  />
                  <TextField
                    name="telegram"
                    label="Telegram Handle"
                    placeholder="Telegram"
                  />
                  <TextField
                    name="twitter"
                    label="Twitter or Farcaster or both:"
                    placeholder="Social media account"
                  />
                  <Field
                    id="allowShare"
                    label="Do you allow your ID and name to be shared with others?"
                    description="(e.g. create a public directory for Node Operators in our community)"
                    group
                  >
                    <SegmentCardsField
                      name="allowShare"
                      aria-label="Allow sharing ID and name"
                      options={SHARE_OPTIONS}
                    />
                  </Field>
                </Stack>
                <Stack gap={12}>
                  <SubmitButton>Submit</SubmitButton>
                  {!!data && (
                    <Button variant="error" fullWidth onClick={handleRemove}>
                      Delete
                    </Button>
                  )}
                </Stack>
              </Stack>
            </form>
          </FormCard>
        </FormPage>
      </WhenLoaded>
    </FormProvider>
  );
};
