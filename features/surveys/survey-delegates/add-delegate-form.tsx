import { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { isAddress } from 'viem';
import { FormCard, SubmitButton } from 'shared/form-page';
import { AddressField } from 'shared/hook-form/fields';
import { VALIDATION_MESSAGES } from 'shared/hook-form/validation';

type AddDelegateFormData = {
  address: string;
};

type AddDelegateFormProps = {
  onSubmit: (data: AddDelegateFormData) => void;
  isSubmitting?: boolean;
};

export const AddDelegateForm: FC<AddDelegateFormProps> = ({
  onSubmit,
  isSubmitting,
}) => {
  const { handleSubmit, setError, clearErrors } =
    useFormContext<AddDelegateFormData>();

  const handleFormSubmit = useCallback(
    (data: AddDelegateFormData) => {
      clearErrors('address');

      if (!data.address) {
        setError('address', { type: 'manual', message: 'Address is required' });
        return;
      }
      if (!isAddress(data.address)) {
        setError('address', {
          type: 'manual',
          message: VALIDATION_MESSAGES.invalidAddress,
        });
        return;
      }
      onSubmit(data);
    },
    [clearErrors, onSubmit, setError],
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <FormCard>
        <AddressField
          name="address"
          label="Delegate address"
          placeholder="0x..."
        />
        <SubmitButton disabled={isSubmitting}>Add Delegate</SubmitButton>
      </FormCard>
    </form>
  );
};
