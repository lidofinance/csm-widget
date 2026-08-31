import { expect } from '@playwright/test';
import { Tags } from 'tests/shared/consts/common.const';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../test.fixture';

test.describe('Header. Buttons.', { tag: [Tags.matomo] }, async () => {
  let matomoEventService: MatomoService;

  test.beforeEach(async ({ widgetService, widgetConfig }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.dashboardPage.open();
  });

  test('Should open parameters modal after click to operator type button', async ({
    widgetService,
  }) => {
    const { header, parametersModal } = widgetService;

    await test.step('Operator type button is visible', async () => {
      await expect(header.operatorTypeCurve).toBeVisible();
    });

    await test.step('Click to button and waiting for parameters modal', async () => {
      await Promise.all([
        matomoEventService.waitForEvent(
          'e_n',
          'csm_widget_click_operator_type_button',
        ),
        header.operatorTypeCurve.click(),
      ]);

      await expect(parametersModal.modal).toBeVisible();
    });
  });

  test('Should open switch modal after click to switch operator button', async ({
    widgetService,
  }) => {
    const { header } = widgetService;

    await test.step('Switch operator button is visible', async () => {
      await expect(header.switchOperatorButton).toBeVisible();
    });

    await test.step('Click to button and waiting for switch modal', async () => {
      await Promise.all([
        matomoEventService.waitForEvent(
          'e_n',
          'csm_widget_click_switch_operator_button',
        ),
        header.switchOperatorButton.click(),
      ]);

      await expect(header.operatorSwitchModal).toBeVisible();
    });
  });

  test('Should open account modal after click to wallet button', async ({
    widgetService,
  }) => {
    const { header, walletModal } = widgetService;

    await test.step('Wallet button is visible', async () => {
      await expect(header.accountSection).toBeVisible();
    });

    await test.step('Click to button and waiting for account modal', async () => {
      await Promise.all([
        matomoEventService.waitForEvent(
          'e_n',
          'csm_widget_click_wallet_button',
        ),
        header.accountSection.click(),
      ]);

      await expect(walletModal.modal).toBeVisible();
      await expect(walletModal.connectedAddress).toBeVisible();
    });
  });
});
