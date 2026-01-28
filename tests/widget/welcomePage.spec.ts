import { WelcomePage } from 'tests/pages';
import { test } from './test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { MatomoService } from 'tests/services/matomo.service';
import { PAGE_WAIT_TIMEOUT } from 'tests/consts/timeouts';
import { expect } from '@playwright/test';

test.describe('Welcome page without connected wallet', async () => {
  let matomoEventService: MatomoService;

  test.beforeEach(async ({ page, widgetConfig }) => {
    matomoEventService = new MatomoService(page, widgetConfig);
  });

  test(
    qase(57, 'Should open connect modal after click to "I am a Node Operator"'),
    async ({ page, widgetConfig }) => {
      const homePage = new WelcomePage(page);

      await Promise.all([
        matomoEventService.waitForEvent('e_n', 'csm_widget_view_welcome_page'),
        matomoEventService.waitForEvent(
          'url',
          widgetConfig.standConfig.standUrl,
        ),
        homePage.goto(),
      ]);

      await Promise.all([
        matomoEventService.waitForEvent(
          'e_n',
          'csm_widget_connect_wallet_as_no',
        ),
        homePage.welcomeSection.iAmANodeOperatorBtn.click(),
      ]);

      await homePage.connectWalletModal.modal.waitFor({ state: 'visible' });
    },
  );

  test(
    qase(
      58,
      'Should open connect modal after click to "Become a Node Operator"',
    ),
    async ({ page }) => {
      const homePage = new WelcomePage(page);
      await homePage.goto();

      await Promise.all([
        matomoEventService.waitForEvent(
          'e_n',
          'csm_widget_connect_wallet_to_become_no',
        ),
        homePage.welcomeSection.becomeANodeOperatorBtn.click(),
      ]);

      await homePage.connectWalletModal.modal.waitFor({ state: 'visible' });
    },
  );

  test(
    qase(406, 'Should open detailed link for docs after click'),
    async ({ page }) => {
      const homePage = new WelcomePage(page);
      await homePage.goto();

      const [detailedLink] = await Promise.all([
        homePage.waitForPage(PAGE_WAIT_TIMEOUT),
        matomoEventService.waitForEvent(
          'e_n',
          'csm_widget_welcome_csm_detailed_link',
        ),
        homePage.welcomeSection.detailedLink.click(),
      ]);

      expect(detailedLink.url().toLowerCase()).toContain(
        `https://operatorportal.lido.fi/modules/community-staking-module`,
      );
    },
  );
});
