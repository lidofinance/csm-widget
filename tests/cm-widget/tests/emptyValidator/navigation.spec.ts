import { expect } from '@playwright/test';
import { test } from '../test.fixture';
import { NavigationPage } from '../../pages/navigation.page';
import { qase } from 'playwright-qase-reporter/playwright';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

test.describe('Navigation. Empty validator.', () => {
  let nav: NavigationPage;

  test.beforeEach(async ({ widgetService }) => {
    await widgetService.page.goto('/');
    nav = new NavigationPage(widgetService.page);
  });

  test(
    qase(189, 'Should display only Create Operator nav item in sidebar'),
    async ({ widgetService }) => {
      const allNavItems = nav.nav.getByTestId('navItem');

      await test.step('Only one nav item is visible', async () => {
        await expect(allNavItems).toHaveCount(1);
      });

      await test.step('"Create Operator" nav item is visible', async () => {
        await expect(nav.navItem('Create Operator')).toBeVisible();
      });

      await test.step('Operator-only nav items are not present', async () => {
        for (const name of [
          'Dashboard',
          'Keys',
          'Monitoring',
          'Bond & Rewards',
          'Settings',
        ]) {
          await expect(
            nav.navItem(name),
            `"${name}" should not be visible`,
          ).not.toBeVisible();
        }
      });

      await test.step('Navigate to /create on click', async () => {
        await nav.navItem('Create Operator').click();
        await expect(widgetService.page).toHaveURL(/\/create/);
      });
    },
  );
});
