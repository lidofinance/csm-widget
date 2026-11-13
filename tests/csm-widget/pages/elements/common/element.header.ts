import { Locator, Page } from '@playwright/test';

export class Header {
  page: Page;
  header: Locator;
  accountSection: Locator;
  connectWalletBtn: Locator;
  operatorTypeCurve: Locator;
  switchOperatorButton: Locator;
  operatorSwitchModal: Locator;
  operatorPopupTypeTag: Locator;
  switchModalRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = this.page.locator('header');
    this.accountSection = this.header.getByTestId('accountSectionHeader');

    this.connectWalletBtn = this.header.getByText('Connect').first();
    this.switchOperatorButton = this.page.getByTestId('nodeOperatorHeader');
    this.operatorTypeCurve = this.switchOperatorButton;
    this.operatorSwitchModal = this.page.getByTestId('switchOperatorPopup');
    this.operatorPopupTypeTag = this.page.getByTestId('switchPopupTypeTag');
    this.switchModalRows = this.page.getByTestId('switchModalOperatorRow');
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
