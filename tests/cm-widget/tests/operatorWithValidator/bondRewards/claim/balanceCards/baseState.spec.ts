import { expect } from '@playwright/test';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../../../test.fixture';

test.describe('Bond & Rewards. Claim. Balance cards. Base state.', () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.bondRewardsPage.claim.open();
  });

  test('Should display both balance cards with correct titles', async ({
    widgetService,
  }) => {
    const { claim } = widgetService.bondRewardsPage;

    await test.step('Rewards balance card is visible with correct title', async () => {
      await expect(claim.rewardsBalanceCard).toBeVisible({
        timeout: STAGE_WAIT_TIMEOUT,
      });
      await expect(claim.rewardsBalanceCard).toContainText('Rewards balance');
    });

    await test.step('Bond balance card is visible with "Excess bond" title', async () => {
      await expect(claim.bondBalanceCard).toBeVisible();
      await expect(claim.bondBalanceCard).toContainText('Excess bond');
    });
  });

  test('Should show correct tooltip for Rewards balance info icon', async ({
    widgetService,
  }) => {
    const { claim } = widgetService.bondRewardsPage;

    await test.step('Tooltip appears on hover', async () => {
      await claim.rewardsBalanceCardInfoIcon.hover();
      await expect(claim.tooltipWrapper).toHaveCount(1);
      await expect(claim.tooltipWrapper).toBeVisible({
        timeout: STAGE_WAIT_TIMEOUT,
      });
    });

    await test.step('Tooltip describes rewards distribution schedule', async () => {
      await expect(claim.tooltipWrapper).toContainText(
        'The rewards amount available to claim, obtained from all active validators of the Node Operator. Next rewards distribution is expected',
      );
    });
  });

  test('Should show correct tooltip for Bond balance info icon when bond is in excess', async ({
    widgetService,
  }) => {
    const { claim } = widgetService.bondRewardsPage;

    await test.step('Tooltip appears on hover', async () => {
      await claim.bondBalanceCardInfoIcon.hover();
      await expect(claim.tooltipWrapper).toHaveCount(1);
      await expect(claim.tooltipWrapper).toBeVisible({
        timeout: STAGE_WAIT_TIMEOUT,
      });
    });

    await test.step('Tooltip describes claimable excess bond without exit', async () => {
      await expect(claim.tooltipWrapper).toContainText(
        'The bond amount available to claim without having to exit validators. Increases daily',
      );
    });
  });
});
