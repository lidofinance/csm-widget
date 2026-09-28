import { expect } from '@playwright/test';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../test.fixture';

const PRIVACY_NOTICE_URL = 'lido.fi/privacy-notice';

test.describe(
  ...suite({
    epic: EPIC.common,
    story: 'Legal disclaimer',
    tag: [Tags.matomo],
  }),
  () => {
    let matomoEventService: MatomoService;

    test.beforeEach(async ({ widgetService, widgetConfig }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.dashboardPage.open();
    });

    test('Should open Privacy Notice', async ({ widgetService }) => {
      const { legalDisclaimerElement } = widgetService;

      await test.step('Verify link', async () => {
        await expect(legalDisclaimerElement.root).toBeVisible();
        await expect(legalDisclaimerElement.privacyNoticeLink).toHaveAttribute(
          'href',
          new RegExp(PRIVACY_NOTICE_URL),
        );
      });

      await test.step('Open resource and send tracking event', async () => {
        const [openedPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_legal_privacy_notice_link',
          ),
          legalDisclaimerElement.privacyNoticeLink.click(),
        ]);

        expect(openedPage.url()).toContain(PRIVACY_NOTICE_URL);
        await openedPage.close();
      });
    });
  },
);
