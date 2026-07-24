import { Locator, Page } from '@playwright/test';

export class Header {
  page: Page;
  header: Locator;
  accountSection: Locator;
  connectWalletBtn: Locator;
  operatorTypeBadge: Locator;
  operatorTypeCurve: Locator;
  switchOperatorButton: Locator;
  operatorSwitchModal: Locator;
  switchModalRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = this.page.locator('header');
    this.accountSection = this.header.getByTestId('accountSectionHeader');

    this.connectWalletBtn = this.header.getByText('Connect').first();
    this.operatorTypeBadge = this.header.getByTestId(
      'header-operator-type-button',
    );
    this.operatorTypeCurve = this.header.getByTestId('nodeOperatorCurve');
    this.switchOperatorButton = this.header.getByTestId('nodeOperatorHeader');
    this.operatorSwitchModal = this.page.locator('[role=dialog]', {
      hasText: 'Switch Node Operator',
    });
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
