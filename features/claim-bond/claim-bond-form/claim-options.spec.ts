import { STETH_ROUNDING_THRESHOLD, TOKENS } from '@lidofinance/lido-csm-sdk';
import { parseEther } from 'viem';
import {
  ClaimOptionContext,
  describeClaimOption,
  getClaimOptionContext,
  getClaimOptionViews,
} from './claim-options';
import { CLAIM_OPTION } from './context/types';

const INSUFFICIENT = STETH_ROUNDING_THRESHOLD + 1n;

const ctx = (patch: Partial<ClaimOptionContext> = {}): ClaimOptionContext => ({
  keysInsufficient: 0n,
  realExcess: parseEther('1'),
  rewardsRemainder: parseEther('1'),
  hasSplits: false,
  hasPendingToSplit: false,
  ...patch,
});

describe('describeClaimOption', () => {
  it('claims all to the Rewards Address by default', () => {
    expect(
      describeClaimOption(CLAIM_OPTION.ALL_TO_RA, ctx(), TOKENS.steth),
    ).toEqual({
      label: 'Cash out',
      description: 'Claim both Excess Bond and Rewards to Rewards Address',
      submitLabel: 'Claim',
    });
  });

  it('asks for a withdrawal request when ETH is selected', () => {
    expect(
      describeClaimOption(CLAIM_OPTION.ALL_TO_RA, ctx(), TOKENS.eth)
        .submitLabel,
    ).toBe('Request withdrawal');
  });

  it('compensates and claims rewards when rewards outlive the insufficient bond', () => {
    expect(
      describeClaimOption(
        CLAIM_OPTION.ALL_TO_RA,
        ctx({ keysInsufficient: INSUFFICIENT }),
        TOKENS.steth,
      ),
    ).toEqual({
      label: 'Cash out',
      description:
        'Compensate the Insufficient Bond and claim the rest of Rewards to Rewards Address',
      submitLabel: 'Claim',
    });
  });

  it('routes through the splitters when splits are configured', () => {
    expect(
      describeClaimOption(
        CLAIM_OPTION.ALL_TO_RA,
        ctx({ keysInsufficient: INSUFFICIENT, hasSplits: true }),
        TOKENS.steth,
      ).description,
    ).toBe(
      'Split Rewards, compensate the Insufficient Bond and send the rest to Rewards Address',
    );
    expect(
      describeClaimOption(
        CLAIM_OPTION.ALL_TO_RA,
        ctx({ hasSplits: true, realExcess: 0n }),
        TOKENS.steth,
      ),
    ).toEqual({
      label: 'Cash out',
      description: 'Split all Rewards between splitter addresses',
      submitLabel: 'Claim',
    });
    expect(
      describeClaimOption(
        CLAIM_OPTION.ALL_TO_RA,
        ctx({ hasSplits: true }),
        TOKENS.steth,
      ),
    ).toEqual({
      label: 'Cash out',
      description: 'Split Rewards and claim Excess Bond to Rewards Address',
      submitLabel: 'Claim',
    });
  });

  it('describes the excess-bond-only claim', () => {
    expect(
      describeClaimOption(CLAIM_OPTION.BOND_TO_RA, ctx(), TOKENS.steth),
    ).toEqual({
      label: 'Excess bond only',
      description:
        'Claim only Excess Bond. Rewards remain unclaimed to Rewards Address.',
      submitLabel: 'Claim',
    });
    expect(
      describeClaimOption(
        CLAIM_OPTION.BOND_TO_RA,
        ctx({ hasSplits: true, hasPendingToSplit: true }),
        TOKENS.steth,
      ).description,
    ).toBe(
      'Claim Excess Bond. Pending splitter share will be settled from bond.',
    );
  });

  it('compensates the insufficient bond with all rewards', () => {
    expect(
      describeClaimOption(
        CLAIM_OPTION.REWARDS_TO_BOND,
        ctx({ keysInsufficient: INSUFFICIENT, rewardsRemainder: 0n }),
        TOKENS.steth,
      ),
    ).toEqual({
      label: 'Compound',
      description: 'Compensate the Insufficient Bond with Rewards',
      submitLabel: 'Compensate',
    });
  });

  it('moves rewards to the bond', () => {
    expect(
      describeClaimOption(CLAIM_OPTION.REWARDS_TO_BOND, ctx(), TOKENS.steth),
    ).toEqual({
      label: 'Compound',
      description:
        'Move all rewards to the bond. Best for uploading more keys.',
      submitLabel: 'Claim rewards to the Bond balance',
    });
    expect(
      describeClaimOption(
        CLAIM_OPTION.REWARDS_TO_BOND,
        ctx({ hasSplits: true }),
        TOKENS.steth,
      ),
    ).toEqual({
      label: 'Compound',
      description: 'Split Rewards and send the rest to Bond',
      submitLabel: 'Claim rewards to the Bond balance',
    });
  });
});

describe('getClaimOptionViews', () => {
  it('lists enabled options first, keeping the canonical order', () => {
    const views = getClaimOptionViews(
      [CLAIM_OPTION.REWARDS_TO_BOND],
      ctx(),
      TOKENS.steth,
    );

    expect(views.map(({ option, disabled }) => [option, disabled])).toEqual([
      [CLAIM_OPTION.REWARDS_TO_BOND, false],
      [CLAIM_OPTION.ALL_TO_RA, true],
      [CLAIM_OPTION.BOND_TO_RA, true],
    ]);
  });

  it('orders all enabled options as Figma does', () => {
    const views = getClaimOptionViews(
      [
        CLAIM_OPTION.BOND_TO_RA,
        CLAIM_OPTION.REWARDS_TO_BOND,
        CLAIM_OPTION.ALL_TO_RA,
      ],
      ctx(),
      TOKENS.steth,
    );

    expect(views.map(({ option, disabled }) => [option, disabled])).toEqual([
      [CLAIM_OPTION.ALL_TO_RA, false],
      [CLAIM_OPTION.REWARDS_TO_BOND, false],
      [CLAIM_OPTION.BOND_TO_RA, false],
    ]);
  });

  it('puts the disabled option last', () => {
    const views = getClaimOptionViews(
      [CLAIM_OPTION.ALL_TO_RA, CLAIM_OPTION.BOND_TO_RA],
      ctx(),
      TOKENS.steth,
    );

    expect(views.map(({ option, disabled }) => [option, disabled])).toEqual([
      [CLAIM_OPTION.ALL_TO_RA, false],
      [CLAIM_OPTION.BOND_TO_RA, false],
      [CLAIM_OPTION.REWARDS_TO_BOND, true],
    ]);
  });
});

describe('getClaimOptionContext', () => {
  it('derives the split flags from fee splits and the bond', () => {
    expect(
      getClaimOptionContext({
        calculation: {
          keysInsufficient: 1n,
          realExcess: 2n,
          rewardsRemainder: 3n,
        },
        bond: { pendingToSplit: 4n },
        feeSplits: [{}],
      }),
    ).toEqual({
      keysInsufficient: 1n,
      realExcess: 2n,
      rewardsRemainder: 3n,
      hasSplits: true,
      hasPendingToSplit: true,
    });
  });
});
