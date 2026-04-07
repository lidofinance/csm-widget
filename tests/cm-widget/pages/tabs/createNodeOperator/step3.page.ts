import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class CreateOperatorStep3Page extends BasePage {
  stepTrackText: Locator;
  stepTitle: Locator;
  backButton: Locator;
  continueButton: Locator;

  nameInput: Locator;
  nameContainer: Locator;
  nameError: Locator;

  descriptionInput: Locator;
  descriptionContainer: Locator;
  descriptionError: Locator;

  constructor(
    page: Page,
    public form: Locator,
  ) {
    super(page);
    this.stepTrackText = this.form.getByTestId('stepTrackText');
    this.stepTitle = this.form.getByTestId('stepTitle');
    this.backButton = this.form.getByRole('button', { name: 'Back' });
    this.continueButton = this.form.getByRole('button', { name: 'Continue' });

    this.nameInput = this.form.locator('input[name="name"]');
    this.nameContainer = this.form.locator(
      'xpath=//input[@name="name"]/ancestor::label/..',
    );
    this.nameError = this.nameContainer.getByTestId('input-message-error');

    this.descriptionInput = this.form.locator('input[name="description"]');
    this.descriptionContainer = this.form.locator(
      'xpath=//input[@name="description"]/ancestor::label/..',
    );
    this.descriptionError = this.descriptionContainer.getByTestId(
      'input-message-error',
    );
  }

  async fillForm() {
    await test.step('Fill step 3 with valid name and description', async () => {
      await this.nameInput.fill('Test Operator');
      await this.descriptionInput.fill('Test description');
    });
  }
}
