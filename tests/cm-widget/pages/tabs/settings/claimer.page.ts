import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class ClaimerPage extends BasePage {
  form: Locator;
  backButton: Locator;

  // Info section
  currentClaimerSection: Locator;
  currentClaimerTitle: Locator;
  unsetButton: Locator;

  // Address input section
  addressInputTitle: Locator;
  addressInput: Locator;
  addressInputContainer: Locator;
  addressInputError: Locator;

  // Submit
  submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.form = this.page.getByTestId('claimerForm');
    this.backButton = this.form.getByRole('link', { name: 'Back' });

    this.currentClaimerSection = this.form.getByTestId('claimerSectionTitle');
    this.currentClaimerTitle = this.form.getByTestId('currentClaimerInfo');
    this.unsetButton = this.form.getByTestId('unsetClaimerButton');

    this.addressInputTitle = this.form.getByText(
      'Specify a new Rewards claimer address',
    );
    this.addressInput = this.form.locator('input[name="address"]');
    this.addressInputContainer = this.form.locator(
      'xpath=//input[@name="address"]/ancestor::label/..',
    );
    this.addressInputError =
      this.addressInputContainer.getByTestId('inputMessageError');

    this.submitButton = this.form.getByRole('button', {
      name: 'Set new Rewards claimer address',
    });
  }

  async open() {
    await test.step('Open Rewards claimer settings page', async () => {
      await this.openWithRetry('/settings/claimer', this.form);
    });
  }

  async setAddress(address: string) {
    await test.step(`Set Rewards claimer address to ${address}`, async () => {
      await this.addressInput.fill(address);
      await this.addressInput.blur();
      await expect(this.submitButton).toBeEnabled();
      await this.submitButton.click();
    });
  }
}
