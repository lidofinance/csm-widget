import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';

export const BalanceCell: FC<{ effectiveBalance?: bigint }> = ({
  effectiveBalance,
}) =>
  effectiveBalance !== undefined ? (
    <FormatToken amount={effectiveBalance} token={TOKENS.eth} />
  ) : (
    <>&mdash;</>
  );
