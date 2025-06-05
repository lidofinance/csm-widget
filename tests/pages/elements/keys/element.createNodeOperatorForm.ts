import { Locator, Page, expect } from '@playwright/test';
import {
  EXTRA_PER_KEY,
  FIRST_BOND,
  TokenSymbol,
} from 'tests/consts/common.const';
import { BasePage } from 'tests/pages/base.page';
import { DepositKey } from 'tests/consts/keys.const';
import { WALLET_PAGE_TIMEOUT_WAITER } from 'tests/consts/timeouts';

export class CreateNodeOperatorForm {
  page: Page;
  base: BasePage;
  formBlock: Locator;
  rawDepositData: Locator;
  confirmKeysReady: Locator;
  submitKeysButton: Locator;
  amountInput: Locator;
  amountInputText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.base = new BasePage(page);
    this.formBlock = this.page.getByTestId('submitKeysForm');
    this.rawDepositData = this.formBlock.locator('[name="rawDepositData"]');
    this.confirmKeysReady = this.formBlock
      .locator('label:has([name="confirmKeysReady"])')
      .locator('svg');
    this.submitKeysButton = this.formBlock
      .getByRole('button')
      .getByText('Create Node Operator');
    this.amountInput = this.formBlock.getByTestId('amountInput');
    this.amountInputText = this.amountInput.locator('..').locator('span');
  }

  getBondTokenElement(tokenSymbol: TokenSymbol) {
    return this.formBlock.locator(`label:has([value="${tokenSymbol}"])`);
  }

  async fillKeys(keys: DepositKey[]) {
    const value = JSON.stringify(keys);
    await this.rawDepositData.fill(value);
  }

  async addNewKeys(keys: DepositKey[], tokenSymbol: TokenSymbol) {
    const bondTokenElement = this.getBondTokenElement(tokenSymbol);
    await bondTokenElement.click();
    await this.fillKeys(keys);
    // This formula follows the Bond Curve model:
    // https://operatorportal.lido.fi/modules/community-staking-module#block-2d1c307d95fc4f8ab7c32b7584f795cf
    // The bond for the first key should cost 2.4 ETH, and each subsequent key should cost 1.3 ETH.
    const expectedBond = FIRST_BOND + (keys.length - 1) * EXTRA_PER_KEY;
    await expect(
      this.amountInput,
      `Expected bond amount will be equal ${expectedBond.toFixed(1)}`,
    ).toHaveValue(expectedBond.toFixed(1));
    await this.confirmKeysReady.click();

    const [walletSignPage] = await Promise.all([
      this.base.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
      this.submitKeysButton.click(),
    ]);

    return walletSignPage;
  }
}
