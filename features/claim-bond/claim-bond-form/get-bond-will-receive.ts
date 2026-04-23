import {
  convertSharesToEth,
  StethPoolData,
  TOKENS,
} from '@lidofinance/lido-csm-sdk';

const toSteth = (
  token: TOKENS,
  amount: bigint,
  poolData: StethPoolData,
): bigint =>
  token === TOKENS.wsteth ? convertSharesToEth(amount, poolData) : amount;

export const getBondWillReceive = (
  token: TOKENS,
  amount: bigint | undefined,
  rewards: bigint | undefined,
  poolData: StethPoolData | undefined,
) => {
  if (amount === undefined || rewards === undefined || !poolData) {
    return [0n, false] as const;
  }

  const stethAmount = toSteth(token, amount, poolData);
  const bondReceive = rewards > stethAmount ? rewards - stethAmount : 0n;
  const amountBiggerRewards = stethAmount > rewards;

  return [bondReceive, amountBiggerRewards] as const;
};
