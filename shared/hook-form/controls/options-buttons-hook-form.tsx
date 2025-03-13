import { FC, ReactNode } from 'react';
import { useController } from 'react-hook-form';
import { RadioButton, Stack } from 'shared/components';

type Props = {
  fieldName: string;
  options: Record<string, ReactNode>;
  disabled?: boolean;
};

export const OptionsButtonsHookForm: FC<Props> = ({
  fieldName,
  disabled,
  options,
}) => {
  const { field } = useController<Record<string, string>>({ name: fieldName });

  return (
    <Stack>
      {Object.keys(options).map((key) => (
        <RadioButton
          key={key}
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
