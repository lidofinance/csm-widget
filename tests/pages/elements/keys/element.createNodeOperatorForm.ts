import { Locator, Page, expect, test } from '@playwright/test';
import {
  EXTRA_PER_KEY,
  FIRST_BOND,
  TokenSymbol,
} from 'tests/consts/common.const';
import { BasePage } from 'tests/pages';
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
    await test.step('Fill deposit key data', async () => {
      const value = JSON.stringify(keys);
      await this.rawDepositData.fill(value);
    });
  }

  async addNewKeys(keys: DepositKey[], tokenSymbol: TokenSymbol) {
    return test.step('Add new keys', async () => {
      // TODO: Remove debug logging after test stability is confirmed
      // eslint-disable-next-line no-console
      console.log(
        `[DEBUG] addNewKeys: Starting with token symbol: ${tokenSymbol}`,
      );
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] addNewKeys: Number of keys: ${keys.length}`);

      // Wait for form to be fully initialized
      await this.base.waitForFormReady();

      // eslint-disable-next-line no-console
      console.log(
        `[DEBUG] addNewKeys: Getting bond token element for: ${tokenSymbol}`,
      );
      const bondTokenElement = this.getBondTokenElement(tokenSymbol);

      // Debug: Check if element exists and get its properties
      const elementExists = await bondTokenElement.count();
      // eslint-disable-next-line no-console
      console.log(
        `[DEBUG] addNewKeys: Bond token element count: ${elementExists}`,
      );

      if (elementExists === 0) {
        // eslint-disable-next-line no-console
        console.error(
          `[DEBUG] addNewKeys: No element found for selector: label:has([value="${tokenSymbol}"])`,
        );

        // Capture screenshot for debugging
        await this.base.captureDebugScreenshot(
          'addNewKeys',
          'element-not-found',
        );

        // Let's see what radio buttons are actually available
        const allRadios = await this.formBlock
          .locator('input[type="radio"]')
          .all();
        // eslint-disable-next-line no-console
        console.log(
          `[DEBUG] addNewKeys: Found ${allRadios.length} radio buttons total`,
        );
        for (const [i, radio] of allRadios.entries()) {
          const value = await radio.getAttribute('value');
          const name = await radio.getAttribute('name');
          const id = await radio.getAttribute('id');
          // eslint-disable-next-line no-console
          console.log(
            `[DEBUG] addNewKeys: Radio ${i}: value="${value}", name="${name}", id="${id}"`,
          );
        }
        throw new Error(`No bond token element found for ${tokenSymbol}`);
      }

      // eslint-disable-next-line no-console
      console.log(
        `[DEBUG] addNewKeys: Waiting for bond token element to be visible...`,
      );
      await bondTokenElement.waitFor({ state: 'visible' });
      // eslint-disable-next-line no-console
      console.log(
        `[DEBUG] addNewKeys: Bond token element is visible, clicking...`,
      );
      await bondTokenElement.click();
      // eslint-disable-next-line no-console
      console.log(`[DEBUG] addNewKeys: Clicked bond token element`);

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
    });
  }
}
