import { Locator, Page, test } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';
import { GroupSummaryCard } from './elements/group/element.groupSummaryCard';
import { OperatorCard } from './elements/group/element.operatorCard';

export class GroupPage extends BasePage {
  myOperatorsCrumb: Locator;
  sectionTitle: Locator;
  groupSection: Locator;
  summary: GroupSummaryCard;
  operatorCards: Locator;

  constructor(page: Page) {
    super(page);
    this.myOperatorsCrumb = this.page
      .getByRole('navigation', { name: 'Breadcrumb' })
      .getByRole('link', { name: 'My Operators' });
    this.sectionTitle = this.page.getByTestId('groupSectionTitle');
    this.groupSection = this.page.getByTestId('groupSection');
    this.summary = new GroupSummaryCard(this.page);
    this.operatorCards = this.page.getByTestId('operatorCard');
  }

  operator(operatorId: number): OperatorCard {
    const root = this.operatorCards.and(
      this.page.locator(`[data-operator-id="${operatorId}"]`),
    );
    return new OperatorCard(this.page, root);
  }

  async open() {
    await test.step('Open Group page', async () => {
      await this.openWithRetry('/group', this.groupSection);
    });
  }
}
