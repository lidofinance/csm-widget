import { Page, test } from '@playwright/test';
import { BasePage } from './base.page';
import { BondRewards } from './elements/dashboard/element.bondRewards';

export class DashboardPage extends BasePage {
  bondRewards: BondRewards;

  constructor(page: Page) {
    super(page);
    this.bondRewards = new BondRewards(this.page);
  }

  async open() {
    await test.step('Open the Dasboard page', async () => {
      await this.page.goto('/');
    });
  }
}
