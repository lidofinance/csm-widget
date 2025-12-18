import { FC, useCallback, useState } from 'react';
import { trackMatomoFormEvent } from 'utils/track-matomo-event';
import { FormProvider, useForm } from 'react-hook-form';
import { Text } from '@lidofinance/lido-ui';
import { Plural, SectionBlock, Stack, WhenLoaded } from 'shared/components';
import { useDelegates } from './use-delegates';
import { useModalStages } from './use-modal-stages';
import { useConfirmRemoveDelegateModal } from './confirm-remove-modal';
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
        modals.failed(e);
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
          modals.failed(e);
        } finally {
          setRemovingAddress(null);
        }
      }
    },
    [confirmRemove, modals, remove],
  );

  return (
    <SectionBlock title="Manage Delegates">
      <Stack direction="column" gap="lg">
        <Text size="xs" color="secondary">
          Delegates can only access and submit Setup surveys on your behalf.
          Contact and experience data remains private. Up to{' '}
          <Plural
            value={MAX_DELEGATES}
            variants={['delegate', 'delegates']}
            showValue
          />{' '}
          allowed
        </Text>

        <WhenLoaded loading={isLoading}>
          <Stack direction="column" gap="md">
            {delegates.map((delegate) => (
              <DelegateItem
                key={delegate.address}
                delegate={delegate}
                onRemove={() => handleRemove(delegate.address)}
                isRemoving={removingAddress === delegate.address}
              />
            ))}

            {delegates.length === 0 && (
              <Text size="xs" color="secondary">
                No delegates added yet.
              </Text>
            )}

            {canAddMore && (
              <FormProvider {...formObject}>
                <AddDelegateForm onSubmit={handleAdd} isSubmitting={isAdding} />
              </FormProvider>
            )}

            {!canAddMore && (
              <Text size="xs" color="warning">
                Maximum number of delegates reached.
              </Text>
            )}
          </Stack>
        </WhenLoaded>
      </Stack>
    </SectionBlock>
  );
};
