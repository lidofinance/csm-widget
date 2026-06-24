import { expect } from '@playwright/test';
import { Tags } from 'tests/shared/consts/common.const';
import { qase } from 'playwright-qase-reporter/playwright';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../../test.fixture';
import { formatEther } from 'viem';
import { CLAIM_OPTION } from './claim.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const ONE_ETH = 1_000_000_000_000_000_000n;

test.describe(
  'Bond & Rewards. Claim. Insufficient bond with rewards.',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(
      async ({ useFork, cmSDK, forkActionService, widgetService }) => {
        test.skip(!useFork, 'Test suite runs only on forked network');

        snapshotId = await cmSDK.evmSnapshot();

        await test.step('Set up: report rewards, then make bond insufficient via penalty + settle', async () => {
          await widgetService.bondRewardsPage.claim.open();
          noId = await widgetService.extractNodeOperatorId();
          await forkActionService.reportRewards();
          const bondBalance = await cmSDK.operator.getBondBalance(BigInt(noId));
          // delta + 1 ETH ensures bond drops below required after settlement
          const penaltyAmount = formatEther(bondBalance.delta + ONE_ETH);
          await forkActionService.reportPenalty(noId, penaltyAmount);
          await forkActionService.settlePenalty(noId);
        });

        await widgetService.bondRewardsPage.claim.open();
      },
    );

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test(
      qase(319, 'Should show tooltip on Bond balance card'),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('Tooltip appears on hover', async () => {
          await expect(claim.bondBalanceCard).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await claim.bondBalanceCardInfoIcon.hover();
          await expect(claim.tooltipWrapper).toHaveCount(1);
          await expect(claim.tooltipWrapper).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
        });

        await test.step('Tooltip describes missing bond requirement', async () => {
          await expect(claim.tooltipWrapper).toContainText(
            "Insufficient bond is the missing amount of stETH required to cover all operator's keys",
          );
        });
      },
    );

    test(
      qase(320, 'Should show correct option descriptions'),
      async ({ widgetService, cmSDK }) => {
        const { claim } = widgetService.bondRewardsPage;
        const bondBalance = await cmSDK.operator.getBondBalance(BigInt(noId));
        const rewards = await cmSDK.getRewards(noId);

        await test.step('"Claim All" is enabled, selected by default, description reflects deficit vs rewards', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA),
          ).toBeEnabled({ timeout: PAGE_WAIT_TIMEOUT });
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA),
          ).toBeChecked();

          const expectedDescription =
            parseFloat(formatEther(bondBalance.delta)) >=
            parseFloat(rewards.available)
              ? 'All Rewards will compensate the Insufficient Bond'
              : 'Compensate the Insufficient Bond and claim Rewards';
          await expect(
            claim.getClaimOptionDescription(CLAIM_OPTION.ALL_TO_RA),
          ).toHaveText(expectedDescription);
        });

        await test.step('"Excess Bond" option is disabled (no excess to claim)', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.BOND_TO_RA),
          ).toBeDisabled();
          await expect(
            claim.getClaimOptionDescription(CLAIM_OPTION.BOND_TO_RA),
          ).toHaveText('Claim only Excess Bond. Rewards remain unclaimed.');
        });

        await test.step('"Rewards to Bond" is enabled, not checked, description reads "Compensate the Insufficient Bond"', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.REWARDS_TO_BOND),
          ).toBeEnabled();
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.REWARDS_TO_BOND),
          ).not.toBeChecked();
          await expect(
            claim.getClaimOptionDescription(CLAIM_OPTION.REWARDS_TO_BOND),
          ).toHaveText('Compensate the Insufficient Bond');
        });
      },
    );

    test(
      qase(321, 'Should show "Compensate" button with compensation amount'),
      async ({ widgetService, cmSDK }) => {
        const { claim } = widgetService.bondRewardsPage;
        const rewards = await cmSDK.getRewards(noId);
        const expected = parseFloat(rewards.available);

        await test.step('"Claim All" option is selected by default', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA),
          ).toBeChecked({ timeout: PAGE_WAIT_TIMEOUT });
        });

        await test.step('Token selector and amount input are not visible', async () => {
          await expect(claim.tokenButtons).not.toBeVisible();
          await expect(claim.amountInput).not.toBeVisible();
        });

        await test.step('"Compensate" button is visible and enabled', async () => {
          await expect(claim.compensateButton).toBeVisible();
          await expect(claim.compensateButton).toBeEnabled();
        });

        await test.step('"Compensation for the Insufficient Bond" row shows rewards amount', async () => {
          await expect(claim.claimBondFormInfo).toContainText(
            'Compensation for the Insufficient Bond',
          );
          const infoText = await claim.claimBondFormInfo
            .getByTestId('tokenAmount')
            .first()
            .textContent();
          expect(Math.abs(parseFloat(infoText ?? '0') - expected)).toBeLessThan(
            0.0002,
          );
        });
      },
    );
  },
);
