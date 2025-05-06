import { Page, test } from '@playwright/test';
import { BasePage } from './base.page';
import { WelcomeSection } from './elements/common/element.welcomeSection';

export class WelcomePage extends BasePage {
  welcomeSection: WelcomeSection;
  constructor(page: Page) {
    super(page);
    this.welcomeSection = new WelcomeSection(page);
  }

  async goto(param = '') {
    await test.step('Open the Welcome page', async () => {
      await this.page.goto(param);
    });
  }
}
