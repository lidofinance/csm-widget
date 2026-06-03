import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';

test.describe('Dashboard. No Group. Keys Breakdown.', () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.dashboardPage.open();
    await widgetService.dashboardPage.keysSection.expandKeysBreakdown();
  });

  test('Should display all key status rows with correct labels except Depositable', async ({
    widgetService,
  }) => {
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
        await expect(locator, `"${label}" row should be visible`).toBeVisible();
        await expect(
          locator,
          `"${label}" row should contain label text`,
        ).toContainText(label);
      });
    }
  });
});
