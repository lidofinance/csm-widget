import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class DelayedPenaltyCancelPage extends BasePage {
  form: Locator;
  nodeOperatorIdInput: Locator;
  amountInput: Locator;
  maxButton: Locator;
  submitButton: Locator;

  lockedSection: Locator;
  lockedRows: Locator;

  constructor(page: Page) {
    super(page);
    this.form = this.page.getByTestId('delayedPenaltyCancelForm');
    this.nodeOperatorIdInput = this.form.locator(
      'input[name="nodeOperatorId"]',
    );
    this.amountInput = this.form.locator('input[name="amount"]');
    this.maxButton = this.form.getByTestId('maxBtn');
    this.submitButton = this.form.getByRole('button', {
      name: 'Cancel delayed penalty',
    });

    this.lockedSection = this.page.getByTestId('lockedSectionBlock');
    this.lockedRows = this.lockedSection.getByTestId('lockedRow');
  }

  async open() {
    await test.step('Open Cancel delayed penalty page', async () => {
      await this.openWithRetry('/delayed-penalty/cancel', this.form);
    });
  }

  fieldError(name: string) {
    return this.form
      .locator(`xpath=//input[@name="${name}"]/ancestor::label/..`)
      .getByTestId('inputMessageError');
  }

  lockedRow(nodeOperatorId: number) {
    return this.lockedRows.filter({
      has: this.page
        .getByTestId('nodeOperatorIdCell')
        .getByText(String(nodeOperatorId), { exact: true }),
    });
  }

  async submit(nodeOperatorId: number, amount: string) {
    await test.step(`Cancel ${amount} ETH for NO #${nodeOperatorId}`, async () => {
      await this.nodeOperatorIdInput.fill(String(nodeOperatorId));
      await this.amountInput.fill(amount);
      await expect(this.submitButton).toBeEnabled();
      await this.submitButton.click();
    });
  }
}
