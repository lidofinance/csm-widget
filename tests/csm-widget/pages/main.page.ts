import { Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { StarterPackSection } from './elements/main/element.starterPackSection';
import { OperatorTypeCards } from './elements/main/element.operatorTypeCards';

export class MainPage extends BasePage {
  starterPackSection: StarterPackSection;
  operatorTypeCards: OperatorTypeCards;

  constructor(page: Page) {
    super(page);
    this.starterPackSection = new StarterPackSection(this.page);
    this.operatorTypeCards = new OperatorTypeCards(this.page);
  }

  async goto() {
    await test.step('Open the Main page', async () => {
      await this.openWithRetry(
        '/',
        this.starterPackSection.createNodeOperatorBtn,
      );
    });
  }

  async openCreateOperator() {
    await test.step('Open the create operator page', async () => {
      await this.goto();
      await this.starterPackSection.createNodeOperatorBtn.click();
      await this.operatorTypeCards.csm01Card
        .or(this.operatorTypeCards.icsCard)
        .first()
        .waitFor({ state: 'visible' });
    });
  }

  async isNewOperator() {
    return this.starterPackSection.section.isVisible();
  }
}
