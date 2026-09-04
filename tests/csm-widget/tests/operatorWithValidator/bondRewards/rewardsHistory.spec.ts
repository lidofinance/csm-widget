import { Download, expect } from '@playwright/test';
import { RPC_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../test.fixture';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/shared/consts/common.const';

test.describe(
  'Bond & Rewards. Rewards History',
  { tag: [Tags.matomo] },
  async () => {
    let matomoEventService: MatomoService;

    test.beforeEach(async ({ widgetService, widgetConfig }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.bondRewardsPage.rewardsHistory.open();
    });

    test(
      qase(421, 'Should export all to CSV'),
      async ({ widgetService, csmSDK }) => {
        const { rewardsHistory } = widgetService.bondRewardsPage;
        let downloadedFile: Download | undefined;

        const nodeOperatorId = await widgetService.extractNodeOperatorId();
        const history = await csmSDK.rewards.getOperatorRewardsHistory(
          BigInt(nodeOperatorId),
        );
        test.skip(history.length === 0, 'No rewards history for this operator');

        await test.step('Rewards history table has rows', async () => {
          await expect(rewardsHistory.rows.first()).toBeVisible({
            timeout: RPC_WAIT_TIMEOUT,
          });
        });

        await test.step('Click to export button and waiting for downloaded file', async () => {
          const [download] = await Promise.all([
            widgetService.page.waitForEvent('download'),
            matomoEventService.waitForEvent(
              'e_n',
              'csm_widget_rewards_history_export',
            ),
            rewardsHistory.exportButton.click(),
          ]);
          downloadedFile = download;
        });

        await test.step('Downloaded file is a rewards history CSV', async () => {
          expect(downloadedFile?.suggestedFilename()).toMatch(
            /^rewards-history.*\.csv$/,
          );
        });
      },
    );
  },
);
