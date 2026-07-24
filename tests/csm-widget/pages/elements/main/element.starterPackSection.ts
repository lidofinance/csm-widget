import { Locator, Page } from '@playwright/test';

export class StarterPackSection {
  page: Page;
  section: Locator;
  createNodeOperatorBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.section = this.page.getByTestId('starterPackSection');
    this.createNodeOperatorBtn = this.section
      .locator('button')
      .getByText('Create Node Operator');
  }
}
