import { TOKENS } from 'consts/tokens';
import { FC, ReactNode } from 'react';
import { useController } from 'react-hook-form';
import { RadioButton, Stack } from 'shared/components';
import styled from 'styled-components';

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

export const RadioGroupStyle = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;
