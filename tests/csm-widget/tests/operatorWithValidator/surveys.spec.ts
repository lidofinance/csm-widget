import { expect, Page } from '@playwright/test';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../test.fixture';

const VANOM_DASHBOARD_URL = 'app.hex.tech';

test.describe('Surveys. Sign in', { tag: [Tags.matomo] }, async () => {
  let matomoEventService: MatomoService;
  let openedPage: Page | undefined;

  test.beforeAll(async ({ widgetService }) => {
    await test.step('Enable surveys feature flag', async () => {
      await widgetService.setFeatureFlag('surveysSetupEnabled', true);
    });
  });

  test.beforeEach(async ({ widgetService, widgetConfig }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.surveysPage.open();
  });

  test.afterEach(async () => {
    await openedPage?.close();
  });

  test('Should open VaNOM dashboard', async ({ widgetService }) => {
    const { surveysPage } = widgetService;

    await test.step('Link is visible with correct href', async () => {
      await expect(surveysPage.vanomDashboardLink).toBeVisible();
      await expect(surveysPage.vanomDashboardLink).toHaveAttribute(
        'href',
        new RegExp(VANOM_DASHBOARD_URL),
      );
    });

    await test.step('Click to link and waiting for open resource', async () => {
      const [newPage] = await Promise.all([
        surveysPage.waitForPage(PAGE_WAIT_TIMEOUT),
        matomoEventService.waitForEvent(
          'e_n',
          'csm_widget_vanom_dashboard_link',
        ),
        surveysPage.vanomDashboardLink.click(),
      ]);
      openedPage = newPage;

      expect(newPage.url()).toContain(VANOM_DASHBOARD_URL);
    });
  });
});
