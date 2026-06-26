import { test } from '../../../test.fixture';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { qase } from 'playwright-qase-reporter/playwright';

test.describe('Dashboard. Roles', async () => {
  let matomoEventService: MatomoService;

  test.beforeEach(async ({ widgetService, widgetConfig }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.dashboardPage.open();
  });

  test(
    qase(140, 'Should open Roles page after click to section arrow'),
    async ({ widgetService }) => {
      await Promise.all([
        matomoEventService.waitForEvent(
          'e_n',
          'csm_widget_dashboard_roles_section',
        ),
        widgetService.page.waitForURL(/\/settings\/roles$/),
        widgetService.dashboardPage.rolesSection.sectionHeaderLink.click(),
      ]);
    },
  );
});
