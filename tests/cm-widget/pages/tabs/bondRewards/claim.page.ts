import { expect, Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  BOND_TOKEN_OPTION_TEST_ID,
  TokenSymbol,
} from 'tests/shared/consts/common.const';

export class ClaimPage extends BasePage {
  form: Locator;

  // Balance cards (FormPage notices, outside claimBondForm)
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

  // Token select
  tokenButtons: Locator;
  tokenSelectTrigger: Locator;
  ethNote: Locator;

  // Enter token amount
  amountInput: Locator;
  validationInputTooltip: Locator;
  maxBtn: Locator;

  // Submit buttons (text varies by option/token)
  claimButton: Locator;
  requestWithdrawalButton: Locator;
  claimRewardsToBondButton: Locator;
  compensateButton: Locator;

  // Empty state (gate, outside claimBondForm)
  claimEmptyState: Locator;

  // Aside info
  claimBondFormInfo: Locator;
  claimBondFormInfoTitle: Locator;
  willReceiveAmount: Locator;
  bondDecreaseRow: Locator;

  // Splitters disclosure
  splittersAccordion: Locator;
  splittersSummary: Locator;
  splittersTotalAmount: Locator;
  splitterRecipient: Locator;

  constructor(public page: Page) {
    super(page);
    this.form = this.page.getByTestId('claimBondForm');

    this.rewardsBalanceCard = this.page.getByTestId('rewardsStat');
    this.bondBalanceCard = this.page.getByTestId('excessBondStat');
    this.lockedBondRow = this.page.getByTestId('lockedBondRow');
    this.pendingToSplitRow = this.page.getByTestId('pendingToSplitBondRow');
    this.debtBondRow = this.page.getByTestId('debtBondRow');

    this.claimOptionSection = this.form
      .getByText('Select claiming option')
      .locator('..');
    this.splittersChip = this.page.getByTestId('splittersChip');

    this.rewardsBalanceCardInfoIcon =
      this.rewardsBalanceCard.getByTestId('iconTooltip');
    this.bondBalanceCardInfoIcon =
      this.bondBalanceCard.getByTestId('iconTooltip');
    this.lockedBondRowInfoIcon = this.lockedBondRow.getByTestId('iconTooltip');
    this.splittersChipInfoIcon = this.splittersChip.getByTestId('iconTooltip');

    this.tokenButtons = this.form.getByTestId('tokenSelect');
    this.tokenSelectTrigger = this.form.getByTestId('tokenSelectTrigger');
    this.ethNote = this.form.getByTestId('ethNote');

    this.amountInput = this.form.locator('input[name="amount"]');
    this.validationInputTooltip = this.form.getByTestId('inputMessageError');
    this.maxBtn = this.form.getByTestId('maxBtn');

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

    this.claimEmptyState = this.page.getByTestId('claimEmptyState');

    this.claimBondFormInfo = this.form.getByTestId('claimBondFormInfo');
    this.claimBondFormInfoTitle = this.claimBondFormInfo.getByTestId(
      'claimBondFormInfoTitle',
    );
    this.willReceiveAmount =
      this.claimBondFormInfoTitle.getByTestId('tokenAmount');
    this.bondDecreaseRow = this.form.getByTestId('bondDecreaseRow');

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

  getTokenOption(symbol: TOKENS) {
    return this.form.getByTestId(
      BOND_TOKEN_OPTION_TEST_ID[symbol.toUpperCase() as TokenSymbol],
    );
  }

  async selectBondToken(symbol: TOKENS) {
    await test.step(`Choose ${symbol} symbol for claim`, async () => {
      await this.tokenSelectTrigger.click();
      await this.getTokenOption(symbol).click();
    });
  }

  async getBalanceByToken(symbol: TOKENS) {
    return test.step(`Read the ${symbol} claimable amount`, async () => {
      await this.tokenSelectTrigger.click();
      const text = await this.waitForTextContent(
        this.getTokenOption(symbol).getByTestId('tokenOptionLabel'),
      );
      await this.page.keyboard.press('Escape');
      return text;
    });
  }

  getClaimOptionRadio(option: string) {
    return this.form.getByTestId(`claimOption-${option}`);
  }

  async expectClaimOptionSelected(
    option: string,
    selected = true,
    options?: { timeout?: number },
  ) {
    await expect(this.getClaimOptionRadio(option)).toHaveAttribute(
      'aria-selected',
      String(selected),
      options,
    );
  }

  getClaimOptionLabel(option: string) {
    return this.getClaimOptionRadio(option).getByTestId('claimOptionLabel');
  }

  getClaimOptionDescription(option: string) {
    return this.getClaimOptionRadio(option).getByTestId(
      'claimOptionDescription',
    );
  }

  async selectClaimOption(option: string) {
    return test.step(`Select claim option: ${option}`, async () => {
      await this.getClaimOptionRadio(option).click();
    });
  }

  getActiveSubmitButton() {
    return this.form
      .getByRole('button')
      .filter({ has: this.page.locator(':not([disabled])') })
      .last();
  }
}
