import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { test } from '../test.fixture';
import { KeysPage } from 'tests/pages';

test.describe('View keys list. Common', async () => {
  let keysPage: KeysPage;

  test.beforeEach(async ({ widgetService }) => {
    keysPage = new KeysPage(widgetService.page);
    await widgetService.connectWallet();
    await keysPage.keysView.open();
    await keysPage.keysView.table.waitFor({ state: 'visible' });
  });

  test(qase(148, 'Verification of displayed key statuses'), async () => {
    const keysList = await keysPage.keysView.getAllTableRaws();

    await test.step('Check each column for all keys', async () => {
      for (const key of keysList) {
        await expect(
          key.pubkeyCell,
          'Expected that value of pubkley cell wont be empty.',
        ).not.toBeEmpty();
        await expect(
          key.statusCell,
          'Expected that value of status cell wont be empty.',
        ).not.toBeEmpty();
        await expect(
          key.statusCommentCell,
          'Expected that value of comment wont be empty.',
        ).not.toBeEmpty();
      }
    });
  });
});
