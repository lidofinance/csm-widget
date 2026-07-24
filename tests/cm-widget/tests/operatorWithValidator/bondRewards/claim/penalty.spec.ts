import { expect } from '@playwright/test';
import { Tags } from 'tests/shared/consts/common.const';
import { qase } from 'playwright-qase-reporter/playwright';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../../test.fixture';
import { formatEther } from 'viem';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const BOND_EXCESS_ETH = '2';

import { CLAIM_OPTION } from './claim.const';

test.describe(
  'Bond & Rewards. Claim. Penalty state.',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await test.step('Set up: add excess bond, report rewards, lock all excess', async () => {
        await widgetService.bondRewardsPage.claim.open();
        const noId = await widgetService.extractNodeOperatorId();
        await forkActionService.addBond(noId, BOND_EXCESS_ETH);
        await forkActionService.reportRewards();
        // lock exactly all excess without settling — BOND_TO_RA becomes disabled
        const bondBalance = await cmSDK.operator.getBondBalance(BigInt(noId));
        await forkActionService.reportPenalty(
          noId,
          formatEther(bondBalance.delta),
        );
      });

      await widgetService.bondRewardsPage.claim.open();
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test(
      qase(328, 'Should show locked bond row on "Excess bond" card'),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('Bond balance card is visible with "Excess bond" title (not insufficient)', async () => {
          await expect(claim.bondBalanceCard).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await expect(claim.bondBalanceCard).toContainText('Excess bond');
        });

        await test.step('Locked bond row is visible with "Locked:" label and ETH amount', async () => {
          await expect(claim.lockedBondRow).toBeVisible();
          await expect(claim.lockedBondRow).toContainText('Locked:');
          await expect(claim.lockedBondRow).toContainText('ETH');
        });
      },
    );

    test(
      qase(329, 'Should show penalty tooltip on locked bond row'),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('Tooltip appears on hover', async () => {
          await claim.lockedBondRowInfoIcon.hover();
          await expect(claim.tooltipWrapper).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
        });

        await test.step('Tooltip describes penalty and refers to Locked Bond tab', async () => {
          await expect(claim.tooltipWrapper).toContainText(
            'Penalties have been applied to your Node Operator. If they are not covered, the corresponding amount of your bond may be burned. See details in the Locked Bond tab',
          );
        });
      },
    );

    test(
      qase(330, 'Should disable "Excess Bond" option when all excess locked'),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('"Claim All" option is enabled, checked by default, description reads "Claim both Excess Bond and Rewards"', async () => {
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

        await test.step('"Excess Bond" option is disabled and not checked', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.BOND_TO_RA),
          ).toBeDisabled();
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.BOND_TO_RA),
          ).not.toBeChecked();
          await expect(
            claim.getClaimOptionDescription(CLAIM_OPTION.BOND_TO_RA),
          ).toHaveText('Claim only Excess Bond. Rewards remain unclaimed.');
        });

        await test.step('"Rewards to Bond" option is enabled, not checked, description reads "Move all rewards to the bond"', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.REWARDS_TO_BOND),
          ).toBeEnabled();
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.REWARDS_TO_BOND),
          ).not.toBeChecked();
          await expect(
            claim.getClaimOptionDescription(CLAIM_OPTION.REWARDS_TO_BOND),
          ).toHaveText(
            'Move all rewards to the bond. Best for uploading more keys.',
          );
        });
      },
    );
  },
);
