import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';

export class MyOperatorsPage extends BasePage {
  summary: Locator;
  summaryIssuesChip: Locator;
  cards: Locator;
  navItem: Locator;

  constructor(page: Page) {
    super(page);
    this.summary = this.page.getByTestId('myOperatorsSummary');
    this.summaryIssuesChip = this.summary.getByTestId('summaryIssuesChip');
    this.cards = this.page.getByTestId('operatorCard');
    this.navItem = this.page.getByRole('link', { name: 'My operators' });
  }

  async open() {
    await test.step('Open the My operators page', async () => {
      await this.openWithRetry('/operators', [this.summary]);
    });
  }
}
