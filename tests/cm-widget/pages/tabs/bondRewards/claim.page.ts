import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

export class ClaimPage extends BasePage {
  form: Locator;

  // Sources info balance cards (rendered OUTSIDE claimBondForm, scoped to page)
  rewardsBalanceCard: Locator;
  bondBalanceCard: Locator;
  lockedBondRow: Locator;
  pendingToSplitRow: Locator;
  debtBondRow: Locator;

  // Info icons (tooltip triggers)
  rewardsBalanceCardInfoIcon: Locator;
  bondBalanceCardInfoIcon: Locator;
  lockedBondRowInfoIcon: Locator;
  splittersChipInfoIcon: Locator;

  // Claim option select
  claimOptionSection: Locator;
  splittersChip: Locator;

  // Token buttons
  tokenButtons: Locator;
  ethNote: Locator;

  // Enter token amount
  amountInput: Locator;
  amountLabel: Locator;
  validationInputTooltip: Locator;
  maxBtn: Locator;

  // Submit buttons (text varies by option/token)
  claimButton: Locator;
  requestWithdrawalButton: Locator;
  claimRewardsToBondButton: Locator;
  compensateButton: Locator;

  // Empty state (shown when nothing to claim)
  claimEmptyState: Locator;

  // Claim info
  claimBondFormInfo: Locator;
  claimBondFormInfoTitle: Locator;
  willReceiveAmount: Locator;
  bondDecreaseRow: Locator;

  // Splitters accordion
  splittersAccordion: Locator;
  splittersSummary: Locator;
  splittersTotalAmount: Locator;
  splitterRecipient: Locator;

  constructor(public page: Page) {
    super(page);
    this.form = this.page.getByTestId('claimBondForm');

    // Sources info balance cards — rendered outside claimBondForm
    this.rewardsBalanceCard = this.page.getByTestId('rewardsBalanceCard');
    this.bondBalanceCard = this.page.getByTestId('bondBalanceCard');
    this.lockedBondRow = this.page.getByTestId('lockedBondRow');
    this.pendingToSplitRow = this.page.getByTestId('pendingToSplitBondRow');
    this.debtBondRow = this.page.getByTestId('debtBondRow');

    // Claim option select
    this.claimOptionSection = this.form
      .getByText('Select claiming option')
      .locator('..');
    this.splittersChip = this.page.getByTestId('splittersChip');

    // Info icons (tooltip triggers)
    this.rewardsBalanceCardInfoIcon =
      this.rewardsBalanceCard.getByTestId('iconTooltip');
    this.bondBalanceCardInfoIcon =
      this.bondBalanceCard.getByTestId('iconTooltip');
    this.lockedBondRowInfoIcon = this.lockedBondRow.getByTestId('iconTooltip');
    this.splittersChipInfoIcon = this.splittersChip.getByTestId('iconTooltip');

    // Token buttons
    this.tokenButtons = this.form.getByTestId('tokenButtons');
    this.ethNote = this.form.getByTestId('ethNote');

    // Enter token amount
    this.amountInput = this.form.locator('input[name="amount"]');
    this.amountLabel = this.form.locator(
      'xpath=//input[@name="amount"]/ancestor::label',
    );
    this.validationInputTooltip = this.amountLabel.locator('> span').nth(1);
    this.maxBtn = this.amountLabel.getByTestId('maxBtn');

    // Submit buttons — text depends on selected option and token
    this.claimButton = this.form.getByRole('button', {
      name: 'Claim',
      exact: true,
    });
    this.requestWithdrawalButton = this.form.getByRole('button', {
      name: 'Request withdrawal',
      exact: true,
    });
    this.claimRewardsToBondButton = this.form.getByRole('button', {
      name: 'Claim rewards to the Bond balance',
      exact: true,
    });
    this.compensateButton = this.form.getByRole('button', {
      name: 'Compensate',
      exact: true,
    });

    // Empty state
    this.claimEmptyState = this.form.getByTestId('claimEmptyState');

    // Claim info
    this.claimBondFormInfo = this.form.getByTestId('claimBondFormInfo');
    this.claimBondFormInfoTitle = this.claimBondFormInfo.getByTestId(
      'claimBondFormInfoTitle',
    );
    this.willReceiveAmount =
      this.claimBondFormInfoTitle.getByTestId('tokenAmount');
    this.bondDecreaseRow = this.form.getByTestId('bondDecreaseRow');

    // Splitters accordion
    this.splittersAccordion =
      this.claimBondFormInfo.getByTestId('splittersAccordion');
    this.splittersSummary =
      this.claimBondFormInfo.getByTestId('splittersSummary');
    this.splittersTotalAmount = this.claimBondFormInfo.getByTestId(
      'splittersTotalAmount',
    );
    this.splitterRecipient =
      this.claimBondFormInfo.getByTestId('splitterRecipient');
  }

  async open() {
    await test.step('Open the Bond & Rewards page', async () => {
      await this.openWithRetry('/bond/claim', this.rewardsBalanceCard);
    });
  }

  getTokenCardBySymbol(symbol: TOKENS) {
    return this.tokenButtons.locator(`input[value="${symbol}"]`).locator('..');
  }

  async selectBondToken(symbol: TOKENS) {
    return test.step(`Choose ${symbol} symbol for claim`, async () => {
      const token = this.getTokenCardBySymbol(symbol);
      await token.dispatchEvent('click');
      return token;
    });
  }

  async getBalanceByToken(symbol: TOKENS) {
    return this.waitForTextContent(
      this.tokenButtons
        .locator(`input[value="${symbol}"]`)
        .locator('..')
        .getByTestId('tokenAmount'),
    );
  }

  getClaimOptionRadio(option: string) {
    return this.form.locator(`input[name="claimOption"][value="${option}"]`);
  }

  getClaimOptionLabel(option: string) {
    return this.getClaimOptionRadio(option)
      .locator('..')
      .getByTestId('claimOptionLabel');
  }

  getClaimOptionDescription(option: string) {
    return this.getClaimOptionRadio(option)
      .locator('..')
      .getByTestId('claimOptionDescription');
  }

  async selectClaimOption(option: string) {
    return test.step(`Select claim option: ${option}`, async () => {
      await this.getClaimOptionRadio(option).locator('..').click();
    });
  }

  getActiveSubmitButton() {
    return this.form
      .getByRole('button')
      .filter({ has: this.page.locator(':not([disabled])') })
      .last();
  }
}
