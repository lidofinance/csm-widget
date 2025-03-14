import { ChangeEvent, FC, useCallback } from 'react';
import { useController } from 'react-hook-form';
import { RadioButton, Stack } from 'shared/components';

type Props = {
  fieldName: string;
  disabled?: boolean;
};

export const BooleanButtonsHookForm: FC<Props> = ({ fieldName, disabled }) => {
  const { field } = useController<Record<string, boolean>>({ name: fieldName });

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
          value: 'off',
          children: 'No',
          checked: !field.value,
          onChange,
          disabled,
        }}
      />
      <RadioButton
        {...field}
        {...{
          value: 'on',
          children: 'Yes',
          checked: !!field.value,
          onChange,
          disabled,
        }}
      />
    </Stack>
  );
};
