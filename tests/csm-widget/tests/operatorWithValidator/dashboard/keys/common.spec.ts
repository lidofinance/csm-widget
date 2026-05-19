import { test } from '../../../test.fixture';
import { MatomoService } from 'tests/shared/services/matomo.service';

test.describe('Dashboard. Keys', async () => {
  let matomoEventService: MatomoService;

  test.beforeEach(async ({ widgetService, widgetConfig }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.dashboardPage.open();
  });

  test('Should open Keys page after click to section arrow', async ({
    widgetService,
  }) => {
    await Promise.all([
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_keys_section',
      ),
      widgetService.page.waitForURL('**/keys/view'),
      widgetService.dashboardPage.keysSection.sectionHeaderLink.click(),
    ]);
  });
});
