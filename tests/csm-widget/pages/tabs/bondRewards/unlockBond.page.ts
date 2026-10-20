import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class UnlockBondPage extends BasePage {
  lockedBondAmount: Locator;
  penaltyHistory: Locator;
  penaltyHistoryRows: Locator;

  constructor(public page: Page) {
    super(page);
    this.lockedBondAmount = this.page.getByTestId('lockedBondAmount');
    this.penaltyHistory = this.page.getByTestId('penaltyHistory');
    this.penaltyHistoryRows =
      this.penaltyHistory.getByTestId('penaltyHistoryRow');
  }

  async open() {
    await test.step('Open the Locked bond page', async () => {
      await this.openWithRetry('/bond/unlock', this.lockedBondAmount);
    });
  }

  async expandPenaltyHistory() {
    await test.step('Expand Penalty History', async () => {
      const toggle = this.penaltyHistory.locator('[aria-expanded]').first();
      if ((await toggle.getAttribute('aria-expanded')) !== 'true')
        await toggle.click();
    });
  }
}
