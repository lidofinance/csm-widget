import { InlineLoader, Text } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { FC, ReactNode } from 'react';
import { IconTooltip, Stack } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { AmountStyle, TitledAmountStyle } from './style';

type TitledAddressProps = {
  title?: ReactNode;
  description?: ReactNode;
  help?: string;
  loading?: boolean;
  amount?: BigNumber;
  token?: TOKENS;
  warning?: boolean;
};

// TODO: merge components
export const TitledAmount: FC<TitledAddressProps> = ({
  amount,
  token,
  title,
  description,
  help,
  loading,
  warning,
}) => {
  return (
    <TitledAmountStyle $warning={warning && amount?.gt(0)}>
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
      {loading ? (
        <InlineLoader color="text" />
      ) : (
        <AmountStyle>
          <FormatToken amount={amount} token={token} />
        </AmountStyle>
      )}
    </TitledAmountStyle>
  );
};
