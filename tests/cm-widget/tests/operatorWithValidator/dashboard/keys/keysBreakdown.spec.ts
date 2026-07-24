import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { test } from '../../../test.fixture';
import { Tags } from 'tests/shared/consts/common.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe('Dashboard. Keys Breakdown.', { tag: [Tags.forked] }, () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.dashboardPage.open();
    await widgetService.dashboardPage.keysSection.expandKeysBreakdown();
  });

  test(
    qase(146, 'Should expand and collapse Keys Breakdown accordion'),
    async ({ widgetService }) => {
      const { keysSection } = widgetService.dashboardPage;

      await test.step('Panel is visible after expand', async () => {
        await expect(
          keysSection.keysDepositableCount,
          'Keys Breakdown content should be visible',
        ).toBeVisible();
        await expect(keysSection.keysBreakdownToggle).toHaveAttribute(
          'aria-expanded',
          'true',
        );
      });

      await test.step('Panel hides after collapse', async () => {
        await keysSection.keysBreakdownToggle.click();
        await expect(
          keysSection.keysDepositableCount,
          'Keys Breakdown content should be hidden after collapse',
        ).toBeHidden();
        await expect(keysSection.keysBreakdownToggle).toHaveAttribute(
          'aria-expanded',
          'false',
        );
      });
    },
  );

  test(
    qase(147, 'Should display Keys Breakdown header with status chip'),
    async ({ widgetService }) => {
      const { keysSection } = widgetService.dashboardPage;

      await test.step('Check "Keys Breakdown" heading is visible', async () => {
        await expect(
          keysSection.section,
          '"Keys Breakdown" heading should be visible',
        ).toContainText('Keys Breakdown');
      });

      await test.step('Check status chip is visible', async () => {
        // Shows either "No issues" or "N issues" depending on operator state
        const statusChip = keysSection.section.getByText(
          /no issues|\d+ issues?/i,
        );
        await expect(
          statusChip,
          'Issues status chip should be visible',
        ).toBeVisible();
      });
    },
  );

  test(
    qase(148, 'Should display all key status rows with correct labels'),
    async ({ widgetService }) => {
      const { keysSection } = widgetService.dashboardPage;

      const rows = [
        { locator: keysSection.keysDepositableCount, label: 'Depositable' },
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

  test(
    qase(149, 'Should display correct tooltips for all key status rows'),
    async ({ widgetService }) => {
      const { keysSection } = widgetService.dashboardPage;

      const rows = [
        {
          locator: keysSection.keysDepositableCount,
          label: 'Depositable',
          tooltip: 'Keys awaiting deposit from the Lido protocol',
        },
        {
          locator: keysSection.keysPendingActivationCount,
          label: 'Pending activation',
          tooltip:
            'Keys that have received deposits from the Lido protocol and are waiting to become active',
        },
        {
          locator: keysSection.keysActiveCount,
          label: 'Active',
          tooltip: 'Keys that are active on the Beacon Chain',
        },
        {
          locator: keysSection.keysExitedCount,
          label: 'Exited',
          tooltip: 'Keys that have exited but have not yet been withdrawn',
        },
        {
          locator: keysSection.keysWithdrawnCount,
          label: 'Withdrawn',
          tooltip: 'Keys that have been exited and fully withdrawn',
        },
        {
          locator: keysSection.keysUnbondedCount,
          label: 'Unbonded',
          tooltip:
            'Keys that are not sufficiently covered by the current bond amount',
        },
        {
          locator: keysSection.keysExitRequestedCount,
          label: 'Exit requested',
          tooltip: 'Keys for which an exit has been requested',
        },
        {
          locator: keysSection.keysDuplicatedCount,
          label: 'Duplicated',
          tooltip: 'Keys that have been uploaded more than once',
        },
        {
          locator: keysSection.keysInvalidCount,
          label: 'Invalid',
          tooltip: 'Keys with invalid signature',
        },
        {
          locator: keysSection.keysUncheckedCount,
          label: 'Unchecked',
          tooltip:
            'Keys that have not yet been checked due to being invalid or duplicated',
        },
      ];

      for (const { locator, label, tooltip } of rows) {
        await test.step(`Check tooltip for "${label}" row`, async () => {
          const tooltipText = await widgetService.dashboardPage.hoverElement(
            locator.locator('span').first(),
          );
          expect.soft(tooltipText).toContain(tooltip);
          await widgetService.dashboardPage.closeTooltip();
        });
      }
    },
  );
});
