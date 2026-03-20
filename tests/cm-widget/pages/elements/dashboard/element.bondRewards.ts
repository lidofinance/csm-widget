import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../../pages';
import { AvailableToClaimBlock } from './bondReward/element.availableToClaimSection';
import { BondBalanceBlock } from './bondReward/element.bondBalance';

export class BondRewards extends BasePage {
  page: Page;

  // Section Header
  section: Locator;
  sectionHeaderLink: Locator;

  availableToClaim: AvailableToClaimBlock;
  bondBalance: BondBalanceBlock;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Section Header
    this.section = this.page.getByTestId('bondRewardsSection');
    this.sectionHeaderLink = this.section.getByTestId('sectionHeaderLink');

    this.availableToClaim = new AvailableToClaimBlock(this.section);
    this.bondBalance = new BondBalanceBlock(this.section);
  }
}
