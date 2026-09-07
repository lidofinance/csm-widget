import { Locator, Page, test } from '@playwright/test';

export class Header {
  page: Page;
  header: Locator;
  accountSection: Locator;
  connectWalletBtn: Locator;
  switchOperatorButton: Locator;
  disconnectBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = this.page.locator('header');
    this.accountSection = this.header.getByTestId('accountSectionHeader');

    this.connectWalletBtn = this.header.getByText('Connect').first();
    this.switchOperatorButton = this.header.getByTestId('nodeOperatorHeader');
    this.disconnectBtn = this.page
      .locator('[role=dialog]')
      .getByTestId('disconnectBtn');
  }

  async isAccountSectionVisible() {
    await this.accountSection
      .waitFor({
        state: 'visible',
        timeout: 8000,
      })
      .catch(() => {
        console.error(
          'isAccountSectionVisible: Account section is not visible',
        );
      });
    return this.accountSection.isVisible();
  }

  async disconnectWallet() {
    await test.step('Disconnect the wallet from the account modal', async () => {
      await this.accountSection.click();
      await this.disconnectBtn.click();
    });
  }
}
