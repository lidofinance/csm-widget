import { trimAddress } from '@lidofinance/address';
import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class RemovePage {
  page: Page;
  base: BasePage;
  removeKeysForm: Locator;
  keyRow: Locator;
  emptyState: Locator;
  keyCheckbox: Locator;
  numberOfKeysToRemove: Locator;
  numberOfKeysToRemoveValue: Locator;
  removalFee: Locator;
  removalFeeValue: Locator;
  removalFeeInfoIcon: Locator;

  removalFeeInfoTooltipText: Locator;

  excessBondAfterExecution: Locator;
  removeKeysButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.base = new BasePage(page);
    this.removeKeysForm = this.page.getByTestId('removeKeysForm');
    this.keyRow = this.removeKeysForm.getByTestId('keyRow');
    this.emptyState = this.removeKeysForm.getByText(
      'No keys available to remove',
    );
    this.keyCheckbox = this.removeKeysForm.locator('label >> svg');
    this.numberOfKeysToRemove = this.removeKeysForm.getByTestId(
      'numbersOfKeysToRemove',
    );
    this.numberOfKeysToRemoveValue = this.removeKeysForm.getByTestId(
      'numbersOfKeysToRemoveValue',
    );
    this.removalFee = this.removeKeysForm.getByTestId('removalFee');
    this.removalFeeValue = this.removeKeysForm.getByTestId('removalFeeValue');
    this.removalFeeInfoIcon = this.removalFee.getByRole('img', {
      name: 'More info',
    });

    // app-ui tooltips portal to document.body, outside the lido-ui modal root
    this.removalFeeInfoTooltipText = this.page.getByRole('tooltip');

    this.excessBondAfterExecution = this.removeKeysForm.getByTestId(
      'excessBondAfterExecution',
    );
    this.removeKeysButton = this.removeKeysForm.getByRole('button', {
      name: 'Remove Keys',
    });
  }

  async open() {
    await test.step('Open remove tab for Keys page', async () => {
      // an empty operator has no key rows, so accept the empty state too
      await this.base.openWithRetry(
        '/keys/delete?mode=remove',
        this.keyRow.first().or(this.emptyState).first(),
      );
    });
  }

  getCheckboxByAddress(key: string) {
    const trimmedPubkey = trimAddress(`0x${key}`, 16);
    return this.page
      .getByTestId('keyRow')
      .filter({ hasText: trimmedPubkey })
      .locator('label svg')
      .first();
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
