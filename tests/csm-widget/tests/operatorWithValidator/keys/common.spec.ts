import { test } from '../../test.fixture';
import { KeysPage } from 'tests/csm-widget/pages';
import { Tags, TokenSymbol } from 'tests/shared/consts/common.const';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { KeysGeneratorService } from 'tests/shared/services/keysGenerator.service';

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
      await keysPage.submitPage.submitKeys(
        keysGeneratorService.generateKeys(),
        TokenSymbol.ETH,
      );
      await widgetService.walletPage.cancelTx();
    },
  );

  test(
    qase(19, 'Should open transaction page after added 75 keys'),
    async ({ widgetService }) => {
      await keysPage.submitPage.submitKeys(
        keysGeneratorService.generateKeys(75),
        TokenSymbol.ETH,
      );
      await widgetService.walletPage.cancelTx();
    },
  );

  test(
    qase(20, 'Should failed if uploaded over the limit (76) keys'),
    async () => {
      const overTheLimitKeys = keysGeneratorService.generateKeys(76);
      await keysPage.submitPage.fillKeys(overTheLimitKeys);
      await expect(keysPage.submitPage.validationInputError).toContainText(
        'Too many keys in one transaction, maximum allowed: 75',
        { timeout: 35000 },
      );
    },
  );
});
