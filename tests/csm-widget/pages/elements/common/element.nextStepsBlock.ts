import { Locator, Page } from '@playwright/test';

export class NextStepsBlock {
  page: Page;
  block: Locator;
  beaconchainLink: Locator;
  subscribeEventsLink: Locator;
  beaconchainDashboardLink: Locator;
  /**
   * Shown only on the after-keys-upload screen: after creating an operator with
   * custom addresses the connected address keeps no role, so it has no keys
   * page to go to.
   */
  keysTabLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.block = this.page.getByTestId('nextStepsBlock');
    this.beaconchainLink = this.block.getByTestId(
      'createSuccessBeaconchainLink',
    );
    this.subscribeEventsLink = this.block.getByTestId(
      'createSuccessSubscribeEventsLink',
    );
    this.beaconchainDashboardLink = this.block.getByTestId(
      'createSuccessBeaconchainDashboardLink',
    );
    this.keysTabLink = this.block.getByTestId('createSuccessKeysTabLink');
  }
}
