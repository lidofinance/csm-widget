import { expect } from '@playwright/test';
import { RPC_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { qase } from 'playwright-qase-reporter/playwright';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.bondRewards,
    // a single spec on its own surface, so no feature level
    feature: null,
    story: 'Rewards history',
  }),
  async () => {
    let snapshotId: string;

    test.beforeAll(async ({ csmSDK, forkActionService, widgetService }) => {
      snapshotId = await csmSDK.evmSnapshot();

      await test.step('Set up: report rewards', async () => {
        await widgetService.bondRewardsPage.hub.open();
        await forkActionService.reportRewards();
      });
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    let matomoEventService: MatomoService;

    test.beforeEach(async ({ widgetService, widgetConfig }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.bondRewardsPage.hub.open();
      await widgetService.bondRewardsPage.hub.exportButton.waitFor({
        state: 'visible',
        timeout: RPC_WAIT_TIMEOUT,
      });
    });

    test(
      qase(
        421,
        'Should send analytics event after click to "Export all to CSV"',
      ),
      async ({ widgetService }) => {
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_rewards_history_export',
          ),
          widgetService.bondRewardsPage.hub.exportButton.click(),
        ]);
      },
    );

    test('Should show rewards table with sortable columns', async ({
      widgetService,
    }) => {
      const { hub } = widgetService.bondRewardsPage;

      await test.step('Rewards rows are shown', async () => {
        await expect(hub.rewardsRows.first()).toBeVisible();
      });

      await test.step('Date period header toggles sort', async () => {
        const header = hub.historyTable.getByRole('columnheader', {
          name: 'Date period',
        });
        const before = await header.getAttribute('aria-sort');
        await header.getByRole('button').click();
        await expect(header).not.toHaveAttribute('aria-sort', before ?? '');
      });
    });

    test('Should redirect to hub from legacy url', async ({
      widgetService,
    }) => {
      await widgetService.page.goto('/bond/rewards-history');
      await expect(widgetService.page).toHaveURL(/\/bond$/);
    });
  },
);
