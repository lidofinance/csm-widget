import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';

export class SurveysPage extends BasePage {
  signInButton: Locator;
  vanomDashboardLink: Locator;

  constructor(page: Page) {
    super(page);
    this.signInButton = this.page.getByRole('button', { name: 'Sign in' });
    this.vanomDashboardLink = this.page.getByTestId('vanomDashboardLink');
  }

  async open() {
    await test.step('Open Surveys page', async () => {
      await this.page.goto('/surveys');
      await this.signInButton.waitFor({ state: 'visible' });
    });
  }
}
