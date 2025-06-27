import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../base.page';
import { TOKENS } from 'consts/tokens';

export class AddBondPage extends BasePage {
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
  maxBtn: Locator;

  // Button
  addBondButton: Locator;

  // Bond token information
  addBondTokenInfo: Locator;
  balanceWillReceive: Locator;
  exchangeRate: Locator;

  constructor(public page: Page) {
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
    this.maxBtn = this.amountLabel.getByTestId('maxBtn');

    // Button
    this.addBondButton = this.form.getByRole('button', { name: 'Add Bond' });

    // Bond token information
    this.addBondTokenInfo = this.form.getByTestId('addBondTokenInfo');
    this.balanceWillReceive =
      this.addBondTokenInfo.getByTestId('balanceWillReceive');
    this.exchangeRate = this.addBondTokenInfo.getByTestId('exchangeRate');
  }

  async open() {
    await test.step('Open the Bond & Rewards page', async () => {
      await this.openWithRetry('/bond/add', this.titledAmountBalance);
    });
  }

  selectBondToken(symbol: TOKENS) {
    return this.form.locator(`input[value="${symbol}"]`).locator('..');
  }

  async getBalanceByToken(symbol: TOKENS) {
    return parseFloat(
      await this.waitForTextContent(
        this.form.locator(`input[value="${symbol}"]`).locator('..'),
      ),
    );
  }
}
