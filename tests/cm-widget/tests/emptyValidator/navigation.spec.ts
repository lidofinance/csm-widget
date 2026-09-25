import { expect } from '@playwright/test';
import { test } from '../test.fixture';
import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { NavBlockElement } from 'tests/shared/pages/elements';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/shared/consts/common.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup';

test.use({ secretPhrase: PRESETS.EMPTY_OPERATOR_WITH_ALL_GATES.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.navigation,
    story: 'Empty validator',
    tag: [Tags.forked],
  }),
  () => {
    let nav: NavBlockElement;

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.welcomePage.goto();
      nav = widgetService.navBlockElement;
    });

    test(
      qase(189, 'Should display only Create Operator nav item in sidebar'),
      async ({ widgetService }) => {
        const allNavItems = nav.navBlockMain.getByTestId('navItem');

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
  },
);
