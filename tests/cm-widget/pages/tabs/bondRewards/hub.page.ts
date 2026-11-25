import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class HubPage extends BasePage {
  claimButton: Locator;
  addBondButton: Locator;
  exportButton: Locator;
  historyCard: Locator;
  historyTable: Locator;
  rewardsRows: Locator;
  emptyState: Locator;

  constructor(public page: Page) {
    super(page);
    this.claimButton = this.page.getByTestId('claimBondButton');
    this.addBondButton = this.page.getByTestId('addBondButton');
    this.exportButton = this.page.getByRole('button', {
      name: 'Export all to CSV',
    });
    this.historyCard = this.page.getByTestId('rewardsHistoryCard');
    this.historyTable = this.page.getByTestId('rewardsHistoryTable');
    this.rewardsRows = this.page.getByTestId('rewardsHistoryRow');
    this.emptyState = this.page.getByTestId('rewardsHistoryEmpty');
  }

  async open() {
    await test.step('Open the Bond & Rewards hub', async () => {
      await this.openWithRetry('/bond', this.historyCard);
    });
  }
}
