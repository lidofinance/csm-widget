import { expect } from '@playwright/test';
import { BasePage } from 'tests/pages';
import { test } from '../../test.fixture';
import { MatomoService } from 'tests/services/matomo.service';
import { PAGE_WAIT_TIMEOUT } from 'tests/consts/timeouts';
import { IConfig } from 'tests/config/configs/base.config';

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');
const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

test.describe('Monitoring. External links', async () => {
  let matomoEventService: MatomoService;
  let basePage: BasePage;
  let widgetConfig: IConfig;

  test.beforeEach(async ({ widgetService, widgetConfig: config }) => {
    widgetConfig = config;
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    basePage = new BasePage(widgetService.page);
    await widgetService.page.goto('/monitoring');
    await widgetService.page
      .getByRole('heading', { name: 'Monitoring' })
      .waitFor({ state: 'visible' });
  });

  test('Should open beaconcha.in page after click on "beaconcha.in v2"', async ({
    widgetService,
  }) => {
    const beaconchainBaseUrl = normalizeBaseUrl(
      widgetConfig.standConfig.monitoringConfig.urls.beaconchain,
    );
    const beaconchainUrlPattern = new RegExp(
      `^${escapeRegex(beaconchainBaseUrl)}/dashboard(?:\\?validators=[^#]*|/[A-Za-z0-9]+(?:\\?validators=[^#]*)?#summary)$`,
      'i',
    );

    const [beaconchainPage] = await Promise.all([
      basePage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_external_beaconcha_link',
      ),
      widgetService.page
        .getByRole('link', {
          name: 'beaconcha.in v2',
        })
        .click(),
    ]);

    await expect(beaconchainPage).toHaveURL(beaconchainUrlPattern);
  });

  test('Should open Lido Fees monitoring after click', async ({
    widgetService,
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
      basePage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_external_mev_monitoring_link',
      ),
      widgetService.page
        .getByRole('link', {
          name: 'Lido Fees monitoring',
        })
        .click(),
    ]);

    await expect(feesMonitoringPage).toHaveURL(feesMonitoringUrlPattern);
  });

  test('Should open Lido Operators Portal after click', async ({
    widgetService,
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
      basePage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_external_operators_link',
      ),
      widgetService.page
        .getByRole('link', {
          name: 'Lido Operators Portal',
        })
        .click(),
    ]);

    await expect(operatorsPortalPage).toHaveURL(operatorsUrlPattern);
  });

  test('Should open CSM Sentinel after click', async ({ widgetService }) => {
    const csmSentinelUrl = normalizeBaseUrl(
      widgetConfig.standConfig.monitoringConfig.urls.csmSentinel,
    );

    const [csmSentinelPage] = await Promise.all([
      basePage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_notification_sentinel_link',
      ),
      widgetService.page
        .getByRole('link', {
          name: 'CSM Sentinel',
        })
        .click(),
    ]);

    await expect(csmSentinelPage).toHaveURL(
      new RegExp(`^${escapeRegex(csmSentinelUrl)}/?$`, 'i'),
    );
  });

  test('Should open beaconcha.in Entity after click', async ({
    widgetService,
  }) => {
    const beaconchainEntityBaseUrl =
      widgetConfig.standConfig.monitoringConfig.urls.beaconchainEntity;
    test.skip(
      !beaconchainEntityBaseUrl,
      'beaconcha.in Entity link is not configured for this environment',
    );
    if (!beaconchainEntityBaseUrl) return;

    const beaconchainEntityUrlPattern = new RegExp(
      `^${escapeRegex(normalizeBaseUrl(beaconchainEntityBaseUrl))}/entity/Lido%20CSM/CSM%20Operator%20\\d+/?$`,
      'i',
    );

    const [beaconchainEntityPage] = await Promise.all([
      basePage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_external_beaconcha_entity_link',
      ),
      widgetService.page
        .getByRole('link', {
          name: 'beaconcha.in Entity',
        })
        .click(),
    ]);

    await expect(beaconchainEntityPage).toHaveURL(beaconchainEntityUrlPattern);
  });

  test('Should open Rated explorer after click', async ({ widgetService }) => {
    const ratedBaseUrl = widgetConfig.standConfig.monitoringConfig.urls.rated;
    test.skip(
      !ratedBaseUrl,
      'Rated link is not configured for this environment',
    );
    if (!ratedBaseUrl) return;

    const ratedOrigin = new URL(ratedBaseUrl).origin;
    const ratedUrlPattern = new RegExp(
      `^${escapeRegex(ratedOrigin)}/o/.+\\?network=[A-Za-z0-9-]+(?:&.*)?$`,
      'i',
    );

    const [ratedPage] = await Promise.all([
      basePage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_external_rated_link',
      ),
      widgetService.page
        .getByRole('link', {
          name: 'Rated explorer',
        })
        .click(),
    ]);

    await expect(ratedPage).toHaveURL(ratedUrlPattern);
  });

  test('Should open MigaLabs after click', async ({ widgetService }) => {
    const migaLabsBaseUrl =
      widgetConfig.standConfig.monitoringConfig.urls.migaLabs;
    test.skip(
      !migaLabsBaseUrl,
      'MigaLabs link is not configured for this environment',
    );
    if (!migaLabsBaseUrl) return;

    const migaLabsUrl = new URL(migaLabsBaseUrl);
    const migaLabsHostPattern = migaLabsUrl.hostname.startsWith('www.')
      ? escapeRegex(migaLabsUrl.hostname)
      : `(?:www\\.)?${escapeRegex(migaLabsUrl.hostname)}`;
    const migaLabsUrlPattern = new RegExp(
      `^${escapeRegex(migaLabsUrl.protocol)}//${migaLabsHostPattern}${escapeRegex(normalizeBaseUrl(migaLabsUrl.pathname))}/csm_operator\\d+_lido\\?network=[A-Za-z0-9-]+(?:&.*)?$`,
      'i',
    );

    const [migaLabsPage] = await Promise.all([
      basePage.waitForPage(PAGE_WAIT_TIMEOUT),
      matomoEventService.waitForEvent(
        'e_n',
        'csm_widget_dashboard_external_migalabs_link',
      ),
      widgetService.page
        .getByRole('link', {
          name: 'MigaLabs',
        })
        .click(),
    ]);

    await expect(migaLabsPage).toHaveURL(migaLabsUrlPattern);
  });
});
