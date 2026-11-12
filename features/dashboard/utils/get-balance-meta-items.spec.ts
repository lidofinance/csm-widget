import { calcBondBalance } from '@lidofinance/lido-csm-sdk';
import { getBalanceMetaItems } from './get-balance-meta-items';

const ETH = 10n ** 18n;

const makeBond = (overrides: Partial<Parameters<typeof calcBondBalance>[0]>) =>
  calcBondBalance({
    current: 5n * ETH,
    required: 2n * ETH,
    locked: 0n,
    debt: 0n,
    pendingToSplit: 0n,
    ...overrides,
  });

const ids = (items: { id: string }[]) => items.map(({ id }) => id);

describe('getBalanceMetaItems', () => {
  it('returns required, delta and rewards by default', () => {
    const bond = makeBond({});
    const items = getBalanceMetaItems({
      bond,
      rewards: { available: ETH },
      splittable: 0n,
    });
    expect(ids(items)).toEqual(['required', 'delta', 'rewards']);
    expect(items[0]).toMatchObject({
      label: 'Required bond',
      amount: bond.required,
      symbol: 'stETH',
      tone: 'default',
      testid: 'requiredBondBalance',
    });
    expect(items[1]).toMatchObject({
      label: 'Excess bond',
      amount: bond.delta,
      tone: 'default',
      testid: 'excessBondBalance',
    });
    expect(items[2]).toMatchObject({
      label: 'Rewards',
      amount: ETH,
      testid: 'rewardsBalance',
    });
  });

  it('shows a positive Insufficient bond amount in error tone', () => {
    const bond = makeBond({ current: ETH, required: 3n * ETH });
    expect(bond.isInsufficient).toBe(true);
    const [, delta] = getBalanceMetaItems({
      bond,
      rewards: undefined,
      splittable: 0n,
    });
    expect(delta).toMatchObject({
      label: 'Insufficient bond',
      tone: 'error',
      amount: bond.delta,
    });
    expect(delta.amount > 0n).toBe(true);
  });

  it('adds Locked bond in ETH when locked', () => {
    const bond = makeBond({ locked: ETH / 2n });
    const items = getBalanceMetaItems({
      bond,
      rewards: undefined,
      splittable: 0n,
    });
    expect(ids(items)).toEqual(['required', 'delta', 'rewards', 'locked']);
    expect(items[3]).toMatchObject({
      label: 'Locked bond',
      symbol: 'ETH',
      tone: 'error',
      amount: ETH / 2n,
      testid: 'lockedBondBalance',
    });
  });

  it('adds debt, pending and splittable rows in order after rewards', () => {
    const bond = makeBond({ debt: ETH / 10n, pendingToSplit: ETH / 5n });
    const items = getBalanceMetaItems({
      bond,
      rewards: { available: 0n },
      splittable: ETH / 4n,
    });
    expect(ids(items).slice(3)).toEqual([
      'debt',
      'pendingToSplit',
      'splittable',
    ]);
    expect(items.slice(3).map(({ label, tone }) => [label, tone])).toEqual([
      ['Bond debt', 'error'],
      ['Pending to split', 'error'],
      ['Rewards to splitters', 'error'],
    ]);
    expect(items[5].amount).toBe(ETH / 4n);
    expect(items[5].testid).toBe('toSplittersBalance');
  });

  it('treats missing rewards as zero', () => {
    const items = getBalanceMetaItems({
      bond: makeBond({}),
      rewards: undefined,
      splittable: 0n,
    });
    expect(items.find(({ id }) => id === 'rewards')?.amount).toBe(0n);
  });
});
