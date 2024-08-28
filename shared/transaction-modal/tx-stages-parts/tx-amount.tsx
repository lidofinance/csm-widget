import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { FormatToken } from 'shared/formatters';

type TxAmountProps = {
  amount: BigNumber;
  token: TOKENS;
};

export const TxAmount = ({ amount, token }: TxAmountProps) => (
  <FormatToken
    amount={amount}
    token={token}
    maxTotalLength={Infinity}
    adaptiveDecimals
    trimEllipsis
  />
);
