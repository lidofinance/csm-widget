import { Locator, Page } from '@playwright/test';

export class WalletModal {
  page: Page;
  modal: Locator;
  providerName: Locator;
  connectedAddress: Locator;
  copyAddressButton: Locator;
  etherscanButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = this.page.locator('div[role="dialog"]', {
      has: this.page.getByTestId('connectedAddress'),
    });
    this.providerName = this.modal.getByTestId('providerName');
    this.connectedAddress = this.modal.getByTestId('connectedAddress');
    this.copyAddressButton = this.modal.getByTestId('copyAddressBtn');
    this.etherscanButton = this.modal.getByTestId('etherscanBtn');
  }
}
