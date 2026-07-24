import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/shared/consts/common.const';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../test.fixture';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe('Group page. Group summary.', { tag: [Tags.forked] }, () => {
  test.beforeAll(({ useFork }) => {
    test.skip(!useFork, 'Test suite runs only on forked network');
  });

  test.beforeAll(async ({ widgetService }) => {
    await widgetService.dashboardPage.open();
    await widgetService.groupPage.open();
  });

  test(
    qase(212, 'Should display correct page title and subtitle'),
    async ({ widgetService }) => {
      const { groupPage } = widgetService;

      await test.step('Title contains "Operator Group #"', async () => {
        await expect(groupPage.pageTitle).toContainText('Operator Group #', {
          timeout: STAGE_WAIT_TIMEOUT,
        });
      });

      await test.step('Subtitle describes the group purpose', async () => {
        await expect(groupPage.pageSubtitle).toContainText(
          'View all of the sub-operators within your Node Operator Group',
        );
      });
    },
  );

  test(
    qase(
      213,
      'Should display group summary card with title and both operator cards',
    ),
    async ({ widgetService }) => {
      const { groupPage } = widgetService;
      const { summary } = groupPage;

      await test.step('Group summary card is visible', async () => {
        await expect(summary.root).toBeVisible({ timeout: STAGE_WAIT_TIMEOUT });
      });

      await test.step('Group summary title reads "Group summary"', async () => {
        await expect(summary.title).toHaveText('Group summary');
      });

      await test.step('Exactly 2 operator cards are shown', async () => {
        await expect(groupPage.operatorCards).toHaveCount(2, {
          timeout: STAGE_WAIT_TIMEOUT,
        });
      });
    },
  );

  test(
    qase(214, 'Should display total weight of all operators'),
    async ({ widgetService }) => {
      const { summary } = widgetService.groupPage;

      await expect(summary.totalWeight).toBeVisible({
        timeout: STAGE_WAIT_TIMEOUT,
      });
      await expect(summary.totalWeight).toContainText(/\d+(\.\d+)?/);
    },
  );

  test(
    qase(215, 'Should display all three stake columns with correct labels'),
    async ({ widgetService }) => {
      const { summary } = widgetService.groupPage;

      await test.step('"Active" column', async () => {
        await expect(summary.stakeColumnActive).toBeVisible({
          timeout: STAGE_WAIT_TIMEOUT,
        });
        await expect(summary.stakeColumnActive).toContainText('Active');
      });

      await test.step('"Depositable" column', async () => {
        await expect(summary.stakeColumnDepositable).toBeVisible();
        await expect(summary.stakeColumnDepositable).toContainText(
          'Depositable',
        );
      });

      await test.step('"Potential additional capacity" column', async () => {
        await expect(summary.stakeColumnPotential).toBeVisible();
        await expect(summary.stakeColumnPotential).toContainText(
          'Potential additional capacity',
        );
      });
    },
  );

  test(
    qase(210, 'Should show correct tooltips on stake columns'),
    async ({ widgetService }) => {
      const { summary } = widgetService.groupPage;

      await test.step('"Active" column tooltip', async () => {
        await summary.stakeColumnActiveTooltip.hover();
        await expect(summary.tooltipWrapper).toHaveCount(1);
        await expect(summary.tooltipWrapper).toContainText(
          'The amount of ETH currently staked by the Lido protocol with this Node Operator',
        );
      });

      await test.step('"Depositable" column tooltip', async () => {
        await summary.stakeColumnDepositableTooltip.hover();
        await expect(summary.tooltipWrapper).toHaveCount(1);
        await expect(summary.tooltipWrapper).toContainText(
          'Available capacity ready to receive stake from the Lido protocol',
        );
      });

      await test.step('"Potential additional capacity" column tooltip', async () => {
        await summary.stakeColumnPotentialTooltip.hover();
        await expect(summary.tooltipWrapper).toHaveCount(1);
        await expect(summary.tooltipWrapper).toContainText(
          'The additional stake the Lido protocol could allocate to this Node Operator based on its current weight, assuming enough validator keys are available',
        );
      });
    },
  );
});
