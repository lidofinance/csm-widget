import { expect } from '@playwright/test';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../test.fixture';
import { REPORT_GENERAL_DELAYED_PENALTY_ROLE } from './delayedPenalty.const';

const NAV_ITEM = 'Delayed penalty';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.delayedPenalty,
    feature: null,
    story: 'Access',
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ csmSDK }) => {
      snapshotId = await csmSDK.evmSnapshot();
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    test('Should hide page without reporter role', async ({
      widgetService,
    }) => {
      const { navBlockElement, delayedPenaltyPage } = widgetService;

      await test.step('Open the dashboard', async () => {
        await widgetService.dashboardPage.open();
      });

      await test.step('Nav item is hidden', async () => {
        await expect(navBlockElement.navItem(NAV_ITEM)).toBeHidden();
      });

      await test.step('Direct link redirects away from the page', async () => {
        await widgetService.page.goto('/delayed-penalty/report');
        await expect(widgetService.page).not.toHaveURL(/delayed-penalty/, {
          timeout: PAGE_WAIT_TIMEOUT,
        });
        await expect(delayedPenaltyPage.report.form).toBeHidden();
      });
    });

    test('Should open Report and Cancel tabs with reporter role', async ({
      widgetService,
      forkActionService,
    }) => {
      const { navBlockElement, delayedPenaltyPage } = widgetService;

      await test.step('Grant reporter role to the wallet', async () => {
        await forkActionService.grantRole(
          REPORT_GENERAL_DELAYED_PENALTY_ROLE,
          PRESETS.FULL_OPERATOR.address,
        );
      });

      await test.step('Nav item leads to the Report tab', async () => {
        // the role is cached for the session, a fresh load picks it up
        await widgetService.dashboardPage.open();
        await navBlockElement.navItem(NAV_ITEM).click();
        await expect(widgetService.page).toHaveURL(
          /\/delayed-penalty\/report/,
          { timeout: PAGE_WAIT_TIMEOUT },
        );
        await expect(delayedPenaltyPage.report.form).toBeVisible();
      });

      await test.step('Switcher shows Report and Cancel tabs', async () => {
        await expect(navBlockElement.switcherTab('Report')).toBeVisible();
        await expect(navBlockElement.switcherTab('Cancel')).toBeVisible();
      });

      await test.step('Cancel tab opens the cancel form and locked table', async () => {
        await navBlockElement.switcherTab('Cancel').click();
        await expect(widgetService.page).toHaveURL(/\/delayed-penalty\/cancel/);
        await expect(delayedPenaltyPage.cancel.form).toBeVisible();
        await expect(delayedPenaltyPage.cancel.lockedSection).toBeVisible();
      });
    });
  },
);
