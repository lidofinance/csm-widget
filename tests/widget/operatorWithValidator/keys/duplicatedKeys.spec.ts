import { test } from '../../test.fixture';
import { KeysPage } from 'tests/pages';
import { TokenSymbol } from 'tests/consts/common.const';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { KeysGeneratorService } from 'tests/services/keysGenerator.service';

test.describe('Operator with keys. Validation duplicated keys.', async () => {
  let keysPage: KeysPage;
  let keysGeneratorService: KeysGeneratorService;

  test.beforeEach(async ({ widgetService }) => {
    keysPage = new KeysPage(widgetService.page);
    await keysPage.submitPage.open();
    keysGeneratorService = new KeysGeneratorService();
  });

  test(qase(18, 'Should failed if uploaded duplicate keys'), async () => {
    const duplicatedKey = keysGeneratorService.generateKeys();
    await keysPage.submitPage.fillKeys([...duplicatedKey, ...duplicatedKey]);
    await expect(keysPage.submitPage.validationInputError).toContainText(
      'Invalid deposit data',
    );
    await keysPage.submitPage.selectTab('Parsed');
    await expect(keysPage.submitPage.depositDataRow).toHaveCount(2);
    for (const row of await keysPage.submitPage.depositDataRow.all()) {
      await expect(row.getByTestId('deposit-data-error')).toHaveText(
        'pubkey is duplicated in deposit data',
      );
    }
  });

  test('Should failed if uploaded deposit data with existing pubkey', async () => {
    const duplicatedKey = keysGeneratorService.generateKeys();
    duplicatedKey[0].pubkey =
      'aac44a76a4b3414e01105ef07861771c5e5c7f91c556b4b8bb6b07258ade39efdf673cbe0277d091cbade43196a7c9de';
    await keysPage.submitPage.fillKeys(duplicatedKey);
    await expect(keysPage.submitPage.validationInputError).toContainText(
      'Invalid deposit data',
    );
    await keysPage.submitPage.selectTab('Parsed');
    await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
    for (const row of await keysPage.submitPage.depositDataRow.all()) {
      await expect(row.getByTestId('deposit-data-error')).toContainText(
        'invalid signature',
      );
      await expect(row.getByTestId('deposit-data-error')).toContainText(
        'pubkey already exists as validator on CL',
      );
    }
  });

  test(
    qase(332, 'Should not display duplicate error if previous tx was canceled'),
    async ({ widgetService }) => {
      const duplicatedKey = keysGeneratorService.generateKeys();

      const txPage = await keysPage.submitPage.submitKeys(
        duplicatedKey,
        TokenSymbol.ETH,
      );
      await widgetService.walletPage.cancelTx(txPage);
      await keysPage.submitPage.open();

      await keysPage.submitPage.fillKeys(duplicatedKey);

      await expect(keysPage.submitPage.validationInputError).not.toBeVisible();
    },
  );

  test('Should display error if key in cache', async ({ widgetService }) => {
    const duplicatedKey = keysGeneratorService.generateKeys();
    await widgetService.keysPage.setStorageData(
      'lido-csm-keys-cache-560048',
      JSON.stringify({
        [duplicatedKey[0].pubkey]: Date.now(),
      }),
    );

    await keysPage.submitPage.fillKeys(duplicatedKey);

    await expect(keysPage.submitPage.validationInputError).toContainText(
      'Invalid deposit data',
    );
    await keysPage.submitPage.selectTab('Parsed');
    await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
    for (const row of await keysPage.submitPage.depositDataRow.all()) {
      await expect(row.getByTestId('deposit-data-error')).toHaveText(
        'pubkey already exists in cache',
      );
    }
  });

  test('Should not display error if key in cache oldest than 2 weeks', async ({
    widgetService,
  }) => {
    const duplicatedKey = keysGeneratorService.generateKeys();
    await widgetService.keysPage.setStorageData(
      'lido-csm-keys-cache-560048',
      JSON.stringify({
        [duplicatedKey[0].pubkey]: Date.now() - 15 * 24 * 60 * 60 * 1000,
      }),
    );

    await keysPage.submitPage.fillKeys(duplicatedKey);

    await expect(keysPage.submitPage.validationInputError).toBeHidden();
  });

  test('Should display error if key already submitted', async ({
    widgetService,
    csmSDK,
  }) => {
    const duplicatedKey = keysGeneratorService.generateKeys();
    const nodeOperatorId = await widgetService.extractNodeOperatorId();

    const allKeys = await csmSDK.getAllKeys(BigInt(nodeOperatorId));
    duplicatedKey[0].pubkey = allKeys[0];
    await keysPage.submitPage.fillKeys(duplicatedKey);

    await expect(keysPage.submitPage.validationInputError).toContainText(
      'Invalid deposit data',
    );
    await keysPage.submitPage.selectTab('Parsed');
    await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
    for (const row of await keysPage.submitPage.depositDataRow.all()) {
      await expect(row.getByTestId('deposit-data-error')).toContainText(
        'invalid signature',
      );
      await expect(row.getByTestId('deposit-data-error')).toContainText(
        'pubkey was previously submitted',
      );
    }
  });
});
