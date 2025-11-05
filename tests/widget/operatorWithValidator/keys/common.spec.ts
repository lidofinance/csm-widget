import { test } from '../../test.fixture';
import { KeysPage } from 'tests/pages';
import { Tags, TokenSymbol } from 'tests/consts/common.const';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { KeysGeneratorService } from 'tests/services/keysGenerator.service';

test.use({ secretPhrase: process.env.EMPTY_NODE_SECRET_PHRASE });

test.describe('Operator with keys. Common suite.', async () => {
  let keysPage: KeysPage;
  let keysGeneratorService: KeysGeneratorService;

  test.beforeEach(async ({ widgetService }) => {
    keysPage = new KeysPage(widgetService.page);
    await keysPage.submitPage.open();
    keysGeneratorService = new KeysGeneratorService();
  });

  test(
    qase(17, 'Should open transaction page after added 1 key'),
    { tag: Tags.smoke },
    async ({ widgetService }) => {
      const txPage = await keysPage.submitPage.submitKeys(
        keysGeneratorService.generateKeys(),
        TokenSymbol.ETH,
      );
      await widgetService.walletPage.cancelTx(txPage);
    },
  );

  test(qase(18, 'Should failed if uploaded duplicate keys'), async () => {
    const duplicatedKey = keysGeneratorService.generateKeys();
    await keysPage.submitPage.fillKeys([...duplicatedKey, ...duplicatedKey]);
    await expect(keysPage.submitPage.formBlock).toContainText(
      `Invalid deposit data`,
    );
    await keysPage.submitPage.selectTab('Parsed');
    await expect(keysPage.submitPage.depositDataRow).toHaveCount(2);
    for (const row of await keysPage.submitPage.depositDataRow.all()) {
      await expect(row.getByTestId('deposit-data-error')).toHaveText(
        'pubkey is duplicated in deposit data',
      );
    }
  });

  test(
    qase(19, 'Should open transaction page after added 25 keys'),
    async ({ widgetService }) => {
      const txPage = await keysPage.submitPage.submitKeys(
        keysGeneratorService.generateKeys(25),
        TokenSymbol.ETH,
      );
      await widgetService.walletPage.cancelTx(txPage);
    },
  );

  test(
    qase(20, 'Should failed if uploaded over the limit (26) keys'),
    async () => {
      const overTheLimitKeys = keysGeneratorService.generateKeys(26);
      await keysPage.submitPage.fillKeys(overTheLimitKeys);
      await expect(keysPage.submitPage.formBlock).toContainText(
        'Too many keys in one transaction. Maximum allowed: 25',
      );
    },
  );
});
