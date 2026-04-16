import { Page, test } from '@playwright/test';
import { BasePage } from './base.page';
import { StarterPackSection } from './elements/main/element.starterPackSection';

export class MainPage extends BasePage {
  starterPackSection: StarterPackSection;

  constructor(page: Page) {
    super(page);
    this.starterPackSection = new StarterPackSection(this.page);
  }

  async goto() {
    await test.step('Open the Main page', async () => {
      await this.page.goto('/');
    });
  }

  async isNewOperator() {
    return this.starterPackSection.section.isVisible();
  }
}
