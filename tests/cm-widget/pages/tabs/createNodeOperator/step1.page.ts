import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { OPERATOR_TYPE_METADATA } from '../../../../shared/consts/operatorTypes.const';

export class GateCard {
  card: Locator;
  title: Locator;
  description: Locator;

  constructor(
    public form: Locator,
    public shortName: string,
  ) {
    // Keep in sync with getGateCardTestId: '+' in metadata.short becomes
    // 'Plus' (e.g. 'IODC+' -> 'gateCardIODCPlus'); the testid is on the role="radio" card
    this.card = this.form.getByTestId(
      `gateCard${this.shortName.replace(/\+/g, 'Plus')}`,
    );

    this.title = this.card.getByTestId('gateCardTitle');
    this.description = this.card.getByTestId('gateCardDescription');
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
    public stepHeader: Locator,
  ) {
    super(page);
    this.stepTrackText = this.stepHeader.getByTestId('stepTrackText');
    this.stepTitle = this.stepHeader.getByTestId('stepTitle');
    this.stepDescription = this.stepHeader.getByTestId('stepDescription');
    this.continueButton = this.form.getByRole('button', { name: 'Continue' });
  }

  getGateInput(type: OPERATOR_TYPE) {
    const shortName = OPERATOR_TYPE_METADATA[type].short;
    return new GateCard(this.form, shortName);
  }

  async fillForm(type: OPERATOR_TYPE) {
    await test.step(`Select operator type: ${type}`, async () => {
      const gateInput = this.getGateInput(type);
      await gateInput.click();
      await this.continueButton.click();
    });
  }
}
