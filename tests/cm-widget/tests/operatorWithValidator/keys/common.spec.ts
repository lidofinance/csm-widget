import { test } from '../../test.fixture';
import { KeysPage } from '../../../pages';
import { Tags, TokenSymbol } from '../../../../shared/consts/common.const';
import { expect } from '@playwright/test';
import { KeysGeneratorService } from '../../../../shared/services/keysGenerator.service';
import { qase } from 'playwright-qase-reporter/playwright';

test.describe('Operator with keys. Common suite.', () => {
  let keysPage: KeysPage;
  let keysGeneratorService: KeysGeneratorService;

  test.beforeEach(async ({ widgetService }) => {
    keysPage = new KeysPage(widgetService.page);
    await keysPage.submitPage.open();
    keysGeneratorService = new KeysGeneratorService({ isCM: true });
  });

  test(
    qase(84, 'Should open transaction page after added 1 key'),
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
    qase(85, 'Should open transaction page after added 25 keys'),
    async ({ widgetService }) => {
      await keysPage.submitPage.submitKeys(
        keysGeneratorService.generateKeys(25),
        TokenSymbol.ETH,
      );
      await widgetService.walletPage.cancelTx();
    },
  );

  test(
    qase(86, 'Should failed if uploaded over the limit (26) keys'),
    async () => {
      const overTheLimitKeys = keysGeneratorService.generateKeys(26);
      await keysPage.submitPage.fillKeys(overTheLimitKeys);
      await expect(keysPage.submitPage.validationInputError).toContainText(
        'Too many keys in one transaction. Maximum allowed: 25',
      );
    },
  );
});
