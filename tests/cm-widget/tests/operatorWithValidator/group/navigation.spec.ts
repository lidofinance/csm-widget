import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/shared/consts/common.const';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../test.fixture';

test.describe('Group page. Navigation.', { tag: [Tags.forked] }, () => {
  let snapshotId: string;
  let noId: number;

  test.beforeAll(({ useFork }) => {
    test.skip(!useFork, 'Test suite runs only on forked network');
  });

  test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
    snapshotId = await cmSDK.evmSnapshot();

    noId = await widgetService.extractNodeOperatorId();

    await forkActionService.createOperatorGroup([
      { id: noId, weight: 50 },
      { id: noId - 1, weight: 50 },
    ]);
    await widgetService.groupPage.open();
  });

  test.afterAll(async ({ cmSDK }) => {
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
      const op0 = widgetService.groupPage.operator(noId);

      await expect(op0.uploadKeysLink).toBeVisible({
        timeout: STAGE_WAIT_TIMEOUT,
      });
      await op0.uploadKeysLink.click();
      await expect(widgetService.page).toHaveURL(/\/keys\/submit/);
    },
  );
});
