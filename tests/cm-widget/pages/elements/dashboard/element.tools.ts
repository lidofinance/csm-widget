import { Locator, Page } from '@playwright/test';

export class Tools {
  section: Locator;
  sentinel: Locator;
  entity: Locator;
  rated: Locator;
  ethseer: Locator;
  beaconchainV2: Locator;
  operatorsPortal: Locator;
  mevMonitoring: Locator;
  testnet: Locator;

  constructor(page: Page) {
    this.section = page.getByTestId('toolsSection');
    this.sentinel = page.getByTestId('monitoringCsmSentinelLink');
    this.entity = page.getByTestId('monitoringBeaconchainEntityLink');
    this.rated = page.getByTestId('monitoringRatedExplorerLink');
    this.ethseer = page.getByTestId('monitoringMigaLabsLink');
    this.beaconchainV2 = page.getByTestId('monitoringBeaconchainV2Link');
    this.operatorsPortal = page.getByTestId('monitoringOperatorsPortalLink');
    this.mevMonitoring = page.getByTestId('monitoringFeesLink');
    this.testnet = page.getByTestId('toolTestnetLink');
  }
}
