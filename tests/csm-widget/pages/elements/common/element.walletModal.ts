import { Locator, Page } from '@playwright/test';

export class WalletModal {
  page: Page;
  modal: Locator;
  providerName: Locator;
  connectedAddress: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = this.page.getByTestId('walletModal');
    this.providerName = this.modal.getByTestId('providerName');
    this.connectedAddress = this.modal.getByTestId('connectedAddress');
  }
}
