import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { test } from '../test.fixture';
import { NavigationPage } from '../../pages/navigation.page';

const SIDEBAR_ITEMS = [
  { name: 'Dashboard', url: '/' },
  { name: 'Create Operator', url: '/create' },
  { name: 'Keys', url: '/keys' },
  { name: 'Monitoring', url: '/monitoring' },
  { name: 'Bond & Rewards', url: '/bond' },
  { name: 'Settings', url: '/settings' },
];

const KEYS_TABS = [
  { title: 'Submit', url: '/keys/submit' },
  { title: 'Delete', url: '/keys/exit' },
  { title: 'View keys', url: '/keys/view' },
];

const BOND_TABS = [
  { title: 'Claim', url: '/bond/claim' },
  { title: 'Add Bond', url: '/bond/add' },
  { title: 'Rewards history', url: '/bond/rewards-history' },
];

const SETTINGS_TABS = [
  { title: 'Roles', url: '/settings/roles' },
  { title: 'Meta data', url: '/settings/metadata' },
  { title: 'Inbox requests', url: '/settings/inbox' },
];

test.describe('Navigation. Operator with validator.', () => {
  let navigation: NavigationPage;

  test.beforeEach(async ({ widgetService }) => {
    await widgetService.dashboardPage.open();
    navigation = new NavigationPage(widgetService.page);
  });

  test(
    qase(173, 'Should display all sidebar nav items and navigate correctly'),
    async ({ widgetService }) => {
      await test.step('All nav items are visible', async () => {
        for (const { name } of SIDEBAR_ITEMS) {
          await expect(
            navigation.navItem(name),
            `"${name}" should be visible`,
          ).toBeVisible();
        }
      });

      for (const { name, url } of SIDEBAR_ITEMS) {
        await test.step(`Navigate to "${name}"`, async () => {
          await navigation.navItem(name).click();
          await expect(widgetService.page).toHaveURL(new RegExp(url));
        });
      }
    },
  );

  test(
    qase(174, 'Should display Keys tabs and navigate correctly'),
    async ({ widgetService }) => {
      await navigation.navItem('Keys').click();
      await widgetService.page.waitForURL(/\/keys/);

      await test.step('All Keys tabs are visible', async () => {
        for (const { title } of KEYS_TABS) {
          await expect(
            navigation.switcherTab(title),
            `"${title}" tab should be visible`,
          ).toBeVisible();
        }
      });

      for (const { title, url } of KEYS_TABS) {
        await test.step(`Navigate to "${title}" tab`, async () => {
          await navigation.switcherTab(title).click();
          await expect(widgetService.page).toHaveURL(new RegExp(url));
        });
      }
    },
  );

  test(
    qase(175, 'Should display Bond & Rewards tabs and navigate correctly'),
    async ({ widgetService }) => {
      await navigation.navItem('Bond & Rewards').click();
      await widgetService.page.waitForURL(/\/bond/);

      await test.step('All Bond & Rewards tabs are visible', async () => {
        for (const { title } of BOND_TABS) {
          await expect(
            navigation.switcherTab(title),
            `"${title}" tab should be visible`,
          ).toBeVisible();
        }
      });

      for (const { title, url } of BOND_TABS) {
        await test.step(`Navigate to "${title}" tab`, async () => {
          await navigation.switcherTab(title).click();
          await expect(widgetService.page).toHaveURL(new RegExp(url));
        });
      }
    },
  );

  test(
    qase(176, 'Should display Settings tabs and navigate correctly'),
    async ({ widgetService }) => {
      await navigation.navItem('Settings').click();
      await widgetService.page.waitForURL(/\/settings/);

      await test.step('All Settings tabs are visible', async () => {
        for (const { title } of SETTINGS_TABS) {
          await expect(
            navigation.switcherTab(title),
            `"${title}" tab should be visible`,
          ).toBeVisible();
        }
      });

      for (const { title, url } of SETTINGS_TABS) {
        await test.step(`Navigate to "${title}" tab`, async () => {
          await navigation.switcherTab(title).click();
          await expect(widgetService.page).toHaveURL(new RegExp(url));
        });
      }
    },
  );

  test(
    qase(
      178,
      'Should display edit metadata button on dashboard and navigate to metadata page',
    ),
    async ({ widgetService }) => {
      const { editMetadataLink } = widgetService.dashboardPage;

      await test.step('Edit metadata button is visible', async () => {
        await expect(editMetadataLink).toBeVisible();
      });

      await test.step('Navigate to metadata page on click', async () => {
        await editMetadataLink.click();
        await expect(widgetService.page).toHaveURL(/\/settings\/metadata/);
      });
    },
  );

  test(
    qase(
      177,
      'Should display Operator Group link in dashboard subtitle and navigate to group page',
    ),
    async ({ widgetService }) => {
      const { operatorGroupLink } = widgetService.dashboardPage;

      await test.step('Operator Group link is visible', async () => {
        await expect(operatorGroupLink).toBeVisible();
      });

      await test.step('Operator Group link has correct text', async () => {
        await expect(operatorGroupLink).toContainText(/Operator Group #\d+/);
      });

      await test.step('Navigate to group page on click', async () => {
        await operatorGroupLink.click();
        await expect(widgetService.page).toHaveURL(/\/group/);
      });
    },
  );
});
