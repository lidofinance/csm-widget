import { Locator, Page } from '@playwright/test';

export class ConnectWalletModal {
  page: Page;
  modal: Locator;
  termOfUseAndPrivacyCheckBox: Locator;
  moreWallets: Locator;
  lessWallets: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = this.page.locator('div[role="dialog"]', {
      hasText: 'Connect wallet',
    });
    this.termOfUseAndPrivacyCheckBox = this.modal.locator(
      'input[type=checkbox]',
    );
    this.moreWallets = this.modal.getByText('More wallets');
    this.lessWallets = this.modal.getByText('Less wallets');
  }

  async isTermOfUseAndPrivacyChecked() {
    return this.termOfUseAndPrivacyCheckBox.isChecked();
  }

  getWalletInModal(walletName: string) {
    return this.modal
      .getByRole('button')
      .getByText(walletName, { exact: true });
  }

  async closePopUp() {
    await this.modal.locator('button').nth(0).click();
  }
}
