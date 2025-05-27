import { PerToken, TOKENS } from '@lidofinance/lido-csm-sdk/common';

type Props = Partial<PerToken<bigint>>;

// TODO: convert wsteth amount

export const getMaxBalanceToken = (props: Props): TOKENS => {
  const balances = [
    { token: TOKENS.steth, balance: props.stETH ?? 0n },
    { token: TOKENS.wsteth, balance: props.wstETH ?? 0n },
    { token: TOKENS.eth, balance: props.ETH ?? 0n },
  ];

  return balances.reduce(
    (max, current) => (max.balance >= current.balance ? max : current),
    {
      balance: 0n,
      token: TOKENS.steth,
    },
  ).token;
};
