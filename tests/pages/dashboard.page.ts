import { Locator, Page, test } from '@playwright/test';
import { BasePage } from './base.page';
import { BondRewards } from './elements/dashboard/element.bondRewards';

export class DashboardPage extends BasePage {
  bondRewards: BondRewards;

  whyModal: Locator;

  constructor(page: Page) {
    super(page);
    this.bondRewards = new BondRewards(this.page);

    this.whyModal = this.page.getByTestId('whyModal');
  }

  async open() {
    await test.step('Open the Dasboard page', async () => {
      await this.openWithRetry(
        '/',
        this.bondRewards.latestRewardsDistribution.commonBalance_Text,
      );
    });
  }
}
