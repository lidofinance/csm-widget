import { test } from '../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { MatomoService } from '../../../../../shared/services/matomo.service';

test.describe('Dashboard. Bond & Rewards', async () => {
  let matomoEventService: MatomoService;

  test.beforeEach(async ({ widgetService, widgetConfig }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.dashboardPage.open();
  });

  test(
    qase(138, 'Should open Bond & Rewards page after click to section arrow'),
    async ({ widgetService }) => {
      await Promise.all([
        matomoEventService.waitForEvent(
          'e_n',
          'csm_widget_dashboard_bond_section',
        ),
        widgetService.page.waitForURL('**/bond/claim'),
        widgetService.dashboardPage.bondRewards.sectionHeaderLink.click(),
      ]);
    },
  );
});
