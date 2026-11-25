import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../test.fixture';
import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.group,
    story: 'Navigation',
  }),
  () => {
    let noId: number;

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.groupPage.open();
      noId = await widgetService.extractNodeOperatorId();
    });

    test(
      qase(
        216,
        'Should navigate to group page from dashboard via operator group link',
      ),
      async ({ widgetService }) => {
        const { dashboardPage, groupPage, page } = widgetService;
        const { operatorGroupLink } = dashboardPage.operatorHeader;

        await dashboardPage.open();
        await expect(operatorGroupLink).toBeVisible({
          timeout: PAGE_WAIT_TIMEOUT,
        });
        await operatorGroupLink.click();

        await expect(page).toHaveURL(/\/group/);
        await expect(groupPage.sectionTitle).toContainText('Operator Group #');
      },
    );

    test(
      qase(217, 'Should navigate to My Operators via the crumb'),
      async ({ widgetService }) => {
        await widgetService.groupPage.myOperatorsCrumb.click();
        await expect(widgetService.page).toHaveURL('/operators');
      },
    );

    test(
      qase(218, 'Should navigate to dashboard from "View dashboard" button'),
      async ({ widgetService }) => {
        const op0 = widgetService.groupPage.operator(noId);

        await expect(op0.goToDashboardBtn).toBeVisible({
          timeout: PAGE_WAIT_TIMEOUT,
        });
        await op0.goToDashboardBtn.click();
        await expect(widgetService.page).toHaveURL('/');
      },
    );
  },
);
