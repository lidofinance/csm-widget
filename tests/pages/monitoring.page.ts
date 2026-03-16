import { Locator, Page, test } from '@playwright/test';
import { BasePage } from './base.page';

export class MonitoringPage extends BasePage {
  heading: Locator;
  beaconchainV2Link: Locator;
  feesMonitoringLink: Locator;
  operatorsPortalLink: Locator;
  csmSentinelLink: Locator;
  beaconchainEntityLink: Locator;
  ratedExplorerLink: Locator;
  migaLabsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = this.page.getByRole('heading', { name: 'Monitoring' });
    this.beaconchainV2Link = this.page.getByTestId(
      'monitoringBeaconchainV2Link',
    );
    this.feesMonitoringLink = this.page.getByTestId('monitoringFeesLink');
    this.operatorsPortalLink = this.page.getByTestId(
      'monitoringOperatorsPortalLink',
    );
    this.csmSentinelLink = this.page.getByTestId('monitoringCsmSentinelLink');
    this.beaconchainEntityLink = this.page.getByTestId(
      'monitoringBeaconchainEntityLink',
    );
    this.ratedExplorerLink = this.page.getByTestId(
      'monitoringRatedExplorerLink',
    );
    this.migaLabsLink = this.page.getByTestId('monitoringMigaLabsLink');
  }

  async open() {
    await test.step('Open Monitoring page', async () => {
      await this.page.goto('/monitoring');
      await this.heading.waitFor({ state: 'visible' });
    });
  }
}
