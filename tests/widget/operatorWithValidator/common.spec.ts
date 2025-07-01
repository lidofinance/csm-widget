import { test } from '../test.fixture';
import { KeysPage } from 'tests/pages';
import { getRandomKeys } from '../../consts/keys.const';
import { Tags, TokenSymbol } from 'tests/consts/common.const';
import { expect } from '@playwright/test';
import { trimAddress } from '@lidofinance/address';
import { qase } from 'playwright-qase-reporter/playwright';

test.use({ secretPhrase: process.env.EMPTY_NODE_SECRET_PHRASE });

test.describe('Operator with keys. Common suite.', async () => {
  let keysPage: KeysPage;

  test.beforeEach(async ({ widgetService }) => {
    keysPage = new KeysPage(widgetService.page);
    await keysPage.submitPage.open();
  });

  test(
    qase(17, 'Should open transaction page after added 1 key'),
    { tag: Tags.smoke },
    async ({ widgetService }) => {
      const txPage = await keysPage.submitPage.submitKeys(
        getRandomKeys(),
        TokenSymbol.ETH,
      );
      await widgetService.walletPage.cancelTx(txPage);
    },
  );

  test(qase(18, 'Should failed if uploaded duplicate keys'), async () => {
    const duplicatedKey = getRandomKeys();
    await keysPage.submitPage.fillKeys([...duplicatedKey, ...duplicatedKey]);
    await expect(keysPage.submitPage.formBlock).toContainText(
      `pubkey ${trimAddress(duplicatedKey[0].pubkey, 6)} has duplicates`,
    );
  });

  test(
    qase(19, 'Should open transaction page after added 25 keys'),
    async ({ widgetService }) => {
      const txPage = await keysPage.submitPage.submitKeys(
        getRandomKeys(25),
        TokenSymbol.ETH,
      );
      await widgetService.walletPage.cancelTx(txPage);
    },
  );

  test(
    qase(20, 'Should failed if uploaded over the limit (26) keys'),
    async () => {
      const overTheLimitKeys = getRandomKeys(26);
      await keysPage.submitPage.fillKeys(overTheLimitKeys);
      await expect(keysPage.submitPage.formBlock).toContainText(
        'Should have no more than 25 keys',
      );
    },
  );
});
