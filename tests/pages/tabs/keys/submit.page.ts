import { Locator, Page, test } from '@playwright/test';
import { TokenSymbol } from 'tests/consts/common.const';
import { BasePage } from 'tests/pages/base.page';
import { DepositKey } from 'tests/consts/keys.const';
import { WALLET_PAGE_TIMEOUT_WAITER } from 'tests/consts/timeouts';

export class SubmitPage {
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
      .getByText('Submit keys');
    this.amountInput = this.formBlock.getByTestId('amountInput');
    this.amountInputText = this.amountInput.locator('..').locator('span');
  }

  async open() {
    await test.step('Open submit tab for Keys page', async () => {
      await this.page.goto('/keys/submit');
    });
  }

  getBondTokenElement(tokenSymbol: TokenSymbol) {
    return this.formBlock.locator(`label:has([value="${tokenSymbol}"])`);
  }

  async fillKeys(keys: DepositKey[]) {
    const value = JSON.stringify(keys);
    await this.rawDepositData.fill(value);
  }

  async submitKeys(keys: DepositKey[], tokenSymbol = TokenSymbol.STETH) {
    const bondTokenElement = this.getBondTokenElement(tokenSymbol);
    await bondTokenElement.click();
    await this.fillKeys(keys);

    await this.confirmKeysReady.click();

    const [walletSignPage] = await Promise.all([
      this.base.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
      this.submitKeysButton.click(),
    ]);

    return walletSignPage;
  }
}
