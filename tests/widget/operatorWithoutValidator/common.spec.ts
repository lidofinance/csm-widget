import { MainPage, KeysPage } from 'tests/pages';
import { test } from '../test.fixture';
import { getRandomKeys } from '../../consts/keys.const';
import { expect } from '@playwright/test';
import { trimAddress } from '@lidofinance/address';
import { qase } from 'playwright-qase-reporter/playwright';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

test.describe('Operator without keys. Common suite.', async () => {
  let mainPage: MainPage;
  let createKeysPage: KeysPage;

  test.beforeEach(async ({ widgetService }) => {
    mainPage = new MainPage(widgetService.page);
    createKeysPage = new KeysPage(widgetService.page);
    await mainPage.goto();
  });

  test(
    qase(47, 'Should open transaction page after added 1 key'),
    // { tag: Tags.smoke }, // @TODO: enable smoke tag after keys generation will be fixed (QA-4217)
    async ({ widgetService }) => {
      await mainPage.starterPackSection.createNodeOperatorBtn.click();
      await createKeysPage.createNodeOperatorForm.formBlock.waitFor({
        state: 'visible',
      });
      const txPage = await createKeysPage.createNodeOperatorForm.addNewKeys(
        getRandomKeys(),
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
    const duplicatedKey = getRandomKeys();
    await createKeysPage.createNodeOperatorForm.fillKeys([
      ...duplicatedKey,
      ...duplicatedKey,
    ]);
    await expect(createKeysPage.createNodeOperatorForm.formBlock).toContainText(
      `pubkey ${trimAddress(duplicatedKey[0].pubkey, 6)} has duplicates`,
    );
  });

  test(
    qase(48, 'Should open transaction page after added 25 keys'),
    async ({ widgetService }) => {
      await mainPage.starterPackSection.createNodeOperatorBtn.click();
      await createKeysPage.createNodeOperatorForm.formBlock.waitFor({
        state: 'visible',
      });
      const txPage = await createKeysPage.createNodeOperatorForm.addNewKeys(
        getRandomKeys(25),
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
      const overTheLimitKeys = getRandomKeys(26);
      await createKeysPage.createNodeOperatorForm.fillKeys(overTheLimitKeys);
      await expect(
        createKeysPage.createNodeOperatorForm.formBlock,
      ).toContainText('Should have no more than 25 keys');
    },
  );
});
