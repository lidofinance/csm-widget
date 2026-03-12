import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { MatomoService } from 'tests/services/matomo.service';
import { PAGE_WAIT_TIMEOUT } from 'tests/consts/timeouts';

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');
const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isProdOrStaging = (standType: string) =>
  standType === 'prod' || standType === 'staging';

test.describe('Monitoring. External links', async () => {
  let matomoEventService: MatomoService;

  test.beforeEach(async ({ widgetService, widgetConfig }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.monitoringPage.open();
  });

  test('Should open beaconcha.in page after click on "beaconcha.in v2"', async ({
    widgetService,
    widgetConfig,
  }) => {
    const beaconchainBaseUrl = normalizeBaseUrl(
      widgetConfig.standConfig.monitoringConfig.urls.beaconchain,
    );
    const beaconchainUrlPattern = new RegExp(
      `^${escapeRegex(beaconchainBaseUrl)}/dashboard(?:\\?validators=[^#]*|/[A-Za-z0-9]+(?:\\?validators=[^#]*)?#summary)$`,
      'i',
    );

    const [beaconchainPage] = await Promise.all([
      widgetService.monitoringPage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_external_beaconcha_link',
      ),
      widgetService.monitoringPage.beaconchainV2Link.click(),
    ]);

    await expect(beaconchainPage).toHaveURL(beaconchainUrlPattern);
  });

  test('Should open Lido Fees monitoring after click', async ({
    widgetService,
    widgetConfig,
  }) => {
    const feesMonitoringBaseUrl = normalizeBaseUrl(
      widgetConfig.standConfig.monitoringConfig.urls.feesMonitoring,
    );
    const stakingModuleIndex =
      widgetConfig.standConfig.monitoringConfig.stakingModuleIndex;
    const feesMonitoringUrlPattern = new RegExp(
      `^${escapeRegex(feesMonitoringBaseUrl)}/operatorInfo\\?stakingModuleIndex=${stakingModuleIndex}&operatorIndex=\\d+/?$`,
      'i',
    );

    const [feesMonitoringPage] = await Promise.all([
      widgetService.monitoringPage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_external_mev_monitoring_link',
      ),
      widgetService.monitoringPage.feesMonitoringLink.click(),
    ]);

    await expect(feesMonitoringPage).toHaveURL(feesMonitoringUrlPattern);
  });

  test('Should open Lido Operators Portal after click', async ({
    widgetService,
    widgetConfig,
  }) => {
    const operatorsBaseUrl = normalizeBaseUrl(
      widgetConfig.standConfig.monitoringConfig.urls.operators,
    );
    const stakingModuleIndex =
      widgetConfig.standConfig.monitoringConfig.stakingModuleIndex;
    const operatorsUrlPattern = new RegExp(
      `^${escapeRegex(operatorsBaseUrl)}/module/${stakingModuleIndex}/\\d+/?$`,
      'i',
    );

    const [operatorsPortalPage] = await Promise.all([
      widgetService.monitoringPage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_external_operators_link',
      ),
      widgetService.monitoringPage.operatorsPortalLink.click(),
    ]);

    await expect(operatorsPortalPage).toHaveURL(operatorsUrlPattern);
  });

  test('Should open CSM Sentinel after click', async ({
    widgetService,
    widgetConfig,
  }) => {
    const csmSentinelUrl = normalizeBaseUrl(
      widgetConfig.standConfig.monitoringConfig.urls.csmSentinel,
    );

    const [csmSentinelPage] = await Promise.all([
      widgetService.monitoringPage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_notification_sentinel_link',
      ),
      widgetService.monitoringPage.csmSentinelLink.click(),
    ]);

    await expect(csmSentinelPage).toHaveURL(
      new RegExp(`^${escapeRegex(csmSentinelUrl)}/?$`, 'i'),
    );
  });

  test('Should open beaconcha.in Entity after click', async ({
    widgetService,
    widgetConfig,
  }) => {
    const isExtendedMonitoringEnv = isProdOrStaging(
      widgetConfig.standConfig.standType,
    );
    test.skip(
      !isExtendedMonitoringEnv,
      'beaconcha.in Entity link is checked only for prod/staging',
    );

    const beaconchainEntityBaseUrl =
      widgetConfig.standConfig.monitoringConfig.urls.beaconchainEntity;
    if (!beaconchainEntityBaseUrl) {
      throw new Error(
        'monitoringConfig.urls.beaconchainEntity should be set for prod/staging',
      );
    }

    const beaconchainEntityUrlPattern = new RegExp(
      `^${escapeRegex(normalizeBaseUrl(beaconchainEntityBaseUrl))}/entity/Lido%20CSM/CSM%20Operator%20\\d+/?$`,
      'i',
    );

    const [beaconchainEntityPage] = await Promise.all([
      widgetService.monitoringPage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_external_beaconcha_entity_link',
      ),
      widgetService.monitoringPage.beaconchainEntityLink.click(),
    ]);

    await expect(beaconchainEntityPage).toHaveURL(beaconchainEntityUrlPattern);
  });

  test('Should open Rated explorer after click', async ({
    widgetService,
    widgetConfig,
  }) => {
    const isExtendedMonitoringEnv = isProdOrStaging(
      widgetConfig.standConfig.standType,
    );
    test.skip(
      !isExtendedMonitoringEnv,
      'Rated link is checked only for prod/staging',
    );

    const ratedBaseUrl = widgetConfig.standConfig.monitoringConfig.urls.rated;
    if (!ratedBaseUrl) {
      throw new Error(
        'monitoringConfig.urls.rated should be set for prod/staging',
      );
    }

    const ratedOrigin = new URL(ratedBaseUrl).origin;
    const ratedUrlPattern = new RegExp(
      `^${escapeRegex(ratedOrigin)}/o/.+\\?network=[A-Za-z0-9-]+(?:&.*)?$`,
      'i',
    );

    const [ratedPage] = await Promise.all([
      widgetService.monitoringPage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_external_rated_link',
      ),
      widgetService.monitoringPage.ratedExplorerLink.click(),
    ]);

    await expect(ratedPage).toHaveURL(ratedUrlPattern);
  });

  test('Should open MigaLabs after click', async ({
    widgetService,
    widgetConfig,
  }) => {
    const isExtendedMonitoringEnv = isProdOrStaging(
      widgetConfig.standConfig.standType,
    );
    test.skip(
      !isExtendedMonitoringEnv,
      'MigaLabs link is checked only for prod/staging',
    );

    const migaLabsBaseUrl =
      widgetConfig.standConfig.monitoringConfig.urls.migaLabs;
    if (!migaLabsBaseUrl) {
      throw new Error(
        'monitoringConfig.urls.migaLabs should be set for prod/staging',
      );
    }

    const migaLabsUrl = new URL(migaLabsBaseUrl);
    const migaLabsHostPattern = migaLabsUrl.hostname.startsWith('www.')
      ? escapeRegex(migaLabsUrl.hostname)
      : `(?:www\\.)?${escapeRegex(migaLabsUrl.hostname)}`;
    const migaLabsUrlPattern = new RegExp(
      `^${escapeRegex(migaLabsUrl.protocol)}//${migaLabsHostPattern}${escapeRegex(normalizeBaseUrl(migaLabsUrl.pathname))}/csm_operator\\d+_lido\\?network=[A-Za-z0-9-]+(?:&.*)?$`,
      'i',
    );

    const [migaLabsPage] = await Promise.all([
      widgetService.monitoringPage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_external_migalabs_link',
      ),
      widgetService.monitoringPage.migaLabsLink.click(),
    ]);

    await expect(migaLabsPage).toHaveURL(migaLabsUrlPattern);
  });
});
