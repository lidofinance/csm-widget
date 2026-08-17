import { expect } from '@playwright/test';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../test.fixture';

const PRIVACY_NOTICE_URL = 'lido.fi/privacy-notice';

test.describe('Legal disclaimer.', async () => {
  let matomoEventService: MatomoService;

  test.beforeEach(async ({ widgetService, widgetConfig }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.dashboardPage.open();
  });

  test('Should open Privacy Notice after click', async ({ widgetService }) => {
    const { legalDisclaimerElement } = widgetService;

    await expect(legalDisclaimerElement.root).toBeVisible();
    await expect(legalDisclaimerElement.privacyNoticeLink).toHaveAttribute(
      'href',
      new RegExp(PRIVACY_NOTICE_URL),
    );

    const [privacyNoticePage] = await Promise.all([
      widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_legal_privacy_notice_link',
      ),
      legalDisclaimerElement.privacyNoticeLink.click(),
    ]);

    expect(privacyNoticePage.url()).toContain(PRIVACY_NOTICE_URL);
  });
});
