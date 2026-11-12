/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { qase } from 'playwright-qase-reporter/playwright';
import { formatDate } from 'utils/format-date';
import { formatEther } from 'viem';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.dashboard,
    feature: 'Bond & Rewards',
    story: 'Latest reward distribution',
  }),
  async () => {
    let snapshotId: string;

    test.beforeAll(async ({ csmSDK, forkActionService, widgetService }) => {
      snapshotId = await csmSDK.evmSnapshot();

      await test.step('Set up: report rewards', async () => {
        await widgetService.dashboardPage.open();
        await forkActionService.reportRewards();
      });
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.dashboardPage.open();
    });

    test(
      qase(136, 'Should correctly display common information'),
      async ({ widgetService, csmSDK }) => {
        const { claimCard } = widgetService.dashboardPage;

        const nodeOperatorId = await widgetService.extractNodeOperatorId();
        const lastRewards = await csmSDK.rewards.getOperatorRewardsInLastReport(
          BigInt(nodeOperatorId),
        );
        test.skip(
          !lastRewards,
          'No rewards in the last report for this operator',
        );

        await test.step('Verify latest distribution value', async () => {
          await expect(claimCard.lastRewardsBlock).toContainText(
            'Latest distribution',
          );
          const expected = Number(
            formatEther((lastRewards as { distributed: bigint }).distributed),
          );
          if (expected === 0) {
            await expect(claimCard.latestValue).toContainText('0');
          } else {
            await expect(claimCard.latestValue).toContainText(/\+\d/);
            const text = (await claimCard.latestValue.textContent()) ?? '';
            const actual = parseFloat(text.replace(/[+,]/g, ''));
            expect(Math.abs(actual - expected)).toBeLessThan(0.1);
          }
        });

        await test.step('Verify report frame', async () => {
          const timestamps = await csmSDK.rewards.getLastReportTimestamps();
          const { lastReport } = await csmSDK.frame.getInfo();
          await expect(claimCard.reportFrame).toHaveText(
            `${formatDate(timestamps?.start)} — ${formatDate(lastReport)}`,
          );
        });
      },
    );

    test(
      qase(432, 'Should show "Why" modal when operator got no rewards'),
      async ({ widgetService, csmSDK }) => {
        const { claimCard } = widgetService.dashboardPage;

        const nodeOperatorId = await widgetService.extractNodeOperatorId();
        const lastRewards = await csmSDK.rewards.getOperatorRewardsInLastReport(
          BigInt(nodeOperatorId),
        );
        test.skip(
          !lastRewards || lastRewards.distributed !== 0n,
          'Operator did not have zero rewards in the last report',
        );

        await test.step('Verify "Why" modal', async () => {
          await claimCard.whyLink.click();

          const { whyModal } = widgetService.dashboardPage;
          await whyModal.waitFor({ state: 'visible' });
          await expect(whyModal).toContainText('Why didn’t I get rewards?');
          await expect(whyModal).toContainText(
            'There are main reason of you getting no reward within a frame:',
          );
          await expect(whyModal).toContainText(
            'If your validator’s performance was below the threshold within the CSM Performance Oracle frame the validator does not receive rewards for the given frame. Read more about the CSM Performance Oracle.',
          );
        });

        await test.step('Verify closing modal', async () => {
          const { whyModal } = widgetService.dashboardPage;
          await whyModal.getByRole('button').click();
          await whyModal.waitFor({ state: 'hidden' });
        });
      },
    );

    test(
      qase(188, 'Should correctly open etherscan by link'),
      async ({ widgetService, widgetConfig, csmSDK }) => {
        const { claimCard } = widgetService.dashboardPage;

        const txHash = await csmSDK.rewards.getLastReportTransactionHash();
        test.skip(
          !txHash,
          'Latest rewards distribution transaction hash is not available',
        );

        const [etherscanPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          claimCard.distributionTxLink.click(),
        ]);
        expect(etherscanPage.url()).toContain(
          `${widgetConfig.standConfig.networkConfig.scan}tx/`,
        );
      },
    );

    test(
      qase(143, 'Tooltip verification for "Keys over threshold" field'),
      async ({ widgetService, csmSDK }) => {
        const { claimCard } = widgetService.dashboardPage;

        const nodeOperatorId = await widgetService.extractNodeOperatorId();
        const lastRewards = await csmSDK.rewards.getOperatorRewardsInLastReport(
          BigInt(nodeOperatorId),
        );
        test.skip(
          !lastRewards?.validatorsCount,
          'No keys in the last report for this operator',
        );

        await test.step('Check tooltip content', async () => {
          const info = await claimCard.hoverLastRewardsInfo();
          await expect(info).toContainText('Keys over threshold');
        });

        await test.step('Check to hidden tooltip after unhover', async () => {
          await widgetService.dashboardPage.closeTooltip();
          await expect(claimCard.lastRewardsInfo).toBeHidden();
        });
      },
    );

    test(
      qase(137, 'Upcoming Rewards Distribution Verification'),
      async ({ widgetService, csmSDK }) => {
        const { claimCard } = widgetService.dashboardPage;

        const { lastReport, nextReport } = await csmSDK.frame.getInfo();
        const timestamps = await csmSDK.rewards.getLastReportTimestamps();
        test.skip(!timestamps, 'No report yet');

        await test.step('Verify "Next distribution" info', async () => {
          await expect(claimCard.nextRewardsInfo).toContainText(
            'Next distribution',
          );
          await expect(claimCard.expectedDays).toHaveText(
            /^(Today|In ~\d+ days?|Distribution is delayed)$/,
          );
          await expect(claimCard.nextReportFrame).toHaveText(
            `${formatDate(lastReport)} — ${formatDate(nextReport)}`,
          );
        });
      },
    );
  },
);
