import { expect } from '@playwright/test';
import { BasePage } from 'tests/pages';
import { test } from '../../test.fixture';
import { MatomoService } from 'tests/services/matomo.service';
import { PAGE_WAIT_TIMEOUT } from 'tests/consts/timeouts';

test.describe('Monitoring. External links.', async () => {
  let matomoEventService: MatomoService;
  let basePage: BasePage;

  test.beforeEach(async ({ widgetService, widgetConfig }) => {
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

    expect(beaconchainPage.url().toLowerCase()).toContain('beaconcha.in');
  });

  test('Should open Lido Fees monitoring after click', async ({
    widgetService,
  }) => {
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

    expect(feesMonitoringPage.url().toLowerCase()).toContain('fees-monitoring');
  });

  test('Should open Lido Operators Portal after click', async ({
    widgetService,
  }) => {
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

    expect(operatorsPortalPage.url().toLowerCase()).toContain('operators');
  });

  test('Should open CSM Sentinel after click', async ({ widgetService }) => {
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
      'https://github.com/skhomuti/csm-sentinel',
    );
  });
});
