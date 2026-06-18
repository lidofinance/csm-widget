import { Locator, Page } from '@playwright/test';

export class Header {
  page: Page;
  header: Locator;
  accountSection: Locator;
  connectWalletBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = this.page.locator('header');
    this.accountSection = this.header.getByTestId('accountSectionHeader');

    this.connectWalletBtn = this.header.getByText('Connect').first();
  }

  async isAccountSectionVisible() {
    await this.accountSection
      .waitFor({
        state: 'visible',
        timeout: 5000,
      })
      .catch(() => {
        console.error(
          'isAccountSectionVisible: Account section is not visible',
        );
      });
    return this.accountSection.isVisible();
  }
}
