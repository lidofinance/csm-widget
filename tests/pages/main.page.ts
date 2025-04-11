import { Page, test } from '@playwright/test';
import { BasePage } from './base.page';

export class MainPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await test.step('Open the Main page', async () => {
      await this.page.goto('/');
    });
  }
}
