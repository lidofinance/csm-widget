import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { test } from '../../../test.fixture';

test.describe('Dashboard. Stake & Keys.', () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.dashboardPage.open();
  });

  test(
    qase(150, 'Should display section header with navigation link'),
    async ({ widgetService }) => {
      const { keysSection } = widgetService.dashboardPage;

      await test.step('Check section title is visible', async () => {
        await expect(
          keysSection.section,
          'Stake & Keys section should be visible',
        ).toBeVisible();
        await expect(
          keysSection.section,
          'Section should contain "Stake & Keys" title',
        ).toContainText('Stake & Keys');
      });

      await test.step('Check navigation link is present', async () => {
        await expect(
          keysSection.sectionHeaderLink,
          'Section header link should be visible',
        ).toBeVisible();
      });
    },
  );

  test(
    qase(151, 'Should display all three stake columns with correct labels'),
    async ({ widgetService }) => {
      const { keysSection } = widgetService.dashboardPage;

      await test.step('Check "Active" column is visible with label', async () => {
        await expect(
          keysSection.stakeColumnActive,
          '"Active" column should be visible',
        ).toBeVisible();
        await expect(
          keysSection.stakeColumnActive,
          '"Active" column should contain label',
        ).toContainText('Active');
      });

      await test.step('Check "Depositable" column is visible with label', async () => {
        await expect(
          keysSection.stakeColumnDepositable,
          '"Depositable" column should be visible',
        ).toBeVisible();
        await expect(
          keysSection.stakeColumnDepositable,
          '"Depositable" column should contain label',
        ).toContainText('Depositable');
      });

      await test.step('Check "Potential additional capacity" column is visible with label', async () => {
        await expect(
          keysSection.stakeColumnPotential,
          '"Potential additional capacity" column should be visible',
        ).toBeVisible();
        await expect(
          keysSection.stakeColumnPotential,
          '"Potential additional capacity" column should contain label',
        ).toContainText('Potential additional capacity');
      });
    },
  );

  test(
    qase(152, 'Should display correct tooltips for stake columns'),
    async ({ widgetService }) => {
      const { keysSection } = widgetService.dashboardPage;

      const columns = [
        {
          tooltipIcon: keysSection.stakeColumnActiveTooltip,
          label: 'Active',
          tooltip:
            'Stake amount that already has ETH deposited by the Lido protocol and are currently active in the validator set',
        },
        {
          tooltipIcon: keysSection.stakeColumnDepositableTooltip,
          label: 'Depositable',
          tooltip:
            'Available capacity ready to receive stake from the Lido protocol',
        },
        {
          tooltipIcon: keysSection.stakeColumnPotentialTooltip,
          label: 'Potential additional capacity',
          tooltip:
            'The additional stake the Lido protocol could allocate based on current weight, assuming enough validator keys are available',
        },
      ];

      for (const { tooltipIcon, label, tooltip } of columns) {
        await test.step(`Check tooltip for "${label}" column`, async () => {
          const tooltipText =
            await widgetService.dashboardPage.hoverElement(tooltipIcon);
          expect(tooltipText).toContain(tooltip);
          await widgetService.dashboardPage.closeTooltip();
        });
      }
    },
  );

  test(
    qase(153, 'Should display correct depositable keys count from chain'),
    async ({ widgetService, cmSDK }) => {
      const { keysSection } = widgetService.dashboardPage;

      const nodeOperatorId = await widgetService.extractNodeOperatorId();
      const { depositableKeys } =
        await cmSDK.getNodeOperatorInfo(nodeOperatorId);
      const expectedText =
        depositableKeys === 1 ? '1 key' : `${depositableKeys} keys`;

      await expect(
        keysSection.stakeColumnDepositableKeys,
        `Depositable keys count should show "${expectedText}"`,
      ).toHaveText(expectedText);
    },
  );

  test(
    qase(154, 'Should navigate to keys page on header link click'),
    async ({ widgetService }) => {
      const { keysSection } = widgetService.dashboardPage;

      await test.step('Click section header link', async () => {
        await keysSection.sectionHeaderLink.click();
      });

      await test.step('Check navigation to keys page', async () => {
        await expect(
          widgetService.page,
          'Should navigate to keys page',
        ).toHaveURL(/\/keys/);
      });
    },
  );
});
