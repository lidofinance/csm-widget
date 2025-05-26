import { Locator, Page, expect } from '@playwright/test';
import {
  EXTRA_PER_KEY,
  FIRST_BOND,
  TokenSymbol,
} from 'tests/consts/common.const';
import { BasePage } from 'tests/pages/base.page';
import { DepositKey } from 'tests/widget/operatorWithValidator/keys.const';

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
    const expectedBond = FIRST_BOND + (keys.length - 1) * EXTRA_PER_KEY;
    await expect(this.amountInput).toHaveValue(expectedBond.toFixed(1));
    await this.confirmKeysReady.click();

    const [walletSignPage] = await Promise.all([
      this.base.waitForPage(10000),
      this.submitKeysButton.click(),
    ]);

    return walletSignPage;
  }
}
