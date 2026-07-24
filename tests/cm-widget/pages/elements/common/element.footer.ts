import { Locator, Page } from '@playwright/test';

export class FooterElement {
  page: Page;
  root: Locator;

  termsOfUseLink: Locator;
  privacyNoticeLink: Locator;
  feedbackFormLink: Locator;
  discordLink: Locator;
  versionLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = this.page.locator('footer');

    // TODO: switch to data-testid (footer*Link) once deployed to the stand
    this.termsOfUseLink = this.root.getByRole('link', {
      name: 'Terms of Use',
      exact: true,
    });
    this.privacyNoticeLink = this.root.getByRole('link', {
      name: 'Privacy Notice',
      exact: true,
    });
    this.feedbackFormLink = this.root.getByRole('link', {
      name: 'Feedback form',
      exact: true,
    });
    this.discordLink = this.root.getByRole('link', {
      name: 'Discord',
      exact: true,
    });
    this.versionLink = this.root.locator(
      'a[href*="github.com/lidofinance/csm-widget"]',
    );
  }
}
