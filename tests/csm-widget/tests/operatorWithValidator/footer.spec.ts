import { expect, Locator, Page } from '@playwright/test';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { FooterElement } from 'tests/csm-widget/pages/elements/common/element.footer';
import { test } from '../test.fixture';

type FooterLinkCase = {
  name: string;
  link: (footer: FooterElement) => Locator;
  event: string;
  url: string;
};

const FOOTER_LINKS: FooterLinkCase[] = [
  {
    name: 'Lido logo',
    link: (f) => f.lidoHomeLink,
    event: 'csm_widget_lido_home_link',
    url: 'lido.fi',
  },
  {
    name: 'Terms of Use',
    link: (f) => f.termsOfUseLink,
    event: 'csm_widget_footer_terms_of_use_link',
    url: 'lido.fi/terms-of-use',
  },
  {
    name: 'Privacy Notice',
    link: (f) => f.privacyNoticeLink,
    event: 'csm_widget_footer_privacy_notice_link',
    url: 'lido.fi/privacy-notice',
  },
  {
    name: 'Feedback form',
    link: (f) => f.feedbackFormLink,
    event: 'csm_widget_footer_feedback_form_link',
    url: 'forms.gle',
  },
  {
    name: 'Discord',
    link: (f) => f.discordLink,
    event: 'csm_widget_footer_discord_link',
    url: 'discord.com/invite/lido',
  },
  {
    name: 'version',
    link: (f) => f.versionLink,
    event: 'csm_widget_footer_version_link',
    url: 'github.com/lidofinance/csm-widget',
  },
];

test.describe('Footer. Links.', { tag: [Tags.matomo] }, async () => {
  let matomoEventService: MatomoService;
  let openedPage: Page | undefined;

  test.beforeEach(async ({ widgetService, widgetConfig }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.dashboardPage.open();
  });

  test.afterEach(async () => {
    await openedPage?.close();
  });

  FOOTER_LINKS.forEach(({ name, link, event, url }) => {
    test(`Should open "${name}"`, async ({ widgetService }) => {
      const footerLink = link(widgetService.footerElement);

      await test.step('Link is visible with correct href', async () => {
        await expect(footerLink).toBeVisible();
        await expect(footerLink).toHaveAttribute('href', new RegExp(url));
      });

      await test.step('Click to link and waiting for open resource', async () => {
        const [newPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          matomoEventService.waitForEvent('e_n', event),
          footerLink.click(),
        ]);
        openedPage = newPage;

        // Feedback form is a forms.gle short link, it lands on docs.google.com
        if (name !== 'Feedback form') {
          expect(newPage.url()).toContain(url);
        }
      });
    });
  });
});
