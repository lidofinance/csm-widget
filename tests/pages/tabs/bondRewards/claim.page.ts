import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../base.page';
import { TOKENS } from 'consts/tokens';

export class ClaimPage extends BasePage {
  form: Locator;

  // Source select
  availableToClaimBalance: Locator;
  amountPrice: Locator;
  sourceSelect: Locator;
  rewardsSource: Locator;
  excessBondSource: Locator;

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

  constructor(public page: Page) {
    super(page);
    this.form = this.page.getByTestId('claimBondForm');

    // Source select
    this.availableToClaimBalance = this.form.getByTestId(
      'availableToClaimBalance',
    );
    this.amountPrice = this.availableToClaimBalance.getByTestId('amountPrice');
    this.sourceSelect = this.form.getByTestId('sourceSelect');
    this.rewardsSource = this.sourceSelect.getByTestId('rewardsSource');
    this.excessBondSource = this.sourceSelect.getByTestId('excessBondSource');

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
  }

  async open() {
    await test.step('Open the Bond & Rewards page', async () => {
      await this.openWithRetry('/bond/claim', this.amountPrice);
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
