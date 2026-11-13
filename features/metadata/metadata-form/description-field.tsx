import { Textarea } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import {
  FIELD_ERROR_TEST_ID,
  useFieldController,
} from 'shared/hook-form/fields';

type DescriptionFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
};

export const DescriptionField: FC<DescriptionFieldProps> = ({
  name,
  label,
  placeholder,
}) => {
  const { field, invalid, message } = useFieldController({
    name,
    defaultValue: '',
  });

  return (
    <Textarea
      autosize
      rows={3}
      spellCheck={false}
      placeholder={placeholder}
      ref={field.ref}
      name={field.name}
      value={field.value ?? ''}
      onChange={field.onChange}
      onBlur={field.onBlur}
      label={label}
      disabled={field.disabled}
      error={message ?? invalid}
      dataTestId={{ error: FIELD_ERROR_TEST_ID }}
    />
  );
};
