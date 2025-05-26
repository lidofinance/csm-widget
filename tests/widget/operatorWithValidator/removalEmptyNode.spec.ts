import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { test } from '../test.fixture';
import { KeysPage } from 'tests/pages/keys.page';

test.use({ secretPhrase: process.env.EMPTY_NODE_SECRET_PHRASE });

test.describe('Removal page. Empty wallet.', async () => {
  let keysPage: KeysPage;

  test.beforeEach(async ({ widgetService }) => {
    keysPage = new KeysPage(widgetService.page);
    await widgetService.connectWallet();
    await keysPage.removePage.open();
    await keysPage.page.waitForTimeout(1000);
  });

  test(qase(151, 'Should present empty view for empty wallet'), async () => {
    await expect(keysPage.removePage.removeKeysForm).toContainText(
      'No keys available to remove',
    );
    await expect(keysPage.removePage.removeKeysForm).toContainText(
      'note: Only keys that have not been deposited yet can be deleted. If a key has already been deposited, the only way to retrieve the bond is to exit the validator on the Consensus Layer (CL).',
    );
    await expect(keysPage.removePage.removeKeysButton).toBeHidden();
  });
});
