import { FC, useCallback, useMemo } from 'react';
import { trackMatomoFormEvent } from 'utils/track-matomo-event';
import { FormProvider, useForm } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { FormCard, FormPage, SubmitButton } from 'shared/form-page';
import { isAuthError, parseOperatorKey } from 'modules/surveys-sdk';
import { useOperatorSetup } from '../survey-setup/use-operator-setup';
import { useSetupsKeys } from '../survey-setup/use-setups-keys';
import { useModalStages } from '../survey-setup/use-modal-stages';
import { useConfirmRemoveSetupModal } from '../survey-setup/confirm-remove-modal-app';
import { useNavigate } from 'shared/navigate';
import { PATH } from 'consts/urls';
import { Button, Stack } from '@lidofinance/lido-app-ui';
import { Setup } from '../types';
import { SetupFields } from '../survey-setup/setup-fields';

type DelegatorSetupFormProps = {
  operatorId: string;
  setupId?: string;
};

export const DelegatorSetupForm: FC<DelegatorSetupFormProps> = ({
  operatorId,
  setupId,
}) => {
  const isEditMode = !!setupId && setupId !== 'new';
  const operatorKey = parseOperatorKey(operatorId) ?? undefined;
  const index = isEditMode ? Number(setupId) : undefined;

  const {
    data: filled,
    error,
    mutate,
    remove,
  } = useOperatorSetup(index, { operatorKey, invalidateOnMutate: true });

  const data = useMemo(
    () => (isEditMode ? filled : undefined),
    [isEditMode, filled],
  );

  const { data: keys, mutate: mutateKeys } = useSetupsKeys(operatorKey);

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
    values: isEditMode ? data : undefined,
    defaultValues: {
      validatorSameAsCl: true,
    },
  });

  const handleSubmit = useCallback(
    async (data: Setup) => {
      trackMatomoFormEvent('surveyDelegatorSetup');
      modals.pending();
      try {
        const res = await mutate(data);
        void mutateKeys();
        if (!isEditMode && res?.index) {
          void navigate(
            `${PATH.SURVEYS_DELEGATOR}/${operatorId}/${res.index}` as PATH,
          );
        }
        trackMatomoFormEvent('surveyDelegatorSetup', 'success');
        modals.success();
      } catch (e) {
        if (!isAuthError(e)) modals.failed(e);
      }
    },
    [modals, mutate, mutateKeys, isEditMode, navigate, operatorId],
  );

  const handleRemove = useCallback(async () => {
    if (await confirmRemove({})) {
      modals.pendingRemove();
      try {
        await remove();
        void mutateKeys();
        void navigate(`${PATH.SURVEYS_DELEGATOR}/${operatorId}` as PATH);
        modals.successRemove();
      } catch (e) {
        if (!isAuthError(e)) modals.failed(e);
      }
    }
  }, [confirmRemove, modals, mutateKeys, navigate, remove, operatorId]);

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
