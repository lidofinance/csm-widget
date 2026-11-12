import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { BalanceCard } from './elements/dashboard/element.balanceCard';
import { ClaimCard } from './elements/dashboard/element.claimCard';
import { HeaderCard } from './elements/dashboard/element.header';
import { KeysCard } from './elements/dashboard/element.keysCard';
import { UprCard } from './elements/dashboard/element.uprCard';
import { Tools } from './elements/dashboard/element.tools';

export class DashboardPage extends BasePage {
  operatorHeader: HeaderCard;
  keysCard: KeysCard;
  uprCard: UprCard;
  balanceCard: BalanceCard;
  claimCard: ClaimCard;
  tools: Tools;

  whyModal: Locator;

  constructor(page: Page) {
    super(page);
    this.operatorHeader = new HeaderCard(this.page);
    this.keysCard = new KeysCard(this.page);
    this.uprCard = new UprCard(this.page);
    this.balanceCard = new BalanceCard(this.page);
    this.claimCard = new ClaimCard(this.page);
    this.tools = new Tools(this.page);

    this.whyModal = this.page.getByTestId('whyModal');
  }

  async open() {
    await test.step('Open the Dasboard page', async () => {
      await this.openWithRetry('/', [this.operatorHeader.root]);
    });
  }
}
