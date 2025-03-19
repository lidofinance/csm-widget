import { ChangeEvent, FC, ReactNode, useCallback } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { RadioButton, Stack } from 'shared/components';

type Props = {
  fieldName: string;
  options?: [ReactNode, ReactNode];
  disabled?: boolean;
  rules?: UseControllerProps['rules'];
};

export const BooleanButtonsHookForm: FC<Props> = ({
  fieldName,
  options = ['Yes', 'No'],
  disabled,
  rules,
}) => {
  const { field } = useController<Record<string, boolean>>({
    name: fieldName,
    rules,
  });

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      field.onChange(e.target.value === 'on');
    },
    [field],
  );

  return (
    <Stack>
      <RadioButton
        {...field}
        {...{
          value: 'on',
          children: options[0],
          checked: field.value === true,
          onChange,
          disabled,
        }}
      />
      <RadioButton
        {...field}
        {...{
          value: 'off',
          children: options[1],
          checked: field.value === false,
          onChange,
          disabled,
        }}
      />
    </Stack>
  );
};
