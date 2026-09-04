import { Locator, Page } from '@playwright/test';

export class FooterElement {
  page: Page;
  root: Locator;

  lidoHomeLink: Locator;
  termsOfUseLink: Locator;
  privacyNoticeLink: Locator;
  feedbackFormLink: Locator;
  discordLink: Locator;
  versionLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = this.page.locator('footer');

    this.lidoHomeLink = this.root.getByTestId('lidoHomeLink');
    this.termsOfUseLink = this.root.getByTestId('footerTermsOfUseLink');
    this.privacyNoticeLink = this.root.getByTestId('footerPrivacyNoticeLink');
    this.feedbackFormLink = this.root.getByTestId('footerFeedbackFormLink');
    this.discordLink = this.root.getByTestId('footerDiscordLink');
    this.versionLink = this.root.getByTestId('footerVersionLink');
  }
}
