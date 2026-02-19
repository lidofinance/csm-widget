import { Textarea } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useController } from 'react-hook-form';
import { isValidationErrorTypeValidate } from 'shared/hook-form/validation/validation-error';

export const DescriptionInput: FC = () => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: 'description',
    defaultValue: '',
  });

  const hasErrorHighlight =
    isValidationErrorTypeValidate(error?.type) ||
    error?.type === 'required' ||
    error?.type === 'manual';
  const errorMessage = hasErrorHighlight && (error?.message || true);

  return (
    <Textarea
      {...field}
      disabled={field.disabled}
      error={errorMessage}
      label="Description"
      placeholder="Enter operator description"
      rows={4}
      fullwidth
    />
  );
};
