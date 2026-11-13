import { Locator, Page } from '@playwright/test';

export class ClaimCard {
  root: Locator;
  link: Locator;
  availableToClaimBalance: Locator;
  lastRewardsBlock: Locator;
  lastRewardsValue: Locator;
  lastRewardsIcon: Locator;
  reportFrame: Locator;
  whyLink: Locator;
  distributionTxLink: Locator;
  nextRewardsInfo: Locator;
  expectedDays: Locator;
  nextReportFrame: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('availableToClaimBlock');
    this.link = this.root.getByTestId('sectionHeaderLink');
    this.availableToClaimBalance = this.root.getByTestId(
      'availableToClaimBalance',
    );
    this.lastRewardsBlock = this.root.getByTestId('lastRewardsBlock');
    this.lastRewardsValue = this.lastRewardsBlock.getByTestId('rowHeader');
    this.lastRewardsIcon = this.lastRewardsBlock.getByTestId('iconTooltip');
    this.reportFrame = this.lastRewardsBlock.getByTestId('reportFrame');
    this.whyLink = this.lastRewardsBlock.getByTestId('whyLink');
    this.distributionTxLink =
      this.lastRewardsBlock.getByTestId('distributionTxLink');
    this.nextRewardsInfo = this.root.getByTestId('nextRewardsInfo');
    this.expectedDays = this.nextRewardsInfo.getByTestId('expectedDays');
    this.nextReportFrame = this.nextRewardsInfo.getByTestId('nextReportFrame');
  }
}
