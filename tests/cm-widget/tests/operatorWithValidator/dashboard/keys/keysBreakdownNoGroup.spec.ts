import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/shared/consts/common.const';

import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.ONLY_OPERATOR.secretPhrase });

test.describe(
  'Dashboard. No Group. Keys Breakdown.',
  { tag: [Tags.forked] },
  () => {
    test.beforeEach(async ({ widgetService }) => {
      await widgetService.dashboardPage.open();
      await widgetService.dashboardPage.keysSection.expandKeysBreakdown();
    });

    test(
      qase(
        349,
        'Should display all key status rows with correct labels except Depositable',
      ),
      async ({ widgetService }) => {
        const { keysSection } = widgetService.dashboardPage;

        const rows = [
          {
            locator: keysSection.keysPendingActivationCount,
            label: 'Pending activation',
          },
          { locator: keysSection.keysActiveCount, label: 'Active' },
          { locator: keysSection.keysExitedCount, label: 'Exited' },
          { locator: keysSection.keysWithdrawnCount, label: 'Withdrawn' },
          { locator: keysSection.keysUnbondedCount, label: 'Unbonded' },
          {
            locator: keysSection.keysExitRequestedCount,
            label: 'Exit requested',
          },
          { locator: keysSection.keysDuplicatedCount, label: 'Duplicated' },
          { locator: keysSection.keysInvalidCount, label: 'Invalid' },
          { locator: keysSection.keysUncheckedCount, label: 'Unchecked' },
        ];

        await test.step('Check Depositable count is not visible', async () => {
          await expect(keysSection.keysDepositableCount).toBeHidden();
        });

        for (const { locator, label } of rows) {
          await test.step(`Check "${label}" row is visible`, async () => {
            await expect(
              locator,
              `"${label}" row should be visible`,
            ).toBeVisible();
            await expect(
              locator,
              `"${label}" row should contain label text`,
            ).toContainText(label);
          });
        }
      },
    );
  },
);
