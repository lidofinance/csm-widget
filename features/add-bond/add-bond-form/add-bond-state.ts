import { TOKENS } from '@lidofinance/lido-csm-sdk';

export type AddBondBalances = {
  ethBalance?: bigint;
  stethBalance?: bigint;
  wstethBalance?: bigint;
};

export const getAddBondBalance = (
  token: TOKENS,
  { ethBalance, stethBalance, wstethBalance }: AddBondBalances,
): bigint =>
  ({
    [TOKENS.eth]: ethBalance,
    [TOKENS.steth]: stethBalance,
    [TOKENS.wsteth]: wstethBalance,
  })[token] ?? 0n;
