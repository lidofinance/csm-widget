/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { formatBalance } from 'utils/format-balance';
import {
  countCalendarDaysLeft,
  formatDate,
  isDayInPast,
} from 'utils/format-date';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';

test.describe('Dashboard. Bond & Rewards. Latest reward distribution section.', async () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.dashboardPage.open();
  });

  test(
    qase(136, 'Should correctly display common information'),
    async ({ widgetService, csmSDK }) => {
      const latestRewardsDistribution =
        widgetService.dashboardPage.bondRewards.latestRewardsDistribution;

      const nodeOperatorId = await widgetService.extractNodeOperatorId();
      const lastRewards = await csmSDK.rewards.getOperatorRewardsInLastReport(
        BigInt(nodeOperatorId),
      );
      test.skip(
        !lastRewards,
        'No rewards in the last report for this operator',
      );

      await expect(latestRewardsDistribution.rowHeader).toContainText(
        'Latest rewards distribution',
      );

      await test.step('Verify report frame information', async () => {
        const timestamps = await csmSDK.rewards.getLastReportTimestamps();
        const { lastReport } = await csmSDK.frame.getInfo();
        const expectedFrame = `Report frame: ${formatDate(timestamps?.start)} — ${formatDate(lastReport)}`;
        await expect(latestRewardsDistribution.rowHeader).toContainText(
          expectedFrame,
        );
      });

      await test.step('Verify latest reward amount', async () => {
        // @ts-expect-error lastRewards is checked by test.skip
        const expectedBalance = `${formatBalance(lastRewards.distributed).trimmed}\u00A0stETH`;
        const commonBalance =
          await latestRewardsDistribution.commonBalance_Text.textContent();
        expect(commonBalance).toEqual(expectedBalance);
      });
    },
  );

  test(
    qase(432, 'Should show "Why" modal when operator got no rewards'),
    async ({ widgetService, csmSDK }) => {
      const latestRewardsDistribution =
        widgetService.dashboardPage.bondRewards.latestRewardsDistribution;

      const nodeOperatorId = await widgetService.extractNodeOperatorId();
      const lastRewards = await csmSDK.rewards.getOperatorRewardsInLastReport(
        BigInt(nodeOperatorId),
      );
      test.skip(
        !lastRewards || lastRewards.distributed !== 0n,
        'Operator did not have zero rewards in the last report',
      );

      await test.step('Verify "Why" link', async () => {
        await latestRewardsDistribution.commonBalance_SubText.click();

        const whyModal = widgetService.dashboardPage.whyModal;
        await whyModal.waitFor({ state: 'visible' });
        const expectedTextContent =
          'Why didn’t I get rewards?There are main reason of you getting no reward within a frame:If your validator’s performance was below the threshold within the CSM Performance Oracle frame the validator does not receive rewards for the given frame. Read more about the CSM Performance Oracle.';
        await expect(whyModal).toContainText('Why didn’t I get rewards?');
        await expect(whyModal).toContainText(expectedTextContent);
      });

      await test.step('Verify closing modal', async () => {
        const whyModal = widgetService.dashboardPage.whyModal;
        await whyModal.getByRole('button').click();
        await whyModal.waitFor({ state: 'hidden' });
      });
    },
  );

  test(
    qase(188, 'Should correctly open etherscan by link'),
    async ({ widgetService, widgetConfig, csmSDK }) => {
      const latestRewardsDistribution =
        widgetService.dashboardPage.bondRewards.latestRewardsDistribution;

      const txHash = await csmSDK.rewards.getLastReportTransactionHash();
      test.skip(
        !txHash,
        'Latest rewards distribution transaction hash is not available',
      );

      await latestRewardsDistribution.expand();
      const [etherscanPage] = await Promise.all([
        widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
        latestRewardsDistribution.lastRewardsInfo
          .getByText('View on Etherscan')
          .click(),
      ]);
      expect(etherscanPage.url()).toContain(
        `${widgetConfig.standConfig.networkConfig.scan}tx/`,
      );
    },
  );

  test.skip(
    qase(143, 'Tooltip verification for "Keys over threshold" field'),
    async () => {},
  );
  test(
    qase(137, 'Upcoming Rewards Distribution Verification'),
    async ({ widgetService, csmSDK }) => {
      const latestRewardsDistribution =
        widgetService.dashboardPage.bondRewards.latestRewardsDistribution;

      const { lastReport, nextReport } = await csmSDK.frame.getInfo();
      const timestamps = await csmSDK.rewards.getLastReportTimestamps();
      test.skip(
        !timestamps || isDayInPast(nextReport),
        'No report yet or oracle report is delayed',
      );

      await latestRewardsDistribution.expand();

      await test.step('Verify "Next rewards distribution" info', async () => {
        await expect(
          latestRewardsDistribution.nextRewardsInfo.getByText(
            'Next rewards distribution',
          ),
        ).toBeVisible();

        await test.step('Verify report frame information', async () => {
          const expectedFrame = `Report frame: ${formatDate(lastReport)} — ${formatDate(nextReport)}`;
          await expect(latestRewardsDistribution.reportFrame).toContainText(
            expectedFrame,
          );
        });
      });

      await test.step('Verify expected days for reward', async () => {
        const expectedDays = countCalendarDaysLeft(nextReport);
        const expectedDaysText =
          expectedDays === 0
            ? 'Today'
            : `in ${expectedDays} ${expectedDays === 1 ? 'day' : 'days'}`;

        await expect(
          latestRewardsDistribution.nextRewardsInfo.getByText('Expected'),
        ).toBeVisible();
        await expect(latestRewardsDistribution.expectedDays).toContainText(
          expectedDaysText,
        );
      });
    },
  );
});
