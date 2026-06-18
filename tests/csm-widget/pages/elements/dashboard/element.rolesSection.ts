import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../../../shared/pages/base.page';

export class RolesSection extends BasePage {
  page: Page;

  // Section Header
  section: Locator;
  sectionHeaderLink: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;

    // Section Header
    this.section = this.page.getByTestId('dashboardRolesSection');
    this.sectionHeaderLink = this.section.getByTestId('sectionHeaderLink');
  }
}
