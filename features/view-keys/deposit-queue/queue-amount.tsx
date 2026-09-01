import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
import { QueueUnit } from './types';

export const QueueAmount: FC<{ amount?: bigint; unit: QueueUnit }> = ({
  amount,
  unit,
}) =>
  unit === 'eth' ? (
    <FormatToken
      amount={amount}
      token={TOKENS.eth}
      maxDecimalDigits={2}
      trimTrailingZeros
    />
  ) : (
    <>{amount?.toString()}</>
  );
