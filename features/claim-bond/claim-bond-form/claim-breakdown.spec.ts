import { PERCENT_BASIS, TOKENS } from '@lidofinance/lido-csm-sdk';
import { parseEther } from 'viem';
import {
  ClaimBreakdownData,
  computeClaimBreakdown,
  ShareConverter,
} from './claim-breakdown';
import { CLAIM_OPTION } from './context/types';

const e = (value: string) => parseEther(value);

// wstETH share is worth 2 stETH in these tests
const convert: ShareConverter = {
  toShares: (steth) => steth / 2n,
  toSteth: (shares) => shares * 2n,
};

const makeData = ({
  current,
  required = '8',
  locked = '0',
  debt = '0',
  pendingToSplit = '0',
  rewards = '0',
  shares = [],
}: {
  current: string;
  required?: string;
  locked?: string;
  debt?: string;
  pendingToSplit?: string;
  rewards?: string;
  shares?: bigint[];
}): ClaimBreakdownData => ({
  bond: {
    current: e(current),
    required: e(required),
    locked: e(locked),
    debt: e(debt),
    pendingToSplit: e(pendingToSplit),
  },
  rewards: { available: e(rewards) },
  feeSplits: shares.map((share) => ({ share })),
  calculation: { totalShare: shares.reduce((sum, share) => sum + share, 0n) },
});

describe('computeClaimBreakdown', () => {
  it('claims excess bond and rewards to the Rewards Address', () => {
    const result = computeClaimBreakdown(
      {
        token: TOKENS.steth,
        amount: e('3'),
        claimOption: CLAIM_OPTION.ALL_TO_RA,
      },
      makeData({ current: '10', rewards: '1' }),
      convert,
    );

    expect(result).toMatchObject({
      coverAmount: 0n,
      splittable: 0n,
      toRA: e('3'),
      toRAToken: e('3'),
      bondDelta: -e('2'),
      debtBurned: 0n,
      debtRemain: 0n,
      includesRewards: true,
      hasSplits: false,
      isRewardsToBond: false,
    });
  });

  it('spends rewards on the insufficient bond first', () => {
    const result = computeClaimBreakdown(
      {
        token: TOKENS.steth,
        amount: e('1'),
        claimOption: CLAIM_OPTION.ALL_TO_RA,
      },
      makeData({ current: '7', rewards: '2' }),
      convert,
    );

    expect(result.coverAmount).toBe(e('1'));
    expect(result.toRA).toBe(e('1'));
    expect(result.bondDelta).toBe(0n);
  });

  it('leaves debt untouched when no rewards proof is sent', () => {
    const result = computeClaimBreakdown(
      { token: TOKENS.steth, amount: 0n, claimOption: CLAIM_OPTION.BOND_TO_RA },
      makeData({ current: '10', debt: '1', rewards: '2' }),
      convert,
    );

    expect(result.includesRewards).toBe(false);
    expect(result.debtBurned).toBe(0n);
    expect(result.debtRemain).toBe(e('1'));
  });

  it('sends the splitter share of fresh rewards to the splitters', () => {
    const result = computeClaimBreakdown(
      { token: TOKENS.steth, amount: 0n, claimOption: CLAIM_OPTION.ALL_TO_RA },
      makeData({ current: '10', rewards: '2', shares: [PERCENT_BASIS / 2n] }),
      convert,
    );

    expect(result.hasSplits).toBe(true);
    expect(result.splittableGross).toBe(e('2'));
    expect(result.splittable).toBe(e('1'));
    expect(result.bondDelta).toBe(e('1'));
  });

  it('converts a wstETH amount through the injected converter', () => {
    const result = computeClaimBreakdown(
      {
        token: TOKENS.wsteth,
        amount: e('1'),
        claimOption: CLAIM_OPTION.BOND_TO_RA,
      },
      makeData({ current: '13' }),
      convert,
    );

    expect(result.toRA).toBe(e('2'));
    expect(result.toRAToken).toBe(e('1'));
    expect(result.bondDelta).toBe(-e('2'));
  });

  it('ignores the amount when rewards go to the bond', () => {
    const result = computeClaimBreakdown(
      {
        token: TOKENS.steth,
        amount: e('5'),
        claimOption: CLAIM_OPTION.REWARDS_TO_BOND,
      },
      makeData({ current: '10', rewards: '1' }),
      convert,
    );

    expect(result.isRewardsToBond).toBe(true);
    expect(result.toRA).toBe(0n);
    expect(result.bondDelta).toBe(e('1'));
  });
});
