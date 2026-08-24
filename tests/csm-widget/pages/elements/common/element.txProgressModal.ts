import { Locator, Page } from '@playwright/test';

export class TxModal {
  page: Page;
  modal: Locator;
  modalContent: Locator;
  title: Locator;
  description: Locator;
  footerHint: Locator;
  footer: Locator;
  switchToOperatorBtn: Locator;
  etherscanLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = this.page.locator('[role=dialog]');
    this.modalContent = this.modal.getByTestId('txStage');
    this.title = this.modalContent.getByTestId('title');
    this.description = this.modalContent.getByTestId('description');
    this.footerHint = this.modalContent.getByTestId('footerHint');
    this.footer = this.modalContent.getByTestId('footer');
    this.switchToOperatorBtn = this.footer.getByTestId('switchToOperatorBtn');
    this.etherscanLink = this.modalContent.getByRole('link', {
      name: 'View on Etherscan',
    });
  }

  async closeModal() {
    await this.modal.locator('[type="button"]').first().click();
  }
}
