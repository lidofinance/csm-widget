import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../../pages';

export class RolesSection extends BasePage {
  page: Page;

  // Section Header
  section: Locator;
  sectionHeaderLink: Locator;

  rewardAddressRow: Locator;
  managerAddressRow: Locator;
  claimerAddressRow: Locator;
  feeSplitsRow: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Section Header
    this.section = this.page.getByTestId('rolesSection');
    this.sectionHeaderLink = this.section.getByTestId('sectionHeaderLink');

    // Rows
    this.rewardAddressRow = this.section.getByTestId('rewardsAddressRow');
    this.managerAddressRow = this.section.getByTestId('managerAddressRow');
    this.claimerAddressRow = this.section.getByTestId('claimerAddressRow');
    this.feeSplitsRow = this.section.getByTestId('feeSplitsRow');
  }
}
