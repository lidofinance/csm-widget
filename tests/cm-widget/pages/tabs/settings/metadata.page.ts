import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class MetadataPage extends BasePage {
  form: Locator;

  nameInput: Locator;
  nameInputContainer: Locator;
  nameInputError: Locator;

  descriptionInput: Locator;
  descriptionInputContainer: Locator;
  descriptionInputError: Locator;

  saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.form = this.page.locator('form');

    this.nameInput = this.form.locator('input[name="name"]');
    this.nameInputContainer = this.form.locator(
      'xpath=//input[@name="name"]/ancestor::label/..',
    );
    this.nameInputError =
      this.nameInputContainer.getByTestId('inputMessageError');

    this.descriptionInput = this.form.locator('textarea[name="description"]');
    this.descriptionInputContainer = this.form.locator(
      'xpath=//textarea[@name="description"]/ancestor::label/..',
    );
    this.descriptionInputError =
      this.descriptionInputContainer.getByTestId('inputMessageError');

    this.saveButton = this.form.getByRole('button', { name: 'Update' });
  }

  async open() {
    await test.step('Open Metadata settings page', async () => {
      await this.openWithRetry('/settings/metadata', this.nameInput);
    });
  }
}
