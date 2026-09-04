import { Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { StarterPackSection } from './elements/main/element.starterPackSection';
import {
  OperatorTypeCard,
  OperatorTypeCards,
} from './elements/main/element.operatorTypeCards';
import { CreateNodeOperatorForm } from './elements/keys/element.createNodeOperatorForm';
import { RPC_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';

export class MainPage extends BasePage {
  starterPackSection: StarterPackSection;
  operatorTypeCards: OperatorTypeCards;
  createNodeOperatorForm: CreateNodeOperatorForm;

  constructor(page: Page) {
    super(page);
    this.starterPackSection = new StarterPackSection(this.page);
    this.operatorTypeCards = new OperatorTypeCards(this.page);
    this.createNodeOperatorForm = new CreateNodeOperatorForm(this.page);
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
      await this.operatorTypeCards.anyCard
        .first()
        .waitFor({ state: 'visible' });
    });
  }

  // A wallet with several creatable types lands on the type-selection page
  // first; a single one is redirected straight to its create form.
  async openCreateForm(type: OperatorTypeCard = '0x01') {
    await test.step(`Open the create form for the ${type} type`, async () => {
      await this.starterPackSection.createNodeOperatorBtn.click();
      const cardButton = this.operatorTypeCards.getCardButton(type);
      const form = this.createNodeOperatorForm.formBlock;
      await cardButton
        .or(form)
        .first()
        .waitFor({ state: 'visible', timeout: RPC_WAIT_TIMEOUT });
      if (await cardButton.isVisible()) await cardButton.click();
      await form.waitFor({ state: 'visible', timeout: RPC_WAIT_TIMEOUT });
    });
  }

  async isNewOperator() {
    return this.starterPackSection.section.isVisible();
  }
}
