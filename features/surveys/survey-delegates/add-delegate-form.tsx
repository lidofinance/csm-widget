import { FC, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { isAddress } from 'viem';
import { Stack } from 'shared/components';
import {
  AddressInputHookForm,
  SubmitButtonHookForm,
} from 'shared/hook-form/controls';

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
  const [validationError, setValidationError] = useState<string | undefined>();

  const handleFormSubmit = useCallback(
    (data: AddDelegateFormData) => {
      clearErrors('address');
      setValidationError(undefined);

      if (!data.address) {
        setError('address', { type: 'manual', message: 'Address is required' });
        setValidationError('Address is required');
        return;
      }
      if (!isAddress(data.address)) {
        setError('address', {
          type: 'manual',
          message: 'Invalid Ethereum address',
        });
        setValidationError('Invalid Ethereum address');
        return;
      }
      onSubmit(data);
    },
    [clearErrors, onSubmit, setError],
  );

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Stack direction="column" gap="md">
        <AddressInputHookForm
          fieldName="address"
          label="Delegate address"
          placeholder="0x..."
          error={validationError}
        />
        <SubmitButtonHookForm loading={isSubmitting}>
          Add Delegate
        </SubmitButtonHookForm>
      </Stack>
    </form>
  );
};
