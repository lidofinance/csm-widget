import { Locator, Page } from '@playwright/test';

export class ApplicationFormStatus {
  page: Page;
  form: Locator;
  scoreChip: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.getByTestId('applicationFormStatus');
    this.scoreChip = this.form.getByTestId('scoreChip');
  }
}
