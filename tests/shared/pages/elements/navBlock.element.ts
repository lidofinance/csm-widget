import { Locator, Page } from '@playwright/test';

export class NavBlockElement {
  navBlockMain: Locator;

  constructor(public page: Page) {
    this.navBlockMain = this.page.getByTestId('navBlockMain');
  }
}
