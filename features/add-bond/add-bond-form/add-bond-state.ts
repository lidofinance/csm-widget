import type { BondBalance } from '@lidofinance/lido-csm-sdk';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { BOND_EXCESS, BOND_INSUFFICIENT } from 'consts/text';

export const INSUFFICIENT_BOND_HELP =
  'Insufficient bond is the missing amount of stETH required to cover all operator’s keys. In case of a bond insufficient, "unbonded" validators are requested for exit by the protocol.';

export type AddBondDeltaRow = {
  insufficient: boolean;
  label: string;
  info?: string;
  amount: bigint;
};

export const getAddBondDeltaRow = (
  bond?: Pick<BondBalance, 'delta' | 'isInsufficient'>,
): AddBondDeltaRow | undefined => {
  if (!bond) return undefined;

  return bond.isInsufficient
    ? {
        insufficient: true,
        label: BOND_INSUFFICIENT,
        info: INSUFFICIENT_BOND_HELP,
        amount: bond.delta,
      }
    : { insufficient: false, label: BOND_EXCESS, amount: bond.delta };
};

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
