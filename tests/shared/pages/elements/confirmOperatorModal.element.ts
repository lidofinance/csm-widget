import { expect, Locator, Page, test } from '@playwright/test';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';

export class ConfirmOperatorModalElement {
  page: Page;
  modal: Locator;
  title: Locator;
  description: Locator;
  operatorId: Locator;
  continueButton: Locator;
  closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = this.page.getByTestId('confirmOperatorModal');
    this.title = this.modal.getByTestId('confirmOperatorTitle');
    this.description = this.modal.getByTestId('confirmOperatorDescription');
    this.operatorId = this.modal.getByTestId('descriptorId');
    this.continueButton = this.modal.getByTestId('confirmOperatorButton');
    this.closeButton = this.modal.locator('button').first();
  }

  async confirm() {
    await test.step('Confirm the Node Operator', async () => {
      await expect(this.modal).toBeVisible({ timeout: PAGE_WAIT_TIMEOUT });
      await this.continueButton.click();
      await expect(this.modal).toBeHidden({ timeout: PAGE_WAIT_TIMEOUT });
    });
  }

  async clickCross() {
    await test.step('Dismiss the Node Operator confirmation', async () => {
      await expect(this.modal).toBeVisible({ timeout: PAGE_WAIT_TIMEOUT });
      await this.closeButton.click();
      await expect(this.modal).toBeHidden({ timeout: PAGE_WAIT_TIMEOUT });
    });
  }

  async pressEscape() {
    await test.step('Dismiss the confirmation with Escape', async () => {
      await expect(this.modal).toBeVisible({ timeout: PAGE_WAIT_TIMEOUT });
      await this.page.keyboard.press('Escape');
      await expect(this.modal).toBeHidden({ timeout: PAGE_WAIT_TIMEOUT });
    });
  }

  async clickBackdrop() {
    await test.step('Dismiss the confirmation by clicking the backdrop', async () => {
      await expect(this.modal).toBeVisible({ timeout: PAGE_WAIT_TIMEOUT });
      await this.page.mouse.click(32, 32);
      await expect(this.modal).toBeHidden({ timeout: PAGE_WAIT_TIMEOUT });
    });
  }
}
