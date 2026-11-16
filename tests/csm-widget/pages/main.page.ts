import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import {
  OperatorTypeCard,
  OperatorTypeCards,
} from './elements/main/element.operatorTypeCards';
import { CreateNodeOperatorForm } from './elements/keys/element.createNodeOperatorForm';
import { RPC_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';

export class MainPage extends BasePage {
  getStartedBtn: Locator;
  moduleCardCsm: Locator;
  operatorTypeCards: OperatorTypeCards;
  createNodeOperatorForm: CreateNodeOperatorForm;

  constructor(page: Page) {
    super(page);
    this.getStartedBtn = this.page.getByTestId('starterPackGetStarted');
    this.moduleCardCsm = this.page.getByTestId('moduleCard-csm');
    this.operatorTypeCards = new OperatorTypeCards(this.page);
    this.createNodeOperatorForm = new CreateNodeOperatorForm(this.page);
  }

  async goto() {
    await test.step('Open the Main page', async () => {
      await this.openWithRetry('/', this.moduleCardCsm);
    });
  }

  async openCreateOperator() {
    await test.step('Open the create operator page', async () => {
      const { anyCard } = this.operatorTypeCards;
      await this.openWithRetry(
        '/create',
        this.getStartedBtn.or(anyCard.first()),
      );
      if (await this.getStartedBtn.isVisible()) {
        await this.getStartedBtn.click();
      }
      await anyCard.first().waitFor({ state: 'visible' });
    });
  }

  // A wallet with several creatable types lands on the type-selection page
  // after the acknowledgement; a single one goes straight to its create form.
  async openCreateForm(type: OperatorTypeCard = '0x01') {
    await test.step(`Open the create form for the ${type} type`, async () => {
      const cardButton = this.operatorTypeCards.getCardButton(type);
      const form = this.createNodeOperatorForm.formBlock;
      await this.openWithRetry(
        '/create',
        this.getStartedBtn.or(cardButton).or(form),
      );
      if (await this.getStartedBtn.isVisible()) {
        await this.getStartedBtn.click();
      }
      await cardButton
        .or(form)
        .first()
        .waitFor({ state: 'visible', timeout: RPC_WAIT_TIMEOUT });
      if (await cardButton.isVisible()) await cardButton.click();
      await form.waitFor({ state: 'visible', timeout: RPC_WAIT_TIMEOUT });
    });
  }
}
