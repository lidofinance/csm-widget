import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import { IconTooltip, Stack } from 'shared/components';
import { TitledValue } from 'shared/components/titled-value/titled-value';
import { FormatToken } from 'shared/formatters';
import styled from 'styled-components';

type TitledAmountProps = ComponentPropsWithoutRef<'div'> & {
  title?: ReactNode;
  description?: ReactNode;
  chip?: ReactNode;
  help?: string;
  loading?: boolean;
  amount?: bigint;
  token?: TOKENS;
  warning?: boolean;
};

const AmountStyle = styled.div`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: 700;
`;

export const TitledAmount: FC<TitledAmountProps> = ({
  amount,
  token,
  title,
  description,
  chip,
  help,
  loading,
  warning,
  ...props
}) => (
  <TitledValue
    warning={warning && amount !== undefined && amount > 0n}
    loading={loading}
    title={
      <Stack gap="md" center>
        <Stack gap="xs" center>
          <Stack gap="md" center>
            {title}
            {description && (
              <Text color="secondary" size="xxs">
                {description}
              </Text>
            )}
          </Stack>
          <IconTooltip tooltip={help} />
        </Stack>
        {chip}
      </Stack>
    }
    value={
      <AmountStyle>
        <FormatToken amount={amount} token={token} />
      </AmountStyle>
    }
    {...props}
  />
);
