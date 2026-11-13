import { FC, useCallback, useMemo } from 'react';
import { trackMatomoFormEvent } from 'utils/track-matomo-event';
import { FormProvider, useForm } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { FormCard, FormPage, SubmitButton } from 'shared/form-page';
import { isAuthError } from 'modules/surveys-sdk';
import { useOperatorSetup } from './use-operator-setup';
import { useSetupsKeys } from './use-setups-keys';
import { useModalStages } from './use-modal-stages';
import { useConfirmRemoveSetupModal } from './confirm-remove-modal-app';
import { useNavigate } from 'shared/navigate';
import { PATH } from 'consts/urls';
import { Button, Stack } from '@lidofinance/lido-app-ui';
import { Setup } from '../types';
import { SetupFields } from './setup-fields';
import { useSurveysFilled } from 'shared/hooks';
import { useNodeOperatorId } from 'modules/web3';

export const SurveySetup: FC<{ id?: string }> = ({ id }) => {
  const index = id ? Number(id) : undefined;

  const { data: filled, error, mutate, remove } = useOperatorSetup(index);

  const data = useMemo(() => (id ? filled : undefined), [id, filled]);

  const { data: keys, mutate: mutateKeys } = useSetupsKeys();

  const nodeOperatorId = useNodeOperatorId();
  const { refetch } = useSurveysFilled({ nodeOperatorId });

  const filledWitoutCurrent = Math.max(
    0,
    (keys?.filled ?? 0) - (data?.keysCount ?? 0),
  );
  const keysLeft = Math.max(0, (keys?.total ?? 0) - filledWitoutCurrent);

  const maxKeys = Math.max(keysLeft, data?.keysCount ?? 0);

  const { txModalStages: modals } = useModalStages();
  const confirmRemove = useConfirmRemoveSetupModal();
  const navigate = useNavigate();

  const formObject = useForm<Setup>({
    values: id ? data : undefined,
    defaultValues: {
      validatorSameAsCl: true,
    },
  });

  const handleSubmit = useCallback(
    async (data: Setup) => {
      trackMatomoFormEvent('surveySetup');
      modals.pending();
      try {
        const res = await mutate(data);
        void mutateKeys();
        void refetch();
        if (!id && res?.index) {
          void navigate(`${PATH.SURVEYS_SETUP}/${res.index}` as PATH);
        }
        trackMatomoFormEvent('surveySetup', 'success');
        modals.success();
      } catch (e) {
        if (!isAuthError(e)) modals.failed(e);
      }
    },
    [modals, mutate, mutateKeys, refetch, id, navigate],
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
        if (!isAuthError(e)) modals.failed(e);
      }
    }
  }, [confirmRemove, modals, mutateKeys, navigate, remove]);

  return (
    <FormProvider {...formObject}>
      <WhenLoaded loading={formObject.formState.isLoading} error={error}>
        <FormPage>
          <FormCard>
            <form
              autoComplete="off"
              onSubmit={formObject.handleSubmit(handleSubmit)}
            >
              <Stack gap={32}>
                <SetupFields
                  keysLeft={keys ? keysLeft : undefined}
                  maxKeys={maxKeys}
                />
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
