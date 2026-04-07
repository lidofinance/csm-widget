import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import {
  CreateOperatorStep1Page,
  CreateOperatorStep2Page,
  CreateOperatorStep3Page,
} from './tabs/createNodeOperator';

export class CreateNodeOperatorPage extends BasePage {
  createdOperatorForm: Locator;
  step1: CreateOperatorStep1Page;
  step2: CreateOperatorStep2Page;
  step3: CreateOperatorStep3Page;
  // step4: Locator;

  constructor(page: Page) {
    super(page);

    this.createdOperatorForm = this.page.getByTestId('createdOperatorForm');
    this.step1 = new CreateOperatorStep1Page(page, this.createdOperatorForm);
    this.step2 = new CreateOperatorStep2Page(page, this.createdOperatorForm);
    this.step3 = new CreateOperatorStep3Page(page, this.createdOperatorForm);
  }

  async open() {
    await test.step('Open the Create Node Operator page', async () => {
      await this.page.goto('/create');
    });
  }
}
