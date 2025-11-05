import { MainPage, KeysPage } from 'tests/pages';
import { test } from '../test.fixture';
import { Tags, TokenSymbol } from 'tests/consts/common.const';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { KeysGeneratorService } from 'tests/services/keysGenerator.service';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

test.describe('Operator without keys. Common suite.', async () => {
  let mainPage: MainPage;
  let createKeysPage: KeysPage;
  let keysGeneratorService: KeysGeneratorService;

  test.beforeEach(async ({ widgetService }) => {
    mainPage = new MainPage(widgetService.page);
    createKeysPage = new KeysPage(widgetService.page);
    await mainPage.goto();
    keysGeneratorService = new KeysGeneratorService();
  });

  test(
    qase(47, 'Should open transaction page after added 1 key'),
    { tag: Tags.smoke },
    async ({ widgetService }) => {
      await mainPage.starterPackSection.createNodeOperatorBtn.click();
      await createKeysPage.createNodeOperatorForm.formBlock.waitFor({
        state: 'visible',
      });
      const txPage = await createKeysPage.createNodeOperatorForm.addNewKeys(
        keysGeneratorService.generateKeys(),
        TokenSymbol.ETH,
      );
      await widgetService.walletPage.cancelTx(txPage);
    },
  );

  test(qase(177, 'Should failed if uploaded duplicate keys'), async () => {
    await mainPage.starterPackSection.createNodeOperatorBtn.click();
    await createKeysPage.createNodeOperatorForm.formBlock.waitFor({
      state: 'visible',
    });
    const duplicatedKey = keysGeneratorService.generateKeys();
    await createKeysPage.createNodeOperatorForm.fillKeys([
      ...duplicatedKey,
      ...duplicatedKey,
    ]);
    await expect(createKeysPage.createNodeOperatorForm.formBlock).toContainText(
      `Invalid deposit data`,
    );
    await createKeysPage.createNodeOperatorForm.selectTab('Parsed');
    await expect(
      createKeysPage.createNodeOperatorForm.depositDataRow,
    ).toHaveCount(2);
    for (const row of await createKeysPage.createNodeOperatorForm.depositDataRow.all()) {
      await expect(row.getByTestId('deposit-data-error')).toHaveText(
        'pubkey is duplicated in deposit data',
      );
    }
  });

  test(
    qase(48, 'Should open transaction page after added 25 keys'),
    async ({ widgetService }) => {
      await mainPage.starterPackSection.createNodeOperatorBtn.click();
      await createKeysPage.createNodeOperatorForm.formBlock.waitFor({
        state: 'visible',
      });
      const txPage = await createKeysPage.createNodeOperatorForm.addNewKeys(
        keysGeneratorService.generateKeys(25),
        TokenSymbol.ETH,
      );
      await widgetService.walletPage.cancelTx(txPage);
    },
  );

  test(
    qase(49, 'Should failed if uploaded over the limit (26) keys'),
    async () => {
      await mainPage.starterPackSection.createNodeOperatorBtn.click();
      await createKeysPage.createNodeOperatorForm.formBlock.waitFor({
        state: 'visible',
      });
      const overTheLimitKeys = keysGeneratorService.generateKeys(26);
      await createKeysPage.createNodeOperatorForm.fillKeys(overTheLimitKeys);
      await expect(
        createKeysPage.createNodeOperatorForm.formBlock,
      ).toContainText('Too many keys in one transaction. Maximum allowed: 25');
    },
  );
});
