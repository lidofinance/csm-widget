import { Locator, Page } from '@playwright/test';

export class LegalDisclaimerElement {
  page: Page;
  root: Locator;
  privacyNoticeLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.root = this.page.getByTestId('legalDisclaimer');
    this.privacyNoticeLink = this.root.getByTestId('legalPrivacyNoticeLink');
  }
}
