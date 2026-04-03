import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

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
    this.keysDepositableCountValue = this.keysDepositableCount.locator('> b');
  }
}
