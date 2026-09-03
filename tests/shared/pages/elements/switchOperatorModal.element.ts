import { Locator, Page } from '@playwright/test';

export class SwitchOperatorModalElement {
  page: Page;
  modal: Locator;
  rows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modal = this.page.getByTestId('switchOperatorModal');
    this.rows = this.modal.getByTestId('switchModalOperatorRow');
  }

  rowById(nodeOperatorId: number) {
    return this.rows.filter({
      has: this.page
        .getByTestId('descriptorId')
        .getByText(String(nodeOperatorId), { exact: true }),
    });
  }

  currentBadgeById(nodeOperatorId: number) {
    return this.rowById(nodeOperatorId).getByRole('button', {
      name: 'Current',
    });
  }
}
