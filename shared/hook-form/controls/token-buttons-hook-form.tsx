import { TOKENS } from 'consts/tokens';
import { FC, ReactNode } from 'react';
import { useController } from 'react-hook-form';
import { RadioButton } from 'shared/components';
import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';

type Props = {
  fieldName?: string;
  options: Record<string, ReactNode>;
  disabled?: boolean;
};

export const TokenButtonsHookForm: FC<Props> = ({
  fieldName = 'token',
  disabled,
  options,
}) => {
  const {
    field,
    formState: { defaultValues },
  } = useController<Record<string, TOKENS>>({ name: fieldName });

  return (
    <StackWrap>
      {Object.keys(options).map((key) => (
        <RadioButton
          key={key}
          {...field}
          {...{
            value: key,
            children: options[key],
            defaultChecked: key === defaultValues?.[fieldName],
            disabled,
          }}
        />
      ))}
    </StackWrap>
  );
};

const StackWrap = styled(StackStyle)`
  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: column;
  }
`;
