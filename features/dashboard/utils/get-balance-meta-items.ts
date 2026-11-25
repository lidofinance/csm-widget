import type { BondBalance } from '@lidofinance/lido-csm-sdk';

export type BalanceMetaItem = {
  id:
    | 'required'
    | 'delta'
    | 'rewards'
    | 'locked'
    | 'debt'
    | 'pendingToSplit'
    | 'splittable';
  label: string;
  amount: bigint;
  symbol: 'stETH' | 'ETH';
  tone: 'default' | 'error';
  testid: string;
};

/** Balance card footer rows in display order; negatives only when > 0 */
export const getBalanceMetaItems = ({
  bond,
  rewards,
  splittable,
}: {
  bond: BondBalance;
  rewards: { available: bigint } | undefined;
  splittable: bigint;
}): BalanceMetaItem[] => {
  const negatives: BalanceMetaItem[] = [
    {
      id: 'locked',
      label: 'Locked bond',
      amount: bond.locked,
      symbol: 'ETH',
      tone: 'error',
      testid: 'lockedBondBalance',
    },
    {
      id: 'debt',
      label: 'Bond debt',
      amount: bond.debt,
      symbol: 'stETH',
      tone: 'error',
      testid: 'debtBalance',
    },
    {
      id: 'pendingToSplit',
      label: 'Pending to split',
      amount: bond.pendingToSplit,
      symbol: 'stETH',
      tone: 'error',
      testid: 'pendingToSplitBalance',
    },
    {
      id: 'splittable',
      label: 'Rewards to splitters',
      amount: splittable,
      symbol: 'stETH',
      tone: 'error',
      testid: 'toSplittersBalance',
    },
  ];

  return [
    {
      id: 'required',
      label: 'Required bond',
      amount: bond.required,
      symbol: 'stETH',
      tone: 'default',
      testid: 'requiredBondBalance',
    },
    {
      id: 'delta',
      label: bond.isInsufficient ? 'Insufficient bond' : 'Excess bond',
      amount: bond.delta,
      symbol: 'stETH',
      tone: bond.isInsufficient ? 'error' : 'default',
      testid: 'excessBondBalance',
    },
    {
      id: 'rewards',
      label: 'Rewards',
      amount: rewards?.available ?? 0n,
      symbol: 'stETH',
      tone: 'default',
      testid: 'rewardsBalance',
    },
    ...negatives.filter(({ amount }) => amount > 0n),
  ];
};
