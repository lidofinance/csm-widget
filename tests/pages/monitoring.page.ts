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
      'monitoring-beaconchain-v2-link',
    );
    this.feesMonitoringLink = this.page.getByTestId('monitoring-fees-link');
    this.operatorsPortalLink = this.page.getByTestId(
      'monitoring-operators-portal-link',
    );
    this.csmSentinelLink = this.page.getByTestId(
      'monitoring-csm-sentinel-link',
    );
    this.beaconchainEntityLink = this.page.getByTestId(
      'monitoring-beaconchain-entity-link',
    );
    this.ratedExplorerLink = this.page.getByTestId(
      'monitoring-rated-explorer-link',
    );
    this.migaLabsLink = this.page.getByTestId('monitoring-migalabs-link');
  }

  async open() {
    await test.step('Open Monitoring page', async () => {
      await this.page.goto('/monitoring');
      await this.heading.waitFor({ state: 'visible' });
    });
  }
}
