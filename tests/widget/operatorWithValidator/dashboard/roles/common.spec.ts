import { test } from '../../../test.fixture';
import { MatomoService } from 'tests/services/matomo.service';

test.describe('Dashboard. Roles', async () => {
  let matomoEventService: MatomoService;

  test.beforeEach(async ({ widgetService, widgetConfig }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.dashboardPage.open();
  });

  test('Should send event and open Roles page after click to section arrow', async ({
    widgetService,
  }) => {
    const rolesSectionHeaderLink = widgetService.page
      .locator('section')
      .filter({
        has: widgetService.page.getByRole('heading', { name: 'Roles' }),
      })
      .getByTestId('sectionHeaderLink');

    await Promise.all([
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_roles_section',
      ),
      widgetService.page.waitForURL(
        /\/roles\/(manager-address|reward-address)$/,
      ),
      rolesSectionHeaderLink.click(),
    ]);
  });
});
