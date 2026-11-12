import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { BalanceCard } from './elements/dashboard/element.balanceCard';
import { ClaimCard } from './elements/dashboard/element.claimCard';
import { HeaderCard } from './elements/dashboard/element.header';
import { StakeCard } from './elements/dashboard/element.stakeCard';
import { Tools } from './elements/dashboard/element.tools';

export class DashboardPage extends BasePage {
  operatorHeader: HeaderCard;
  stakeCard: StakeCard;
  balanceCard: BalanceCard;
  claimCard: ClaimCard;
  tools: Tools;

  whyModal: Locator;
  depositsPausedNotice: Locator;
  topUpDisabledNotice: Locator;

  constructor(page: Page) {
    super(page);
    this.operatorHeader = new HeaderCard(this.page);
    this.stakeCard = new StakeCard(this.page);
    this.balanceCard = new BalanceCard(this.page);
    this.claimCard = new ClaimCard(this.page);
    this.tools = new Tools(this.page);

    this.whyModal = this.page.getByTestId('whyModal');
    this.depositsPausedNotice = this.page.getByTestId('depositsPausedNotice');
    this.topUpDisabledNotice = this.page.getByTestId('topUpDisabledNotice');
  }

  async open() {
    await test.step('Open the Dasboard page', async () => {
      await this.openWithRetry('/', [this.operatorHeader.root]);
    });
  }
}
