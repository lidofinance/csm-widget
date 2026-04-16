import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class CreateOperatorStep4Page extends BasePage {
  stepTrackText: Locator;
  stepTitle: Locator;
  backButton: Locator;
  createButton: Locator;

  summaryOperatorType: Locator;
  summaryName: Locator;
  summaryDescription: Locator;
  summaryManagerAddress: Locator;
  summaryRewardsAddress: Locator;

  constructor(
    page: Page,
    public form: Locator,
  ) {
    super(page);
    this.stepTrackText = this.form.getByTestId('stepTrackText');
    this.stepTitle = this.form.getByTestId('stepTitle');
    this.backButton = this.form.getByRole('button', { name: 'Back' });
    this.createButton = this.form.getByRole('button', {
      name: 'Create Node Operator',
    });

    this.summaryOperatorType = this.form.getByTestId('summaryOperatorType');
    this.summaryName = this.form.getByTestId('summaryName');
    this.summaryDescription = this.form.getByTestId('summaryDescription');
    this.summaryManagerAddress = this.form.getByTestId('summaryManagerAddress');
    this.summaryRewardsAddress = this.form.getByTestId('summaryRewardsAddress');
  }

  async fillForm() {
    await test.step('Step 4 requires no input', async () => {});
  }
}
