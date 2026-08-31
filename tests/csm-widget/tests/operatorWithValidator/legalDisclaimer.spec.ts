import { expect, Page } from '@playwright/test';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../test.fixture';

const PRIVACY_NOTICE_URL = 'lido.fi/privacy-notice';

test.describe('Legal disclaimer.', { tag: [Tags.matomo] }, async () => {
  let matomoEventService: MatomoService;
  let openedPage: Page | undefined;

  test.beforeEach(async ({ widgetService, widgetConfig }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.dashboardPage.open();
  });

  test.afterEach(async () => {
    await openedPage?.close();
  });

  test('Should open Privacy Notice after click', async ({ widgetService }) => {
    const { legalDisclaimerElement } = widgetService;

    await test.step('Link is visible with correct href', async () => {
      await expect(legalDisclaimerElement.root).toBeVisible();
      await expect(legalDisclaimerElement.privacyNoticeLink).toHaveAttribute(
        'href',
        new RegExp(PRIVACY_NOTICE_URL),
      );
    });

    await test.step('Click to link and waiting for open resource', async () => {
      const [newPage] = await Promise.all([
        widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
        matomoEventService.waitForEvent(
          'e_n',
          'csm_widget_legal_privacy_notice_link',
        ),
        legalDisclaimerElement.privacyNoticeLink.click(),
      ]);
      openedPage = newPage;

      expect(newPage.url()).toContain(PRIVACY_NOTICE_URL);
    });
  });
});
