import { Locator, Page, test } from '@playwright/test';
import { BasePage } from './base.page';
import { COMMON_ACTION_TIMEOUT } from 'tests/consts/timeouts';
import { TOKENS } from 'consts/tokens';

export class BondRewardsPage extends BasePage {
  form: Locator;

  // Form info
  formInfo: Locator;
  titledAmount: Locator;
  titledAmountBalance: Locator;
  formInfoText: Locator;

  // Enter token amount
  amountInput: Locator;
  amountLabel: Locator;
  validationInputTooltip: Locator;

  constructor(page: Page) {
    super(page);
    this.form = this.page.getByTestId('addBondForm');

    // Form info
    this.formInfo = this.form.getByTestId('formInfo');
    this.titledAmount = this.formInfo.getByTestId('titledAmount');
    this.titledAmountBalance = this.titledAmount.locator('div > span');
    this.formInfoText = this.formInfo.locator('p');

    // Enter token amount
    this.amountInput = this.form.locator('input[name="bondAmount"]');
    this.amountLabel = this.form.locator(
      'xpath=//input[@name="bondAmount"]/ancestor::label',
    );
    this.validationInputTooltip = this.amountLabel.locator('> span').nth(1);
  }

  async open() {
    await test.step('Open the Bond & Rewards page', async () => {
      await this.page.goto('/bond/add');
    });

    await test.step('Wait for balance loaded', async () => {
      await this.waitForTextContent(
        this.titledAmountBalance,
        COMMON_ACTION_TIMEOUT,
      );
    });
  }

  selectBondToken(symbol: TOKENS) {
    return this.form.locator(`input[value="${symbol}"]`).locator('..');
  }
}
