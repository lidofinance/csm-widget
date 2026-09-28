import { expect } from '@playwright/test';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { Tags } from 'tests/shared/consts/common.const';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../test.fixture';

test.describe(
  ...suite({
    epic: EPIC.common,
    story: 'Header buttons',
    tag: [Tags.matomo],
  }),
  () => {
    let matomoEventService: MatomoService;

    test.beforeEach(async ({ widgetService, widgetConfig }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.dashboardPage.open();
    });

    test('Should open operator parameters', async ({ widgetService }) => {
      const { header, parametersModal } = widgetService;

      await test.step('Open parameters modal and send tracking event', async () => {
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_click_operator_type_button',
          ),
          header.operatorTypeCurve.click(),
        ]);
      });

      await test.step('Verify parameters modal', async () => {
        await expect(parametersModal.modal).toBeVisible();
      });
    });

    test('Should open operator switch', async ({ widgetService }) => {
      const { header } = widgetService;

      await test.step('Open switch modal and send tracking event', async () => {
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_click_switch_operator_button',
          ),
          header.switchOperatorButton.click(),
        ]);
      });

      await test.step('Verify switch modal', async () => {
        await expect(header.operatorSwitchModal).toBeVisible();
      });
    });

    test('Should open wallet account', async ({ widgetService }) => {
      const { header, walletModal } = widgetService;

      await test.step('Open account modal and send tracking event', async () => {
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_click_wallet_button',
          ),
          header.accountSection.click(),
        ]);
      });

      await test.step('Verify account modal', async () => {
        await expect(walletModal.modal).toBeVisible();
        await expect(walletModal.providerName).toBeVisible();
        await expect(walletModal.connectedAddress).toBeVisible();
      });
    });
  },
);
