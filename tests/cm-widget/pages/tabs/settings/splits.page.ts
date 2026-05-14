import { Locator, Page, test } from '@playwright/test';
import { WalletPage } from '@lidofinance/wallets-testing-wallets';
import {
  PAGE_WAIT_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
} from 'tests/shared/consts/timeouts';
import { BasePage } from '../../../../shared/pages/base.page';

type SplitEntry = { address: string; share: string };

export class SplitsPage extends BasePage {
  form: Locator;
  splitsActionButton: Locator;
  addSplitButton: Locator;
  saveSplitsButton: Locator;

  constructor(
    public page: Page,
    public walletPage: WalletPage,
  ) {
    super(page);
    this.form = this.page.getByTestId('splitsForm');
    this.splitsActionButton = this.form.getByTestId('splitsActionButton');
    this.addSplitButton = this.form.getByTestId('addSplitButton');
    this.saveSplitsButton = this.form.getByRole('button', {
      name: 'Save splits',
      exact: true,
    });
  }

  async open() {
    await test.step('Open Splits settings page', async () => {
      await this.openWithRetry('/settings/splits', this.form);
    });
  }

  getAddressInput(index: number) {
    return this.form.locator(`input[name="feeSplits.${index}.recipient"]`);
  }

  getShareInput(index: number) {
    return this.form.locator(`input[name="feeSplits.${index}.share"]`);
  }

  async clickSetupSplits() {
    await test.step('Enter edit mode', async () => {
      await this.splitsActionButton.click();
      await this.addSplitButton.waitFor({
        state: 'visible',
        timeout: PAGE_WAIT_TIMEOUT,
      });
    });
  }

  async addSplit(index: number, { address, share }: SplitEntry) {
    await test.step(`Add split #${index + 1}: ${address} @ ${share}%`, async () => {
      await this.addSplitButton.click();
      const addressInput = this.getAddressInput(index);
      await addressInput.fill(address);
      await addressInput.blur();
      const shareInput = this.getShareInput(index);
      await shareInput.fill(share);
      await shareInput.blur();
    });
  }

  async submitAndConfirm() {
    await test.step('Submit splits configuration', async () => {
      await this.saveSplitsButton.click();

      await test.step('Confirm in modal', async () => {
        await this.page
          .getByRole('button', { name: 'Confirm', exact: true })
          .click();
      });

      await test.step('Confirm wallet transaction', async () => {
        await this.page.waitForSelector(
          'text=Confirm this transaction in your wallet',
          { timeout: PAGE_WAIT_TIMEOUT },
        );
        await this.walletPage.confirmTx();
      });

      await test.step('Wait for success', async () => {
        await this.page.waitForSelector(
          'text=Fee splitter configuration has been updated',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
      });
    });
  }
}
