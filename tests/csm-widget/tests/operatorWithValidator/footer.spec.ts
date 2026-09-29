import { expect, Locator } from '@playwright/test';
import { widgetFullConfig } from 'tests/csm-widget/config';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { FooterElement } from 'tests/csm-widget/pages/elements/common/element.footer';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

type FooterLinkCase = {
  name: string;
  link: (footer: FooterElement) => Locator;
  event: string;
  url: string;
};

const FOOTER_LINKS: FooterLinkCase[] = [
  {
    name: 'Lido logo',
    link: (footer) => footer.lidoHomeLink,
    event: 'csm_widget_lido_home_link',
    url: 'lido.fi',
  },
  {
    name: 'Terms of Use',
    link: (footer) => footer.termsOfUseLink,
    event: 'csm_widget_footer_terms_of_use_link',
    url: 'lido.fi/terms-of-use',
  },
  {
    name: 'Privacy Notice',
    link: (footer) => footer.privacyNoticeLink,
    event: 'csm_widget_footer_privacy_notice_link',
    url: 'lido.fi/privacy-notice',
  },
  {
    name: 'Feedback form',
    link: (footer) => footer.feedbackFormLink,
    event: 'csm_widget_footer_feedback_form_link',
    url: widgetFullConfig.standConfig.feedbackFormUrl,
  },
  {
    name: 'Discord',
    link: (footer) => footer.discordLink,
    event: 'csm_widget_footer_discord_link',
    url: 'discord.com/invite/lido',
  },
  {
    name: 'Version',
    link: (footer) => footer.versionLink,
    event: 'csm_widget_footer_version_link',
    url: 'github.com/lidofinance/csm-widget',
  },
];

test.describe(
  ...suite({
    epic: EPIC.common,
    story: 'Footer links',
    tag: [Tags.matomo],
  }),
  () => {
    let matomoEventService: MatomoService;

    test.beforeEach(async ({ widgetService, widgetConfig }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.dashboardPage.open();
    });

    test('Should open footer links', async ({ widgetService }) => {
      for (const { name, link, event, url } of FOOTER_LINKS) {
        await test.step(`Open "${name}" and send tracking event`, async () => {
          const footerLink = link(widgetService.footerElement);
          await expect(footerLink).toHaveAttribute('href', new RegExp(url));

          const [openedPage] = await Promise.all([
            widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
            matomoEventService.waitForEvent('e_n', event),
            footerLink.click(),
          ]);

          if (name !== 'Feedback form') {
            expect(openedPage.url()).toContain(url);
          }
          await openedPage.close();
        });
      }
    });
  },
);
