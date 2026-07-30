import { Locator, Page, test } from '@playwright/test';
import { TokenSymbol } from 'tests/shared/consts/common.const';
import { BasePage } from '../../../../shared/pages/base.page';
import { LOW_TIMEOUT } from 'tests/shared/consts/timeouts';
import { DepositKey } from 'tests/shared/services/keysGenerator.service';

export class SubmitPage extends BasePage {
  page: Page;
  base: BasePage;
  formBlock: Locator;
  rawDepositData: Locator;
  confirmKeysReady: Locator;
  confirmKeysReadyInput: Locator;
  submitKeysButton: Locator;
  amountInput: Locator;
  amountInputText: Locator;
  validationInputError: Locator;

  // Tabs
  jsonTab: Locator;
  parsedTab: Locator;
  parametersTab: Locator;

  // Parsed tab
  depositDataRow: Locator;
  parsedTabCounter: Locator;

  constructor(page: Page) {
    super(page);

    this.page = page;
    this.base = new BasePage(page);
    this.formBlock = this.page.getByTestId('submitKeysForm');
    this.rawDepositData = this.formBlock.locator('[name="rawDepositData"]');
    this.confirmKeysReady = this.formBlock
      .locator('label:has([name="confirmKeysReady"])')
      .locator('svg');
    this.confirmKeysReadyInput = this.formBlock.locator(
      '[name="confirmKeysReady"]',
    );
    this.submitKeysButton = this.formBlock
      .getByRole('button')
      .getByText('Submit keys');
    this.amountInput = this.formBlock.getByTestId('amountInput');
    this.amountInputText = this.amountInput.locator('..').locator('span');
    this.validationInputError = this.formBlock.getByTestId(
      'input-message-error',
    );

    // Tabs
    this.jsonTab = this.formBlock.getByTestId('tab-button-JSON');
    this.parsedTab = this.formBlock.getByTestId('tab-button-Parsed');
    this.parametersTab = this.formBlock.getByTestId('tab-button-Parameters');

    // Parsed tab
    this.depositDataRow = this.formBlock.getByTestId('deposit-data-row');
    this.parsedTabCounter = this.formBlock.getByTestId(
      'depositDataErrorsCounter',
    );
  }

  async open() {
    await test.step('Open submit tab for Keys page', async () => {
      await this.openWithRetry('/keys/submit', this.rawDepositData);
    });
  }

  async selectTab(tabName: 'JSON' | 'Parsed' | 'Parameters') {
    return test.step(`Select "${tabName}" tab`, async () => {
      await this.formBlock.getByTestId(`tab-button-${tabName}`).click();
    });
  }

  getBondTokenElement(tokenSymbol: TokenSymbol) {
    return this.formBlock.locator(`label:has([value="${tokenSymbol}"])`);
  }

  async fillKeys(keys: DepositKey[] | DepositKey) {
    await test.step('Fill deposit key data', async () => {
      const value = JSON.stringify(keys);
      await this.rawDepositData.fill(value);
    });
  }

  async fillRawKeys(raw: string) {
    await test.step('Fill raw deposit key data', async () => {
      await this.rawDepositData.fill(raw);
    });
  }

  async submitKeys(
    keys: DepositKey[] | DepositKey,
    tokenSymbol = TokenSymbol.STETH,
  ) {
    await test.step('Submit keys', async () => {
      const bondTokenElement = this.getBondTokenElement(tokenSymbol);
      await bondTokenElement.click();
      await this.fillKeys(keys);
      await this.page.waitForTimeout(LOW_TIMEOUT);
      await this.confirmKeysReady.click();
      await this.submitKeysButton.click();
    });
  }
}
