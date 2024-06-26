import { TOKENS } from 'consts/tokens';
import { FC, ReactNode } from 'react';
import { useController } from 'react-hook-form';
import { RadioButton, Stack } from 'shared/components';

type Props = {
  fieldName?: string;
  options: Record<string, ReactNode>;
};

export const TokenButtonsHookForm: FC<Props> = ({
  fieldName = 'token',
  options,
}) => {
  const {
    field,
    formState: { defaultValues },
  } = useController<Record<string, TOKENS>>({ name: fieldName });

  return (
    <Stack>
      {Object.keys(options).map((key) => (
        <RadioButton
          key={key}
          {...field}
          {...{
            value: key,
            children: options[key],
            defaultChecked: key === defaultValues?.[fieldName],
          }}
        />
      ))}
    </Stack>
  );
};
