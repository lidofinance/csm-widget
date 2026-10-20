import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export type PenaltyReportInput = {
  nodeOperatorId: number;
  amount: string;
  penaltyType: string;
  details?: string;
};

export class DelayedPenaltyReportPage extends BasePage {
  form: Locator;
  nodeOperatorIdInput: Locator;
  amountInput: Locator;
  penaltyTypeInput: Locator;
  detailsInput: Locator;
  submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.form = this.page.getByTestId('delayedPenaltyReportForm');
    this.nodeOperatorIdInput = this.form.locator(
      'input[name="nodeOperatorId"]',
    );
    this.amountInput = this.form.locator('input[name="amount"]');
    this.penaltyTypeInput = this.form.locator('input[name="penaltyType"]');
    this.detailsInput = this.form.locator('input[name="details"]');
    this.submitButton = this.form.getByRole('button', {
      name: 'Report delayed penalty',
    });
  }

  async open() {
    await test.step('Open Report delayed penalty page', async () => {
      await this.openWithRetry('/delayed-penalty/report', this.form);
    });
  }

  fieldError(name: string) {
    return this.form
      .locator(`xpath=//input[@name="${name}"]/ancestor::label/..`)
      .getByTestId('inputMessageError');
  }

  async fill({
    nodeOperatorId,
    amount,
    penaltyType,
    details,
  }: PenaltyReportInput) {
    await test.step('Fill the report form', async () => {
      await this.nodeOperatorIdInput.fill(String(nodeOperatorId));
      await this.amountInput.fill(amount);
      await this.penaltyTypeInput.fill(penaltyType);
      if (details !== undefined) await this.detailsInput.fill(details);
    });
  }

  async submit(input: PenaltyReportInput) {
    await this.fill(input);
    await test.step('Submit the report form', async () => {
      await expect(this.submitButton).toBeEnabled();
      await this.submitButton.click();
    });
  }
}
