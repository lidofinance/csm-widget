import { Locator, Page, test } from '@playwright/test';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';

export class SelectOperatorModalElement {
  page: Page;
  modal: Locator;
  rows: Locator;
  settledState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = this.page.locator('[role=dialog]', {
      hasText: 'Select Node Operator',
    });
    this.rows = this.page.getByTestId('selectModalOperatorRow');
    this.settledState = this.page
      .getByTestId('connectBtn')
      .or(this.page.getByTestId('accountSectionHeader'))
      .or(this.rows)
      .first();
  }

  async selectOperatorIfPrompted() {
    await test.step('Select a Node Operator if the widget asks', async () => {
      await this.settledState
        .waitFor({ state: 'visible', timeout: PAGE_WAIT_TIMEOUT })
        .catch(() => undefined);

      if (!(await this.rows.first().isVisible())) return;

      await this.rows.first().click();
      await this.modal.waitFor({ state: 'hidden', timeout: PAGE_WAIT_TIMEOUT });
    });
  }
}
