import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { OPERATOR_TYPE_METADATA } from '../../../../shared/consts/operatorTypes.const';

export class GateCard {
  card: Locator;
  input: Locator;
  title: Locator;
  description: Locator;
  checkIcon: Locator;

  constructor(
    public form: Locator,
    public shortName: string,
  ) {
    this.input = this.form.getByTestId(`gateCard${this.shortName}`);

    this.card = this.input.locator('..');

    this.title = this.card.getByTestId('gateCardTitle');
    this.description = this.card.getByTestId('gateCardDescription');
    this.checkIcon = this.card.getByTestId('gateCardCheckIcon');
  }

  async click() {
    await this.card.click();
  }
}

export class CreateOperatorStep1Page extends BasePage {
  stepTrackText: Locator;
  stepTitle: Locator;
  stepDescription: Locator;
  continueButton: Locator;

  constructor(
    page: Page,
    public form: Locator,
  ) {
    super(page);
    this.stepTrackText = this.form.getByTestId('stepTrackText');
    this.stepTitle = this.form.getByTestId('stepTitle');
    this.stepDescription = this.form.getByTestId('stepDescription');
    this.continueButton = this.form.getByRole('button', { name: 'Continue' });
  }

  getGateInput(type: OPERATOR_TYPE) {
    const shortName = OPERATOR_TYPE_METADATA[type].short;
    return new GateCard(this.form, shortName);
  }

  async open() {
    await test.step('Open the Dasboard page', async () => {
      await this.page.goto('/create');
    });
  }
}
