import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';

export class MyOperatorsPage extends BasePage {
  summary: Locator;
  summaryIssuesChip: Locator;
  summaryBondBalance: Locator;
  summaryBondBalance_Text: Locator;
  list: Locator;
  csmSection: Locator;
  csmCards: Locator;
  cards: Locator;
  navItem: Locator;

  constructor(page: Page) {
    super(page);
    this.summary = this.page.getByTestId('myOperatorsSummary');
    this.summaryIssuesChip = this.summary.getByTestId('summaryIssuesChip');
    this.summaryBondBalance = this.summary.getByTestId('summaryBondBalance');
    this.summaryBondBalance_Text =
      this.summaryBondBalance.getByTestId('textContent');
    this.list = this.page.getByTestId('myOperatorsList');
    this.csmSection = this.page.getByTestId('csmOperatorsSection');
    this.csmCards = this.csmSection.getByTestId('operatorCard');
    this.cards = this.page.getByTestId('operatorCard');
    this.navItem = this.page.getByRole('link', { name: 'My operators' });
  }

  card(id: number, module: string): Locator {
    return this.cards.and(
      this.page.locator(
        `[data-operator-id="${id}"][data-operator-module="${module}"]`,
      ),
    );
  }

  async open() {
    await test.step('Open the My operators page', async () => {
      await this.openWithRetry('/operators', [this.list]);
    });
  }
}
