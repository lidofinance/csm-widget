import { FC, ReactNode } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { RadioButton, Stack } from 'shared/components';
import { isValidationErrorTypeValidate } from '../validation';

type Props = {
  fieldName: string;
  options: Record<string, ReactNode>;
  disabled?: boolean;
  rules?: UseControllerProps['rules'];
};

export const OptionsButtonsHookForm: FC<Props> = ({
  fieldName,
  disabled,
  options,
  rules,
}) => {
  const {
    field,
    fieldState: { error },
  } = useController<Record<string, string>>({
    name: fieldName,
    rules,
  });

  const hasErrorHighlight =
    isValidationErrorTypeValidate(error?.type) || error?.type === 'required';

  return (
    <Stack>
      {Object.keys(options).map((key) => (
        <RadioButton
          key={key}
          error={hasErrorHighlight}
          {...field}
          {...{
            value: key,
            children: options[key],
            checked: key === field.value,
            disabled,
          }}
        />
      ))}
    </Stack>
  );
};
