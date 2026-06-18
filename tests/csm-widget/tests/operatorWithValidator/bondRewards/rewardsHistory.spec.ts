import { test } from '../../test.fixture';
import { MatomoService } from 'tests/shared/services/matomo.service';

test.describe('Bond & Rewards. Rewards History', async () => {
  let matomoEventService: MatomoService;

  test.beforeEach(async ({ widgetService, widgetConfig }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.page.goto('/bond/rewards-history');
    await widgetService.page
      .getByRole('button', { name: 'Export all to CSV' })
      .waitFor({ state: 'visible' });
  });

  test('Should send analytics event after click to "Export all to CSV"', async ({
    widgetService,
  }) => {
    await Promise.all([
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_rewards_history_export',
      ),
      widgetService.page
        .getByRole('button', { name: 'Export all to CSV' })
        .click(),
    ]);
  });
});
