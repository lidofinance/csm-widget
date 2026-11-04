import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  BOND_TOKEN_OPTION_TEST_ID,
  TokenSymbol,
} from 'tests/shared/consts/common.const';

export class AddBondPage extends BasePage {
  form: Locator;

  // Bond delta row and the why/insufficient notice
  titledAmount: Locator;
  titledAmountBalance: Locator;
  formInfoText: Locator;

  // Token and amount
  tokenSelectTrigger: Locator;
  amountInput: Locator;
  validationInputTooltip: Locator;
  maxBtn: Locator;

  // Button
  addBondButton: Locator;

  // Aside rows
  balanceWillReceive: Locator;
  exchangeRate: Locator;
  exchangeRateValue: Locator;

  constructor(public page: Page) {
    super(page);
    this.form = this.page.getByTestId('addBondForm');

    this.titledAmount = this.form.getByTestId('titledAmount');
    this.titledAmountBalance = this.form.getByTestId('titledAmountBalance');
    this.formInfoText = this.page.getByTestId('formInfoText');

    this.tokenSelectTrigger = this.form.getByTestId('tokenSelectTrigger');
    this.amountInput = this.form.locator('input[name="bondAmount"]');
    this.validationInputTooltip = this.form.getByTestId('inputMessageError');
    this.maxBtn = this.form.getByTestId('maxBtn');

    this.addBondButton = this.form.getByRole('button', { name: 'Add Bond' });

    this.balanceWillReceive = this.form.getByTestId('balanceWillReceive');
    this.exchangeRate = this.form.getByTestId('exchangeRate');
    this.exchangeRateValue = this.form.getByTestId('exchangeRateValue');
  }

  async open() {
    await test.step('Open the Bond & Rewards page', async () => {
      await this.openWithRetry('/bond/add', this.titledAmountBalance);
    });
  }

  async selectBondToken(symbol: TOKENS) {
    await test.step(`Select "${symbol}" bond token`, async () => {
      await this.tokenSelectTrigger.click();
      await this.form
        .getByTestId(
          BOND_TOKEN_OPTION_TEST_ID[symbol.toUpperCase() as TokenSymbol],
        )
        .click();
    });
  }
}
