import { expect } from '@playwright/test';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../../../test.fixture';

const CLAIM_OPTION = {
  ALL_TO_RA: 'all-to-ra',
  BOND_TO_RA: 'bond-to-ra',
  REWARDS_TO_BOND: 'rewards-to-bond',
} as const;

test.describe(
  'Bond & Rewards. Claim. Claim option states. Rewards only — no excess bond, delta=0.',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeEach(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await test.step('Set up: report rewards only (no addBond — delta stays 0)', async () => {
        // No addBond → delta = 0 (neither excess nor insufficient)
        await forkActionService.reportRewards();
      });

      await widgetService.bondRewardsPage.claim.open();
    });

    test.afterEach(async ({ cmSDK }) => {
      await cmSDK.evmRevert(snapshotId);
    });

    test('Should show non-compensate descriptions when only rewards are available and delta is zero', async ({
      widgetService,
    }) => {
      const { claim } = widgetService.bondRewardsPage;

      await test.step('ALL_TO_RA is enabled, checked by default, description reads "Claim Rewards"', async () => {
        await expect(
          claim.getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA),
        ).toBeEnabled({ timeout: PAGE_WAIT_TIMEOUT });
        await expect(
          claim.getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA),
        ).toBeChecked();
        await expect(
          claim.getClaimOptionDescription(CLAIM_OPTION.ALL_TO_RA),
        ).toHaveText('Claim Rewards');
      });

      await test.step('BOND_TO_RA is disabled and not checked', async () => {
        await expect(
          claim.getClaimOptionRadio(CLAIM_OPTION.BOND_TO_RA),
        ).toBeDisabled();
        await expect(
          claim.getClaimOptionRadio(CLAIM_OPTION.BOND_TO_RA),
        ).not.toBeChecked();
        await expect(
          claim.getClaimOptionDescription(CLAIM_OPTION.BOND_TO_RA),
        ).toHaveText('Claim only Excess Bond. Rewards remain unclaimed');
      });

      await test.step('REWARDS_TO_BOND is enabled, not checked, description reads "Move all rewards to the bond" (NOT "Compensate")', async () => {
        await expect(
          claim.getClaimOptionRadio(CLAIM_OPTION.REWARDS_TO_BOND),
        ).toBeEnabled();
        await expect(
          claim.getClaimOptionRadio(CLAIM_OPTION.REWARDS_TO_BOND),
        ).not.toBeChecked();
        await expect(
          claim.getClaimOptionDescription(CLAIM_OPTION.REWARDS_TO_BOND),
        ).toHaveText(
          'Move all rewards to the bond. Best for uploading more keys',
        );
      });
    });
  },
);
