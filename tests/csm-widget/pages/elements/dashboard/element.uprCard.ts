import { Locator, Page } from '@playwright/test';

export class UprCard {
  root: Locator;
  value: Locator;
  deltaTag: Locator;
  period: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('uprCard');
    this.value = this.root.getByTestId('uprValue');
    this.deltaTag = this.root.getByTestId('uprDeltaTag');
    this.period = this.root.getByTestId('uprPeriod');
  }
}
