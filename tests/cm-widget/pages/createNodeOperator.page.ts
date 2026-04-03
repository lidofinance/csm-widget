import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { CreateOperatorStep1Page } from './tabs/createNodeOperator/step1.page';

export class CreateNodeOperatorPage extends BasePage {
  createdOperatorForm: Locator;
  step1: CreateOperatorStep1Page;
  // step2: Locator;
  // step3: Locator;
  // step4: Locator;

  constructor(page: Page) {
    super(page);

    this.createdOperatorForm = this.page.getByTestId('createdOperatorForm');
    this.step1 = new CreateOperatorStep1Page(page, this.createdOperatorForm);
  }

  async open() {
    await test.step('Open the Create Node Operator page', async () => {
      await this.page.goto('/create');
    });
  }
}
