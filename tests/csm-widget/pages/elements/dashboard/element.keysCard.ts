import { Locator, Page } from '@playwright/test';

export class KeysCard {
  root: Locator;
  link: Locator;
  activeCount: Locator;
  liveCount: Locator;

  constructor(page: Page) {
    this.root = page.getByTestId('dashboardKeysSection');
    this.link = this.root.getByTestId('sectionHeaderLink');
    this.activeCount = this.root.getByTestId('keysActiveCount');
    this.liveCount = this.root.getByTestId('keysLiveCount');
  }
}
