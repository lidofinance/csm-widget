import { expect, Locator } from '@playwright/test';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../test.fixture';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';
import { FooterElement } from 'tests/cm-widget/pages/elements/common/element.footer';

test.use({ secretPhrase: PRESETS.ONLY_OPERATOR.secretPhrase });

type FooterLinkCase = {
  name: string;
  link: (footer: FooterElement) => Locator;
  event: string;
  url: string;
};

const FOOTER_LINKS: FooterLinkCase[] = [
  {
    name: 'Terms of Use',
    link: (f) => f.termsOfUseLink,
    event: 'cm_widget_footer_terms_of_use_link',
    url: 'lido.fi/terms-of-use',
  },
  {
    name: 'Privacy Notice',
    link: (f) => f.privacyNoticeLink,
    event: 'cm_widget_footer_privacy_notice_link',
    url: 'lido.fi/privacy-notice',
  },
  {
    name: 'Feedback form',
    link: (f) => f.feedbackFormLink,
    event: 'cm_widget_footer_feedback_form_link',
    url: 'forms.gle',
  },
  {
    name: 'Discord',
    link: (f) => f.discordLink,
    event: 'cm_widget_footer_discord_link',
    url: 'discord.com/invite/lido',
  },
  {
    name: 'version',
    link: (f) => f.versionLink,
    event: 'cm_widget_footer_version_link',
    url: 'github.com/lidofinance/csm-widget',
  },
];

test.describe('Footer.', { tag: [Tags.forked, Tags.matomo] }, () => {
  let matomoEventService: MatomoService;

  test.beforeEach(async ({ widgetConfig, widgetService }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.dashboardPage.open();
  });

  test('Should open footer links', async ({ widgetService }) => {
    const { footerElement } = widgetService;

    for (const { name, link, event, url } of FOOTER_LINKS) {
      await test.step(`Click to "${name}" link and waiting for open resource`, async () => {
        await expect(link(footerElement)).toBeVisible();
        await expect(link(footerElement)).toHaveAttribute(
          'href',
          new RegExp(url),
        );

        const [newPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          matomoEventService.waitForEvent('e_n', event),
          link(footerElement).click(),
        ]);

        if (name !== 'Feedback form') {
          expect(newPage.url()).toContain(url);
        }
      });
    }
  });
});
