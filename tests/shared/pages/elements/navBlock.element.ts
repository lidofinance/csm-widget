import { Locator, Page } from '@playwright/test';

export class NavBlockElement {
  navBlockMain: Locator;
  pageSwitcher: Locator;

  constructor(public page: Page) {
    this.navBlockMain = this.page.getByTestId('navBlockMain');
    this.pageSwitcher = this.page.getByTestId('pageSwitcher');
  }

  navItem(name: string) {
    return this.navBlockMain.getByTestId('navItem').filter({ hasText: name });
  }

  /** Invites, invalid keys, locked bond — whatever counter the item carries. */
  navCounter(name: string) {
    return this.navItem(name).getByTestId('navCounter');
  }

  switcherTab(title: string) {
    return this.pageSwitcher
      .getByTestId('switcherTab')
      .filter({ hasText: title });
  }

  deleteKeysCard(title: string) {
    return this.page.getByTestId('deleteKeysCard').filter({ hasText: title });
  }
}
