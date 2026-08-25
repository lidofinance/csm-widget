import { expect, Locator, Page, test } from '@playwright/test';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';

export class ConfirmOperatorModalElement {
  page: Page;
  modal: Locator;
  operatorId: Locator;
  continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = this.page.getByTestId('confirmOperatorModal');
    this.operatorId = this.modal.getByTestId('descriptorId');
    this.continueButton = this.modal.getByTestId('confirmOperatorButton');
  }

  async confirm() {
    await test.step('Confirm the Node Operator', async () => {
      await expect(this.modal).toBeVisible({ timeout: PAGE_WAIT_TIMEOUT });
      await this.continueButton.click();
      await expect(this.modal).toBeHidden({ timeout: PAGE_WAIT_TIMEOUT });
    });
  }
}
