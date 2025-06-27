import { test } from '../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';

test.describe('Dashboard. Bond & Rewards.', async () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.dashboardPage.open();
  });

  test(
    qase(138, 'Navigation from Bond & Rewards Section'),
    async ({ widgetService }) => {
      await widgetService.dashboardPage.bondRewards.sectionHeaderLink.click();
      await widgetService.page.waitForURL('**/bond/claim');
    },
  );
});
