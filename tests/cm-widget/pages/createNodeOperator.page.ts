import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import {
  CreateOperatorStep1Page,
  CreateOperatorStep2Page,
  CreateOperatorStep3Page,
  CreateOperatorStep4Page,
} from './tabs/createNodeOperator';

export class CreateNodeOperatorPage extends BasePage {
  curatedOperatorForm: Locator;
  step1: CreateOperatorStep1Page;
  step2: CreateOperatorStep2Page;
  step3: CreateOperatorStep3Page;
  step4: CreateOperatorStep4Page;

  constructor(page: Page) {
    super(page);

    this.curatedOperatorForm = this.page.getByTestId('curatedOperatorForm');
    this.step1 = new CreateOperatorStep1Page(page, this.curatedOperatorForm);
    this.step2 = new CreateOperatorStep2Page(page, this.curatedOperatorForm);
    this.step3 = new CreateOperatorStep3Page(page, this.curatedOperatorForm);
    this.step4 = new CreateOperatorStep4Page(page, this.curatedOperatorForm);
  }

  async open() {
    await test.step('Open the Create Node Operator page', async () => {
      await this.page.goto('/create');
    });
  }
}
