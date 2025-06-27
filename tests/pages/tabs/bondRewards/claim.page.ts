import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../base.page';
import { TOKENS } from 'consts/tokens';
import { SourceSelect } from 'tests/pages/elements/bondRewards/claim/sourceSelect.element';

export class ClaimPage extends BasePage {
  form: Locator;

  // Source select
  availableToClaimBalance: Locator;
  titledAmountPrice: Locator;
  titledTokenBalance: Locator;
  titledTokenPrice: Locator;
  sourceSelect: SourceSelect;

  // Token buttons
  tokenButtons: Locator;

  // Enter token amount
  amountInput: Locator;
  amountLabel: Locator;
  validationInputTooltip: Locator;
  maxBtn: Locator;

  // Button
  claimButton: Locator;
  requestWithdrawalButton: Locator;

  // Claim info
  claimBondFormInfo: Locator;
  claimBondFormInfoTitle: Locator;
  willReceiveAmount: Locator;

  constructor(public page: Page) {
    super(page);
    this.form = this.page.getByTestId('claimBondForm');

    // Source select
    this.availableToClaimBalance = this.form.getByTestId(
      'availableToClaimBalance',
    );
    this.titledAmountPrice =
      this.availableToClaimBalance.getByTestId('amountPrice');
    this.titledTokenBalance = this.titledAmountPrice.locator('> div').nth(0);
    this.titledTokenPrice = this.titledAmountPrice.getByTestId('usdPrice');

    this.sourceSelect = new SourceSelect(this.form);

    // Token buttons
    this.tokenButtons = this.form.getByTestId('tokenButtons');

    // Enter token amount
    this.amountInput = this.form.locator('input[name="amount"]');
    this.amountLabel = this.form.locator(
      'xpath=//input[@name="amount"]/ancestor::label',
    );
    this.validationInputTooltip = this.amountLabel.locator('> span').nth(1);
    this.maxBtn = this.amountLabel.getByTestId('maxBtn');

    // Button
    this.claimButton = this.form.getByRole('button', {
      name: 'Claim to the Rewards Address',
    });
    this.requestWithdrawalButton = this.form.getByRole('button', {
      name: 'Request withdrawal to the Rewards Address',
    });

    // Claim info
    this.claimBondFormInfo = this.form.getByTestId('claimBondFormInfo');
    this.claimBondFormInfoTitle = this.claimBondFormInfo.getByTestId(
      'claimBondFormInfoTitle',
    );
    this.willReceiveAmount = this.claimBondFormInfo.getByTestId('tokenAmount');
  }

  async open() {
    await test.step('Open the Bond & Rewards page', async () => {
      await this.openWithRetry('/bond/claim', this.titledTokenBalance);
    });
  }

  selectBondToken(symbol: TOKENS) {
    return this.tokenButtons.locator(`input[value="${symbol}"]`).locator('..');
  }

  async getBalanceByToken(symbol: TOKENS) {
    return parseFloat(
      await this.waitForTextContent(
        this.tokenButtons.locator(`input[value="${symbol}"]`).locator('..'),
      ),
    );
  }
}
