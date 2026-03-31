import { test } from '../../../test.fixture';
import { MatomoService } from 'tests/shared/services/matomo.service';

test.describe('Dashboard. Roles', async () => {
  let matomoEventService: MatomoService;

  test.beforeEach(async ({ widgetService, widgetConfig }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.dashboardPage.open();
  });

  test('Should open Roles page after click to section arrow', async ({
    widgetService,
  }) => {
    await Promise.all([
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_roles_section',
      ),
      widgetService.page.waitForURL(
        /\/roles\/(manager-address|reward-address)$/,
      ),
      widgetService.dashboardPage.rolesSection.sectionHeaderLink.click(),
    ]);
  });
});
