import { Locator, Page } from '@playwright/test';
import { BasePage } from 'tests/pages';
import { AvailableToClaimBlock } from './bondReward/element.availableToClaimSection';
import { BondBalanceBlock } from './bondReward/element.bondBalance';
import { LatestRewardsDistributionBlock } from './bondReward/element.latestRewardsDistribution';

export class BondRewards extends BasePage {
  page: Page;

  // Section Header
  section: Locator;
  sectionHeaderLink: Locator;

  availableToClaim: AvailableToClaimBlock;
  bondBalance: BondBalanceBlock;
  latestRewardsDistribution: LatestRewardsDistributionBlock;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Section Header
    this.section = this.page.getByTestId('bondRewardsSection');
    this.sectionHeaderLink = this.section.getByTestId('sectionHeaderLink');

    this.availableToClaim = new AvailableToClaimBlock(this.section);
    this.bondBalance = new BondBalanceBlock(this.section);
    this.latestRewardsDistribution = new LatestRewardsDistributionBlock(
      this.section,
    );
  }
}
