import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/shared/consts/common.const';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../test.fixture';

const OPERATOR_0_ID = 0;
const OPERATOR_1_ID = 1;

test.describe('Group page. Navigation.', { tag: [Tags.forked] }, () => {
  let snapshotId: string;

  test.beforeAll(({ useFork }) => {
    test.skip(!useFork, 'Test suite runs only on forked network');
  });

  test.beforeEach(async ({ cmSDK, forkActionService, widgetService }) => {
    snapshotId = await cmSDK.evmSnapshot();
    await forkActionService.createOperatorGroup([
      { id: OPERATOR_0_ID, weight: 50 },
      { id: OPERATOR_1_ID, weight: 50 },
    ]);
    await widgetService.groupPage.open();
  });

  test.afterEach(async ({ cmSDK }) => {
    await cmSDK.evmRevert(snapshotId);
  });

  test(
    qase(
      216,
      'Should navigate to group page from dashboard via operator group link',
    ),
    async ({ widgetService }) => {
      const { dashboardPage, groupPage, page } = widgetService;

      await dashboardPage.open();
      await expect(dashboardPage.operatorGroupLink).toBeVisible({
        timeout: STAGE_WAIT_TIMEOUT,
      });
      await dashboardPage.operatorGroupLink.click();

      await expect(page).toHaveURL(/\/group/);
      await expect(groupPage.pageTitle).toContainText('Operator Group #');
    },
  );

  test(
    qase(217, 'Should navigate back to dashboard on "Back" button click'),
    async ({ widgetService }) => {
      await widgetService.groupPage.backButton.click();
      await expect(widgetService.page).toHaveURL('/');
    },
  );

  test(
    qase(218, 'Should navigate to keys submit page from "Upload keys" link'),
    async ({ widgetService }) => {
      const op0 = widgetService.groupPage.operator(OPERATOR_0_ID);

      await expect(op0.uploadKeysLink).toBeVisible({
        timeout: STAGE_WAIT_TIMEOUT,
      });
      await op0.uploadKeysLink.click();
      await expect(widgetService.page).toHaveURL(/\/keys\/submit/);
    },
  );
});
