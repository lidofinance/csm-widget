import { expect } from '@playwright/test';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../../../test.fixture';

const BOND_EXCESS_ETH = '2';

const CLAIM_OPTION = {
  ALL_TO_RA: 'all-to-ra',
  BOND_TO_RA: 'bond-to-ra',
  REWARDS_TO_BOND: 'rewards-to-bond',
} as const;

test.describe(
  'Bond & Rewards. Claim. Claim option states. All options enabled.',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeEach(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await test.step('Set up: add excess bond and report rewards', async () => {
        await widgetService.bondRewardsPage.claim.open();
        const noId = await widgetService.extractNodeOperatorId();
        await forkActionService.addBond(noId, BOND_EXCESS_ETH);
        await forkActionService.reportRewards();
      });

      await widgetService.bondRewardsPage.claim.open();
    });

    test.afterEach(async ({ cmSDK }) => {
      await cmSDK.evmRevert(snapshotId);
    });

    test('Should show all 3 options enabled with correct descriptions when excess bond and rewards are available', async ({
      widgetService,
    }) => {
      const { claim } = widgetService.bondRewardsPage;

      await test.step('ALL_TO_RA is enabled, checked by default, description reads "Claim both Excess Bond and Rewards"', async () => {
        await expect(
          claim.getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA),
        ).toBeEnabled({ timeout: PAGE_WAIT_TIMEOUT });
        await expect(
          claim.getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA),
        ).toBeChecked();
        await expect(
          claim.getClaimOptionDescription(CLAIM_OPTION.ALL_TO_RA),
        ).toHaveText('Claim both Excess Bond and Rewards');
      });

      await test.step('BOND_TO_RA is enabled, not checked, description reads "Claim only Excess Bond. Rewards remain unclaimed"', async () => {
        await expect(
          claim.getClaimOptionRadio(CLAIM_OPTION.BOND_TO_RA),
        ).toBeEnabled();
        await expect(
          claim.getClaimOptionRadio(CLAIM_OPTION.BOND_TO_RA),
        ).not.toBeChecked();
        await expect(
          claim.getClaimOptionDescription(CLAIM_OPTION.BOND_TO_RA),
        ).toHaveText('Claim only Excess Bond. Rewards remain unclaimed');
      });

      await test.step('REWARDS_TO_BOND is enabled, not checked, description reads "Move all rewards to the bond"', async () => {
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
