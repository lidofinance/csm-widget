import { Locator, Page } from '@playwright/test';
import { BasePage } from 'tests/pages';

export class KeysSection extends BasePage {
  page: Page;

  // Section Header
  section: Locator;
  sectionHeaderLink: Locator;

  keysDepositableCount: Locator;
  keysDepositableCountValue: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Section Header
    this.section = this.page.getByTestId('dashboardKeysSection');
    this.sectionHeaderLink = this.section.getByTestId('sectionHeaderLink');

    this.keysDepositableCount = this.section.getByTestId(
      'keysDepositableCount',
    );
    this.keysDepositableCountValue = this.keysDepositableCount.locator('span');
  }
}
