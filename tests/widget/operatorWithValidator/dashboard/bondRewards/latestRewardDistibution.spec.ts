/* eslint-disable no-irregular-whitespace */
import { test } from '../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';

test.describe.skip(
  'Dashboard. Bond & Rewards. Latest reward distribution section.',
  async () => {
    test.beforeEach(async ({ widgetService }) => {
      await widgetService.connectWallet();
      await widgetService.dashboardPage.open();
    });

    test.skip(
      qase(136, 'Should correctly expand and display the balance'),
      async () => {},
    );
    test.skip(
      qase(143, 'Tooltip verification for "Keys over threshold" field'),
      async () => {},
    );
    test.skip(
      qase(144, 'Tooltip verification for "Stuck keys found" field'),
      async () => {},
    );
    test.skip(
      qase(137, 'Upcoming Rewards Distribution Verification'),
      async () => {},
    );
  },
);
