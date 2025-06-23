import { Locator, Page, test } from '@playwright/test';
import { BasePage } from './base.page';
import { BondRewards } from './elements/dashboard/element.bondRewards';
import { COMMON_ACTION_TIMEOUT } from 'tests/consts/timeouts';

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
      await this.page.goto('/');
    });

    await test.step('Wait for balance loaded', async () => {
      await this.waitForTextContent(
        this.bondRewards.latestRewardsDistribution.commonBalance_Text,
        COMMON_ACTION_TIMEOUT,
      );
    });
  }
}
