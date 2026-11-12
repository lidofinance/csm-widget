import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { test } from '../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '');
const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const isProdOrStaging = (standType: string) =>
  standType === 'prod' || standType === 'staging';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.dashboard,
    feature: 'Tools',
    story: 'External links',
  }),
  async () => {
    let matomoEventService: MatomoService;

    test.beforeEach(async ({ widgetService, widgetConfig }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.dashboardPage.open();
    });

    test(
      qase(
        423,
        'Should open beaconcha.in page after click on "beaconcha.in v2"',
      ),
      async ({ widgetService, widgetConfig }) => {
        const beaconchainBaseUrl = normalizeBaseUrl(
          widgetConfig.standConfig.toolsConfig.urls.beaconchain,
        );
        const beaconchainUrlPattern = new RegExp(
          `^${escapeRegex(beaconchainBaseUrl)}/dashboard(?:\\?validators=[^#]*|/[A-Za-z0-9]+(?:\\?validators=[^#]*)?#summary)$`,
          'i',
        );

        const [beaconchainPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_dashboard_external_beaconcha_link',
          ),
          widgetService.dashboardPage.tools.beaconchainV2.click(),
        ]);

        await expect(beaconchainPage).toHaveURL(beaconchainUrlPattern);
      },
    );

    test(
      qase(424, 'Should open Lido MEV monitoring after click'),
      async ({ widgetService, widgetConfig }) => {
        const feesMonitoringBaseUrl = normalizeBaseUrl(
          widgetConfig.standConfig.toolsConfig.urls.feesMonitoring,
        );
        const stakingModuleIndex =
          widgetConfig.standConfig.toolsConfig.stakingModuleIndex;
        const feesMonitoringUrlPattern = new RegExp(
          `^${escapeRegex(feesMonitoringBaseUrl)}/operatorInfo\\?stakingModuleIndex=${stakingModuleIndex}&operatorIndex=\\d+/?$`,
          'i',
        );

        const [feesPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_dashboard_external_mev_monitoring_link',
          ),
          widgetService.dashboardPage.tools.mevMonitoring.click(),
        ]);

        await expect(feesPage).toHaveURL(feesMonitoringUrlPattern);
      },
    );

    test(
      qase(425, 'Should open Lido operators after click'),
      async ({ widgetService, widgetConfig }) => {
        const operatorsBaseUrl = normalizeBaseUrl(
          widgetConfig.standConfig.toolsConfig.urls.operators,
        );
        const stakingModuleIndex =
          widgetConfig.standConfig.toolsConfig.stakingModuleIndex;
        const operatorsUrlPattern = new RegExp(
          `^${escapeRegex(operatorsBaseUrl)}/module/${stakingModuleIndex}/\\d+/?$`,
          'i',
        );

        const [operatorsPortalPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_dashboard_external_operators_link',
          ),
          widgetService.dashboardPage.tools.operatorsPortal.click(),
        ]);

        await expect(operatorsPortalPage).toHaveURL(operatorsUrlPattern);
      },
    );

    test(
      qase(426, 'Should open CSM Sentinel after click'),
      async ({ widgetService, widgetConfig }) => {
        const csmSentinelUrl = normalizeBaseUrl(
          widgetConfig.standConfig.toolsConfig.urls.csmSentinel,
        );

        const [csmSentinelPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_dashboard_notification_sentinel_link',
          ),
          widgetService.dashboardPage.tools.sentinel.click(),
        ]);

        await expect(csmSentinelPage).toHaveURL(
          new RegExp(`^${escapeRegex(csmSentinelUrl)}/?$`, 'i'),
        );
      },
    );

    test(
      qase(427, 'Should open beaconcha.in Entity after click'),
      async ({ widgetService, widgetConfig }) => {
        test.skip(
          !isProdOrStaging(widgetConfig.standConfig.standType),
          'beaconcha.in Entity link is checked only for prod/staging',
        );

        const beaconchainEntityBaseUrl = new URL(
          widgetConfig.standConfig.toolsConfig.urls.beaconchainEntity ?? '',
        ).origin;
        const beaconchainEntityUrlPattern = new RegExp(
          `^${escapeRegex(beaconchainEntityBaseUrl)}/entity/Lido%20CSM/CSM%20Operator%20\\d+/?$`,
          'i',
        );

        const [beaconchainEntityPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_dashboard_external_beaconcha_entity_link',
          ),
          widgetService.dashboardPage.tools.entity.click(),
        ]);

        await expect(beaconchainEntityPage).toHaveURL(
          beaconchainEntityUrlPattern,
        );
      },
    );

    test(
      qase(428, 'Should open Rated explorer after click'),
      async ({ widgetService, widgetConfig }) => {
        const isExtendedMonitoringEnv = isProdOrStaging(
          widgetConfig.standConfig.standType,
        );
        test.skip(
          !isExtendedMonitoringEnv,
          'Rated link is checked only for prod/staging',
        );

        const ratedOrigin = new URL(
          widgetConfig.standConfig.toolsConfig.urls.rated ?? '',
        ).origin;
        const ratedUrlPattern = new RegExp(
          `^${escapeRegex(ratedOrigin)}/o/.+\\?network=[A-Za-z0-9-]+(?:&.*)?$`,
          'i',
        );

        const [ratedPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_dashboard_external_rated_link',
          ),
          widgetService.dashboardPage.tools.rated.click(),
        ]);

        await expect(ratedPage).toHaveURL(ratedUrlPattern);
      },
    );

    test(
      qase(429, 'Should open EthSeer after click'),
      async ({ widgetService, widgetConfig }) => {
        const isExtendedMonitoringEnv = isProdOrStaging(
          widgetConfig.standConfig.standType,
        );
        test.skip(
          !isExtendedMonitoringEnv,
          'MigaLabs link is checked only for prod/staging',
        );

        const migaLabsUrl = new URL(
          widgetConfig.standConfig.toolsConfig.urls.migaLabs ?? '',
        );
        const migaLabsHostPattern = migaLabsUrl.hostname.startsWith('www.')
          ? escapeRegex(migaLabsUrl.hostname)
          : `(?:www\\.)?${escapeRegex(migaLabsUrl.hostname)}`;
        const migaLabsUrlPattern = new RegExp(
          `^${escapeRegex(migaLabsUrl.protocol)}//${migaLabsHostPattern}${escapeRegex(normalizeBaseUrl(migaLabsUrl.pathname))}/csm_operator\\d+_lido\\?network=[A-Za-z0-9-]+(?:&.*)?$`,
          'i',
        );

        const [migaLabsPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_dashboard_external_migalabs_link',
          ),
          widgetService.dashboardPage.tools.ethseer.click(),
        ]);

        await expect(migaLabsPage).toHaveURL(migaLabsUrlPattern);
      },
    );
  },
);
