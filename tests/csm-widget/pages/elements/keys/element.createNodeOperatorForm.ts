import { Locator, Page, expect, test } from '@playwright/test';
import {
  BOND_TOKEN_OPTION_TEST_ID,
  EXTRA_PER_KEY,
  FIRST_BOND,
  TokenSymbol,
} from 'tests/shared/consts/common.const';
import { BasePage } from '../../../../shared/pages/base.page';
import { DepositKey } from 'tests/shared/services/keysGenerator.service';

export class CreateNodeOperatorForm {
  page: Page;
  base: BasePage;
  formBlock: Locator;
  rawDepositData: Locator;
  confirmKeysReady: Locator;
  submitKeysButton: Locator;
  amountInput: Locator;
  validationInputError: Locator;
  specifyCustomAdresses: Locator;
  extendedManagerPermissionsRadio: Locator;
  customRewardAddressCurrentButton: Locator;
  customManagerAddressCurrentButton: Locator;

  // Parsed tab
  depositDataRow: Locator;

  constructor(page: Page) {
    this.page = page;
    this.base = new BasePage(page);
    this.formBlock = this.page.getByTestId('submitKeysForm');
    this.rawDepositData = this.formBlock.locator('[name="rawDepositData"]');
    this.confirmKeysReady = this.formBlock.locator(
      'label:has([name="confirmKeysReady"])',
    );
    this.submitKeysButton = this.formBlock.getByTestId('submitKeysButton');
    this.amountInput = this.formBlock.getByTestId('amountInput');
    this.validationInputError = this.formBlock.getByTestId(
      'input-message-error',
    );
    this.specifyCustomAdresses = this.formBlock
      .getByText('Specify custom addresses', { exact: true })
      .first();
    this.extendedManagerPermissionsRadio = this.formBlock
      .locator(
        'xpath=//input[@name="extendedManagerPermissions"]/ancestor::label',
      )
      .getByText('Extended');

    this.customRewardAddressCurrentButton = this.formBlock
      .locator('xpath=//input[@name="rewardsAddress"]/ancestor::label/..')
      .getByRole('button', { name: 'Connected address' });

    this.customManagerAddressCurrentButton = this.formBlock
      .locator('xpath=//input[@name="managerAddress"]/ancestor::label/..')
      .getByRole('button', { name: 'Connected address' });

    // Parsed tab
    this.depositDataRow = this.formBlock.getByTestId('deposit-data-row');
  }

  async selectBondToken(tokenSymbol: TokenSymbol) {
    await test.step(`Select "${tokenSymbol}" bond token`, async () => {
      await this.formBlock.getByTestId('tokenSelectTrigger').click();
      await this.formBlock
        .getByTestId(BOND_TOKEN_OPTION_TEST_ID[tokenSymbol])
        .click();
    });
  }

  async selectTab(tabName: 'JSON' | 'Parsed' | 'Parameters') {
    return test.step(`Select "${tabName}" tab`, async () => {
      await this.formBlock.getByTestId(`tab-button-${tabName}`).click();
    });
  }

  async fillKeys(keys: DepositKey[]) {
    await test.step('Fill deposit key data', async () => {
      const value = JSON.stringify(keys);
      await this.rawDepositData.fill(value);
    });
  }

  async addNewKeys(keys: DepositKey[], tokenSymbol: TokenSymbol) {
    await test.step('Add new keys', async () => {
      await this.selectBondToken(tokenSymbol);
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

      await this.submitKeysButton.click();
    });
  }

  async submitNewKeys(keys: DepositKey[], tokenSymbol: TokenSymbol) {
    await test.step('Create operator with new key(s)', async () => {
      await this.selectBondToken(tokenSymbol);
      await this.fillKeys(keys);
      await this.confirmKeysReady.click();
      await this.submitKeysButton.click();
    });
  }
}
