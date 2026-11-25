import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';

import { PRESETS } from 'tests/cm-widget/config/walletSetup';

test.use({ secretPhrase: PRESETS.ONLY_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.dashboard,
    feature: 'Keys',
    story: 'Deposits paused without group',
  }),
  () => {
    test.beforeEach(async ({ widgetService }) => {
      await widgetService.dashboardPage.open();
    });

    test('Should show deposits paused notice and No group in header', async ({
      widgetService,
    }) => {
      const { depositsPausedNotice, operatorHeader } =
        widgetService.dashboardPage;

      await test.step('Check deposits paused notice', async () => {
        await expect(depositsPausedNotice).toBeVisible();
      });

      await test.step('Check header shows No group', async () => {
        await expect(operatorHeader.operatorNoGroup).toHaveText('No group');
      });
    });
  },
);
