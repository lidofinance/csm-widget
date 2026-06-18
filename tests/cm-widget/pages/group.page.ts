import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { GroupSummaryCard } from './elements/group/element.groupSummaryCard';
import { OperatorCard } from './elements/group/element.operatorCard';

export class GroupPage extends BasePage {
  backButton: Locator;
  pageTitle: Locator;
  pageSubtitle: Locator;
  summary: GroupSummaryCard;
  operatorCards: Locator;

  constructor(page: Page) {
    super(page);
    this.backButton = this.page.getByRole('link', {
      name: 'Back',
      exact: true,
    });
    this.pageTitle = this.page.locator('h1');
    this.pageSubtitle = this.page.getByTestId('pageSubtitle');
    this.summary = new GroupSummaryCard(this.page);
    this.operatorCards = this.page.getByTestId('operatorCard');
  }

  operator(operatorId: number): OperatorCard {
    const root = this.operatorCards.filter({
      has: this.page
        .getByTestId('descriptorId')
        .filter({ hasText: `#${operatorId}` }),
    });
    return new OperatorCard(this.page, root);
  }

  async open() {
    await test.step('Open Group page', async () => {
      await this.openWithRetry('/group', this.operatorCards.first());
    });
  }
}
