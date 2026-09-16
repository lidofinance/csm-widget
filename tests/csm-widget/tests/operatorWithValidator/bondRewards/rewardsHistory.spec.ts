import { RPC_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { qase } from 'playwright-qase-reporter/playwright';

test.describe(
  ...suite({
    epic: EPIC.bondRewards,
    // a single spec on its own surface, so no feature level
    feature: null,
    story: 'Rewards history',
  }),
  async () => {
    let matomoEventService: MatomoService;

    test.beforeEach(async ({ widgetService, widgetConfig }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.page.goto('/bond/rewards-history');
      await widgetService.page
        .getByRole('button', { name: 'Export all to CSV' })
        .waitFor({ state: 'visible', timeout: RPC_WAIT_TIMEOUT });
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
          widgetService.page
            .getByRole('button', { name: 'Export all to CSV' })
            .click(),
        ]);
      },
    );
  },
);
