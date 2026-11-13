import { FC, useCallback, useState } from 'react';
import { trackMatomoFormEvent } from 'utils/track-matomo-event';
import { FormProvider, useForm } from 'react-hook-form';
import { Body, EmptyState, MessageBox, Stack } from '@lidofinance/lido-app-ui';
import { Plural, WhenLoaded } from 'shared/components';
import { HubList } from 'shared/components/hub-list';
import { isAuthError } from 'modules/surveys-sdk';
import { useDelegates } from './use-delegates';
import { useModalStages } from './use-modal-stages';
import { useConfirmRemoveDelegateModal } from './confirm-remove-delegate-modal-app';
import { DelegateItem } from './delegate-item';
import { AddDelegateForm } from './add-delegate-form';
import { MAX_DELEGATES } from '../types';

type AddDelegateFormData = {
  address: string;
};

export const SurveyDelegates: FC = () => {
  const { delegates, isLoading, add, remove, isAdding, canAddMore } =
    useDelegates();
  const { txModalStages: modals } = useModalStages();
  const confirmRemove = useConfirmRemoveDelegateModal();
  const [removingAddress, setRemovingAddress] = useState<string | null>(null);

  const formObject = useForm<AddDelegateFormData>({
    defaultValues: { address: '' },
  });

  const handleAdd = useCallback(
    async (data: AddDelegateFormData) => {
      trackMatomoFormEvent('surveyDelegates');
      modals.pending();
      try {
        await add(data.address);
        formObject.reset();
        trackMatomoFormEvent('surveyDelegates', 'success');
        modals.success();
      } catch (e) {
        if (!isAuthError(e)) modals.failed(e);
      }
    },
    [add, formObject, modals],
  );

  const handleRemove = useCallback(
    async (address: string) => {
      if (await confirmRemove({ address })) {
        setRemovingAddress(address);
        modals.pendingRemove();
        try {
          await remove(address);
          modals.successRemove();
        } catch (e) {
          if (!isAuthError(e)) modals.failed(e);
        } finally {
          setRemovingAddress(null);
        }
      }
    },
    [confirmRemove, modals, remove],
  );

  return (
    <Stack gap={24}>
      <Body color="secondary">
        Delegates can only access and submit Setup surveys on your behalf.
        Contact and experience data remains private. Up to{' '}
        <Plural
          value={MAX_DELEGATES}
          variants={['delegate', 'delegates']}
          showValue
        />{' '}
        allowed.
      </Body>

      <WhenLoaded loading={isLoading}>
        {delegates.length === 0 ? (
          <EmptyState title="No delegates added yet" />
        ) : (
          <HubList>
            {delegates.map((delegate) => (
              <DelegateItem
                key={delegate.address}
                delegate={delegate}
                onRemove={() => handleRemove(delegate.address)}
                isRemoving={removingAddress === delegate.address}
              />
            ))}
          </HubList>
        )}

        {canAddMore ? (
          <FormProvider {...formObject}>
            <AddDelegateForm onSubmit={handleAdd} isSubmitting={isAdding} />
          </FormProvider>
        ) : (
          <MessageBox variant="warning">
            Maximum number of delegates reached
          </MessageBox>
        )}
      </WhenLoaded>
    </Stack>
  );
};
