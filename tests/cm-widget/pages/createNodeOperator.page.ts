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
  stepHeader: Locator;
  successScreen: Locator;
  step1: CreateOperatorStep1Page;
  step2: CreateOperatorStep2Page;
  step3: CreateOperatorStep3Page;
  step4: CreateOperatorStep4Page;

  constructor(page: Page) {
    super(page);

    this.curatedOperatorForm = this.page.getByTestId('curatedOperatorForm');
    // Stepper and step heading sit above the form card
    this.stepHeader = this.page.getByTestId('curatedOperatorHeader');
    this.successScreen = this.page.getByTestId('successScreen');
    this.step1 = new CreateOperatorStep1Page(
      page,
      this.curatedOperatorForm,
      this.stepHeader,
    );
    this.step2 = new CreateOperatorStep2Page(
      page,
      this.curatedOperatorForm,
      this.stepHeader,
    );
    this.step3 = new CreateOperatorStep3Page(
      page,
      this.curatedOperatorForm,
      this.stepHeader,
    );
    this.step4 = new CreateOperatorStep4Page(
      page,
      this.curatedOperatorForm,
      this.stepHeader,
    );
  }

  async open() {
    await test.step('Open the Create Node Operator page', async () => {
      await this.openWithRetry('/create', this.curatedOperatorForm);
    });
  }
}
