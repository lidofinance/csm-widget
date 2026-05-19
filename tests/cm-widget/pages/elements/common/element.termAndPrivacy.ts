import { Locator, Page } from '@playwright/test';

export class TermAndPrivacy {
  page: Page;
  termAndPrivacy: Locator;

  constructor(page: Page) {
    this.page = page;
    this.termAndPrivacy = this.page
      .locator('div[role="dialog"]')
      .getByText('I certify that I have read and accept the updated');
  }

  async isTermOfUseAndPrivacyChecked() {
    return this.page
      .locator('div[role="dialog"]')
      .locator('input[type=checkbox]')
      .isChecked();
  }

  async confirmConditionWalletModal() {
    await this.termAndPrivacy.check();
  }
}
