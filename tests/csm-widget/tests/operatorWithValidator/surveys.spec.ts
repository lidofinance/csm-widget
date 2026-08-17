import { expect } from '@playwright/test';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../test.fixture';

const VANOM_DASHBOARD_URL = 'app.hex.tech';

test.describe('Surveys. Sign in', async () => {
  let matomoEventService: MatomoService;

  test.beforeAll(async ({ widgetService }) => {
    await test.step('Enable surveys feature flag', async () => {
      await widgetService.setFeatureFlag('surveysSetupEnabled', true);
    });
  });

  test.beforeEach(async ({ widgetService, widgetConfig }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.surveysPage.open();
  });

  test('Should open VaNOM dashboard after click', async ({ widgetService }) => {
    const { surveysPage } = widgetService;

    await expect(surveysPage.vanomDashboardLink).toBeVisible();
    await expect(surveysPage.vanomDashboardLink).toHaveAttribute(
      'href',
      new RegExp(VANOM_DASHBOARD_URL),
    );

    const [vanomPage] = await Promise.all([
      surveysPage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent('e_n', 'csm_widget_vanom_dashboard_link'),
      surveysPage.vanomDashboardLink.click(),
    ]);

    expect(vanomPage.url()).toContain(VANOM_DASHBOARD_URL);
  });
});
