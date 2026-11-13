import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { TokenAmount, TokenIconSymbol } from '@lidofinance/lido-app-ui';
import { FormatToken } from 'shared/formatters';

type TxAmountProps = {
  amount: bigint;
  token: TOKENS;
};

const TOKEN_ICON: Record<TOKENS, TokenIconSymbol> = {
  [TOKENS.eth]: 'ETH',
  [TOKENS.steth]: 'stETH',
  [TOKENS.wsteth]: 'wstETH',
};

export const TxAmount = ({ amount, token }: TxAmountProps) => {
  const formatted = (
    <FormatToken
      amount={amount}
      token={token}
      maxTotalLength={Infinity}
      adaptiveDecimals
    />
  );

  return <TokenAmount symbol={TOKEN_ICON[token]} amount={formatted} />;
};
