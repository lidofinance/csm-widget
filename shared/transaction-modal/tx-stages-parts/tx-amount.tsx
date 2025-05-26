import { TOKENS } from '@lidofinance/lido-csm-sdk/common';
import { FormatToken } from 'shared/formatters';

type TxAmountProps = {
  amount: bigint;
  token: TOKENS;
};

export const TxAmount = ({ amount, token }: TxAmountProps) => (
  <FormatToken
    amount={amount}
    token={token}
    maxTotalLength={Infinity}
    adaptiveDecimals
  />
);
