import { Locator, Page } from '@playwright/test';
import { BasePage } from '../../shared/pages/base.page';

export class NavigationPage extends BasePage {
  nav: Locator;
  pageSwitcher: Locator;

  constructor(page: Page) {
    super(page);
    this.nav = this.page.getByTestId('navBlockMain');
    this.pageSwitcher = this.page.getByTestId('pageSwitcher');
  }

  navItem(name: string) {
    return this.nav.getByTestId('navItem').filter({ hasText: name });
  }

  switcherTab(title: string) {
    return this.pageSwitcher
      .getByTestId('switcherTab')
      .filter({ hasText: title });
  }
}
