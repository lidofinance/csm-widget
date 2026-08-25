import { trimAddress } from '@lidofinance/address';
import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class RemovePage extends BasePage {
  page: Page;
  removeKeysForm: Locator;
  keyCheckbox: Locator;
  numberOfKeysToRemove: Locator;
  numberOfKeysToRemoveValue: Locator;
  ejectionCostInput: Locator;
  ejectionCostLabel: Locator;
  ejectionCostInputSVG: Locator;

  removalFeeInfoTooltipText: Locator;

  excessBondAfterExecution: Locator;
  removeKeysButton: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    this.removeKeysForm = this.page.getByTestId('removeKeysForm');
    this.keyCheckbox = this.removeKeysForm.locator('label >> svg');
    this.numberOfKeysToRemove = this.removeKeysForm.getByTestId(
      'numbersOfKeysToRemove',
    );
    this.numberOfKeysToRemoveValue = this.numberOfKeysToRemove
      .locator('div')
      .nth(1);
    this.ejectionCostInput = this.removeKeysForm.getByTestId(
      'ejectionCostAmountInput',
    );
    this.ejectionCostLabel = this.removeKeysForm.locator(
      'xpath=//input[@data-testid="ejectionCostAmountInput"]/ancestor::label',
    );
    this.ejectionCostInputSVG = this.ejectionCostLabel.locator('svg');

    this.removalFeeInfoTooltipText = this.page.locator('#lido-ui-modal-root');

    this.excessBondAfterExecution = this.removeKeysForm.getByTestId(
      'excessBondAfterExecution',
    );
    this.removeKeysButton = this.removeKeysForm.getByRole('button', {
      name: 'Remove Keys',
    });
  }

  async open() {
    await test.step('Open remove tab for Keys page', async () => {
      await this.openWithRetry('/keys/remove', this.removeKeysForm);
    });
  }

  getCheckboxByAddress(key: string) {
    const trimmedPubkey = trimAddress(`0x${key}`, 16);
    return this.page
      .locator('label', { hasText: trimmedPubkey })
      .locator('svg');
  }

  async getRandomKeys(count = 1) {
    const checkboxes = this.removeKeysForm.locator('label >> svg');
    const elCount = await checkboxes.count();

    if (count > elCount) {
      throw new Error(
        `Requested ${count} keys, but only ${elCount} were found.`,
      );
    }

    const indices = new Set<number>();
    while (indices.size < count) {
      indices.add(Math.floor(Math.random() * elCount));
    }

    const randomElements = Array.from(indices).map((i) => checkboxes.nth(i));

    return randomElements;
  }
}
