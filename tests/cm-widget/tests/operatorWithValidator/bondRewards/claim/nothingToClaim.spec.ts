import { expect } from '@playwright/test';
import { Tags } from 'tests/shared/consts/common.const';
import { qase } from 'playwright-qase-reporter/playwright';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../../test.fixture';
import { formatEther } from 'viem';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const ONE_ETH = 1_000_000_000_000_000_000n;

test.describe(
  'Bond & Rewards. Claim. Nothing to claim. Base state.',
  { tag: [Tags.forked] },
  () => {
    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.bondRewardsPage.claim.open();
    });

    test(
      qase(322, 'Should show empty state with zero balances'),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('Rewards balance card shows 0.0 stETH', async () => {
          await expect(claim.rewardsBalanceCard).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await expect(claim.rewardsBalanceCard).toContainText('0.0 stETH');
        });

        await test.step('Bond balance card shows "Excess bond" with 0.0 stETH', async () => {
          await expect(claim.bondBalanceCard).toBeVisible();
          await expect(claim.bondBalanceCard).toContainText('Excess bond');
          await expect(claim.bondBalanceCard).toContainText('0.0 stETH');
        });

        await test.step('"Nothing to claim at the moment" empty state is shown', async () => {
          await expect(claim.claimEmptyState).toBeVisible();
          await expect(claim.claimEmptyState).toContainText(
            'Nothing to claim at the moment',
          );
        });

        await test.step('Claim options, token selector and claim button are not shown', async () => {
          await expect(claim.claimOptionSection).not.toBeVisible();
          await expect(claim.tokenButtons).not.toBeVisible();
          await expect(claim.claimButton).not.toBeVisible();
        });
      },
    );

    test(
      qase(323, 'Should show Rewards balance card tooltip'),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('Tooltip appears on hover', async () => {
          await claim.rewardsBalanceCardInfoIcon.hover();
          await expect(claim.tooltipWrapper).toHaveCount(1);
          await expect(claim.tooltipWrapper).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
        });

        await test.step('Tooltip describes rewards distribution schedule', async () => {
          await expect(claim.tooltipWrapper).toContainText(
            'The rewards amount available to claim, obtained from all active validators of the Node Operator. Next rewards distribution is expected',
          );
        });
      },
    );

    test(
      qase(324, 'Should show Bond balance card tooltip in excess state'),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('Tooltip appears on hover', async () => {
          await claim.bondBalanceCardInfoIcon.hover();
          await expect(claim.tooltipWrapper).toHaveCount(1);
          await expect(claim.tooltipWrapper).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
        });

        await test.step('Tooltip describes claimable excess bond without exit', async () => {
          await expect(claim.tooltipWrapper).toContainText(
            'The bond amount available to claim without having to exit validators. Increases daily',
          );
        });
      },
    );
  },
);

test.describe(
  'Bond & Rewards. Claim. Nothing to claim. Insufficient bond state.',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeEach(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await test.step('Set up: make bond insufficient via penalty + settle (no rewards)', async () => {
        await widgetService.bondRewardsPage.claim.open();
        const noId = await widgetService.extractNodeOperatorId();
        // delta = 0 in base state → penalty of 1 ETH makes bond insufficient by 1 ETH
        const bondBalance = await cmSDK.operator.getBondBalance(BigInt(noId));
        const penaltyAmount = formatEther(bondBalance.delta + ONE_ETH);
        await forkActionService.reportPenalty(noId, penaltyAmount);
        await forkActionService.settlePenalty(noId);
      });

      await widgetService.bondRewardsPage.claim.open();
    });

    test.afterEach(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test(
      qase(325, 'Should show empty state with "Insufficient bond" card'),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('Rewards balance card shows 0.0 stETH', async () => {
          await expect(claim.rewardsBalanceCard).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await expect(claim.rewardsBalanceCard).toContainText('0.0 stETH');
        });

        await test.step('Bond balance card shows "Insufficient bond" title', async () => {
          await expect(claim.bondBalanceCard).toBeVisible();
          await expect(claim.bondBalanceCard).toContainText(
            'Insufficient bond',
          );
        });

        await test.step('"Nothing to claim at the moment" empty state is shown', async () => {
          await expect(claim.claimEmptyState).toBeVisible();
          await expect(claim.claimEmptyState).toContainText(
            'Nothing to claim at the moment',
          );
        });

        await test.step('Claim options, token selector and claim button are not shown', async () => {
          await expect(claim.claimOptionSection).not.toBeVisible();
          await expect(claim.tokenButtons).not.toBeVisible();
          await expect(claim.claimButton).not.toBeVisible();
        });
      },
    );
  },
);
