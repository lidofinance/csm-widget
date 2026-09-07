import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class RewardsHistoryPage extends BasePage {
  table: Locator;
  rows: Locator;
  exportButton: Locator;

  constructor(public page: Page) {
    super(page);
    this.table = this.page.getByTestId('rewardsHistoryTable');
    this.rows = this.table.getByTestId('rewardsHistoryRow');
    this.exportButton = this.page.getByTestId('rewardsHistoryExportButton');
  }

  async open() {
    await test.step('Open Rewards History page', async () => {
      await this.openWithRetry('/bond/rewards-history', this.pageTitle);
    });
  }
}
