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
      hasText: 'Choose a Node Operator',
    });
    this.rows = this.page.getByTestId('selectModalOperatorRow');
    this.settledState = this.page
      .getByTestId('connectBtn')
      .or(this.page.getByTestId('navBlockMain'))
      .or(this.page.getByTestId('nodeOperatorHeader'))
      .or(this.rows)
      .first();
  }

  async selectOperatorIfPrompted() {
    await test.step('Select a Node Operator if the widget asks', async () => {
      await this.settledState
        .waitFor({ state: 'visible', timeout: PAGE_WAIT_TIMEOUT })
        .catch(() => undefined);

      if (!(await this.rows.first().isVisible())) {
        const trigger = this.page.getByTestId('nodeOperatorHeader');
        const promptPending = await trigger
          .filter({ hasText: 'Choose a Node Operator' })
          .isVisible();
        if (!promptPending) return;
        await this.rows
          .first()
          .waitFor({ state: 'visible', timeout: PAGE_WAIT_TIMEOUT });
      }

      await this.rows.first().click();
      await this.modal.waitFor({ state: 'hidden', timeout: PAGE_WAIT_TIMEOUT });
    });
  }
}
