import { InlineLoader, Question, Tooltip } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { FC, ReactNode } from 'react';
import { Stack } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { AmountStyle, TitledAmountStyle } from './style';

type TitledAddressProps = {
  title?: ReactNode;
  help?: string;
  loading?: boolean;
  amount?: BigNumber;
  token?: TOKENS;
  warning?: boolean;
};
export const TitledAmount: FC<TitledAddressProps> = ({
  amount,
  token,
  title,
  help,
  loading,
  warning,
}) => {
  return (
    <TitledAmountStyle $warning={warning}>
      <Stack gap="xs" center>
        {title}
        {help && (
          <Tooltip placement="bottomLeft" title={help}>
            <Question />
          </Tooltip>
        )}
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
