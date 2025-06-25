/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { getReportFrameForLastRewards } from 'tests/helpers/csmContract';
import { countDaysLeft, formatDate } from 'utils/format-date';
import { PAGE_WAIT_TIMEOUT } from 'tests/consts/timeouts';

test.describe('Dashboard. Bond & Rewards. Latest reward distribution section.', async () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.dashboardPage.open();
  });

  test(
    qase(136, 'Should correctly display common information'),
    async ({ widgetService }) => {
      const latestRewardsDistribution =
        widgetService.dashboardPage.bondRewards.latestRewardsDistribution;

      await expect(latestRewardsDistribution.rowHeader).toContainText(
        'Latest rewards distribution',
      );

      const lastRewardInfoFromContract = await getReportFrameForLastRewards();
      await test.step('Verify report frame information', async () => {
        const expectedRateFrame = `Report frame: ${formatDate(lastRewardInfoFromContract?.prevRewards)} — ${formatDate(lastRewardInfoFromContract?.lastRewards)}`;
        await expect(latestRewardsDistribution.rowHeader).toContainText(
          expectedRateFrame,
        );
      });

      await test.step('Verify latest reward amount', async () => {
        const commonBalance =
          await latestRewardsDistribution.commonBalance_Text.textContent();
        expect(commonBalance).toEqual('0.0 stETH');
      });

      await test.step('Verify "Why" link', async () => {
        await latestRewardsDistribution.commonBalance_SubText.click();

        const whyModal = widgetService.dashboardPage.whyModal;
        await whyModal.waitFor({ state: 'visible' });
        const expectedTextContent =
          'There are two main reasons of you getting no reward within a frame:If your validator’s performance was below the threshold within the CSM Performance Oracle frame (7 days for testnet) the validator does not receive rewards for the given frame. Read more about the CSM Performance Oracle.Your Node Operator has stuck keys due to not exiting a validator requested for exit timely.';
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
    async ({ widgetService, widgetConfig }) => {
      const latestRewardsDistribution =
        widgetService.dashboardPage.bondRewards.latestRewardsDistribution;

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
  test.skip(
    qase(144, 'Tooltip verification for "Stuck keys found" field'),
    async () => {},
  );
  test(
    qase(137, 'Upcoming Rewards Distribution Verification'),
    async ({ widgetService }) => {
      const latestRewardsDistribution =
        widgetService.dashboardPage.bondRewards.latestRewardsDistribution;

      await latestRewardsDistribution.expand();

      const lastRewardInfoFromContract = await getReportFrameForLastRewards();
      await test.step('Verify "Next rewards distribution" info', async () => {
        await expect(
          latestRewardsDistribution.nextRewardsInfo.getByText(
            'Next rewards distribution',
          ),
        ).toBeVisible();

        await test.step('Verify report frame information', async () => {
          const expectedRateFrame = `Report frame: ${formatDate(lastRewardInfoFromContract?.lastRewards)} — ${formatDate(lastRewardInfoFromContract?.nextRewards)}`;
          await expect(latestRewardsDistribution.reportFrame).toContainText(
            expectedRateFrame,
          );
        });
      });

      await test.step('Verify expected days for reward', async () => {
        const expectedDays = countDaysLeft(
          lastRewardInfoFromContract?.nextRewards,
        );
        await expect(latestRewardsDistribution.expectedDays).toContainText(
          `Expected`,
        );
        if (expectedDays === 0) {
          await expect(latestRewardsDistribution.expectedDays).toContainText(
            `Today`,
          );
        } else {
          await expect(latestRewardsDistribution.expectedDays).toContainText(
            `in ${expectedDays} day`,
          );
        }
      });
    },
  );
});
