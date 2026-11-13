import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class TableRow {
  pubkeyCell: Locator;
  statusCell: Locator;
  statusCommentCell: Locator;
  strikesCountCell: Locator;
  strikesDots: Locator;

  constructor(tr: Locator) {
    this.pubkeyCell = tr.getByTestId('pubkeyCell');
    this.statusCell = tr.getByTestId('statusCell');
    this.statusCommentCell = tr.getByTestId('statusCommentCell');
    this.strikesCountCell = tr.getByTestId('strikesCountCell');
    this.strikesDots = this.strikesCountCell.getByRole('img');
  }

  async strikesCount(): Promise<number | undefined> {
    const label = await this.strikesDots.getAttribute('aria-label');
    const match = label?.match(/^(\d+)\/\d+ strikes$/);
    return match ? Number(match[1]) : undefined;
  }
}

export class KeysViewPage {
  page: Page;
  base: BasePage;
  viewKeysBlock: Locator;
  table: Locator;
  tableRows: Locator;
  loader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.base = new BasePage(page);
    this.viewKeysBlock = this.page.locator('[data-testid="viewKeysBlock"]');
    this.table = this.viewKeysBlock.locator('tbody');
    this.tableRows = this.viewKeysBlock.locator('tbody >> tr');
    this.loader = this.viewKeysBlock.getByTestId('loader');
  }

  async getAllTableRows() {
    const rows = await this.tableRows.all();
    const rowsObj = [];
    for (const trRow of rows) {
      rowsObj.push(new TableRow(trRow));
    }
    return rowsObj;
  }

  async getRowByStatus(status: string) {
    const rows = await this.getAllTableRows();
    for (const trRow of rows) {
      const trStatus = await trRow.statusCell.textContent();
      if (trStatus?.includes(status)) {
        return trRow;
      }
    }
  }

  async open() {
    await test.step('Open keys view tab for Keys page', async () => {
      await this.base.openWithRetry('/keys', this.viewKeysBlock);
    });
  }
}
