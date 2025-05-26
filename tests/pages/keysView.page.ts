import { Locator, Page, test } from '@playwright/test';
import { BasePage } from 'tests/pages/base.page';

export class TableRaw {
  pubkeyCell: Locator;
  statusCell: Locator;
  statusCommentCell: Locator;
  constructor(tr: Locator) {
    this.pubkeyCell = tr.getByTestId('pubkeyCell');
    this.statusCell = tr.getByTestId('statusCell');
    this.statusCommentCell = tr.getByTestId('statusCommentCell');
  }
}

export class KeysViewPage {
  page: Page;
  base: BasePage;
  viewKeysBlock: Locator;
  table: Locator;
  tableRaws: Locator;

  constructor(page: Page) {
    this.page = page;
    this.base = new BasePage(page);
    this.viewKeysBlock = this.page.locator('[data-testid="viewKeysBlock"]');
    this.table = this.viewKeysBlock.locator('tbody');
    this.tableRaws = this.viewKeysBlock.locator('tbody >> tr');
  }

  async getAllTableRaws() {
    const raws = await this.tableRaws.all();
    const rawsObj = [];
    for (const trRaw of raws) {
      rawsObj.push(new TableRaw(trRaw));
    }
    return rawsObj;
  }

  async open() {
    await test.step('Open keys view tab for Keys page', async () => {
      await this.page.goto('/keys/view');
    });
  }
}
