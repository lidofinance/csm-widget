import { Page, test } from '@playwright/test';
import { BasePage } from './base.page';
import { WelcomeSection } from './elements/common/element.welcomeSection';

export class HomePage extends BasePage {
  welcomeSection: WelcomeSection;
  constructor(page: Page) {
    super(page);
    this.welcomeSection = new WelcomeSection(page);
  }

  async goto(param = '') {
    await test.step('Open the Stake page', async () => {
      await this.page.goto(param);
    });
  }
}
