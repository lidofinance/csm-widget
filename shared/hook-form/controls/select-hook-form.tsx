import { Option as OptionType, Select } from '@lidofinance/lido-ui';
import { useController, UseControllerProps } from 'react-hook-form';
import { isValidationErrorTypeValidate } from '../validation/validation-error';

type OptionType = {
  value: string;
  label: string;
};

type BlockhashInputHookFormProps = Partial<
  React.ComponentProps<typeof Select>
> & {
  fieldName: string;
  label?: string;
  placeholder?: string;
  options: OptionType[];
  rules?: UseControllerProps['rules'];
};

export const SelectHookForm = ({
  fieldName,
  options,
  rules,
  placeholder = 'Select',
  error: errorProp,
  ...props
}: BlockhashInputHookFormProps) => {
  const {
    field,
    fieldState: { error },
  } = useController({
    name: fieldName,
    defaultValue: '',
    rules,
  });

  const hasErrorHighlight =
    isValidationErrorTypeValidate(error?.type) || error?.type === 'required';
  // allows to show error state without message
  const errorMessage = hasErrorHighlight && (error?.message || true);

  return (
    <Select
      fullwidth
      placeholder={placeholder}
      disabled={props.disabled || field.disabled}
      error={errorProp ?? errorMessage}
      {...props}
      {...field}
    >
      {options.map((item) => (
        <OptionType key={item.value} value={item.value}>
          {item.label}
        </OptionType>
      ))}
    </Select>
  );
};
