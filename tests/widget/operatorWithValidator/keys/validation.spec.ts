import { test } from '../../test.fixture';
import { KeysPage } from 'tests/pages';
import { Tags, TokenSymbol } from 'tests/consts/common.const';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import {
  KeysGeneratorService,
  DepositKey,
} from 'tests/services/keysGenerator.service';

test.use({ secretPhrase: process.env.EMPTY_NODE_SECRET_PHRASE });

const omitField = <K extends keyof DepositKey>(
  obj: DepositKey,
  field: K,
): Omit<DepositKey, K> => {
  const { [field]: _removed, ...rest } = obj;
  return rest;
};

const invalidTextValidation = [
  'withdrawal_credentials',
  'amount',
  'deposit_data_root',
  'deposit_message_root',
  'fork_version',
  'pubkey',
  'signature',
];

test.describe('Operator with keys. Validation keys json.', async () => {
  let keysPage: KeysPage;
  let keysGeneratorService: KeysGeneratorService;

  test.beforeEach(async ({ widgetService }) => {
    keysPage = new KeysPage(widgetService.page);
    await keysPage.submitPage.open();
    keysGeneratorService = new KeysGeneratorService();
  });

  test(
    qase(308, 'Should display error for empty keys json'),
    { tag: Tags.smoke },
    async () => {
      await keysPage.submitPage.fillKeys(
        // @ts-expect-error negative test for validation
        [{}],
      );

      await expect(keysPage.submitPage.validationInputError).toHaveText(
        'Item at index 0 is missing required field: pubkey',
      );
    },
  );

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
        'pubkey was previously submitted',
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

  invalidTextValidation.forEach((propertyName) => {
    test(
      qase(
        333,
        `Should display error if ${propertyName} does not passed for 1 key as object`,
      ),
      async () => {
        const key = keysGeneratorService.generateKeys();
        const newJson = omitField(key[0], propertyName as keyof DepositKey);

        await keysPage.submitPage.fillKeys(
          // @ts-expect-error negative test for validation
          newJson,
        );

        await expect(keysPage.submitPage.validationInputError).toHaveText(
          `Item at index 0 is missing required field: ${propertyName}`,
        );

        await test.step('Verify that other tabs and controls are disabled', async () => {
          await expect(
            keysPage.submitPage.formBlock
              .getByRole('button')
              .getByText('Parsed'),
          ).toBeDisabled();
          await expect(
            keysPage.submitPage.formBlock
              .getByRole('button')
              .getByText('Parameters'),
          ).toBeDisabled();

          await expect(keysPage.submitPage.amountInput).toBeDisabled();
          await expect(keysPage.submitPage.submitKeysButton).toBeDisabled();
          // @TODO: Fix it after bug fixed
          // await expect(keysPage.submitPage.confirmKeysReady).toBeDisabled();
        });
      },
    );
  });

  invalidTextValidation.forEach((propertyName) => {
    test(
      qase(
        340,
        `Should display error if ${propertyName} does not passed for array of keys`,
      ),
      async () => {
        const key = keysGeneratorService.generateKeys();
        const newJson = omitField(key[0], propertyName as keyof DepositKey);

        await keysPage.submitPage.fillKeys(
          // @ts-expect-error negative test for validation
          [newJson],
        );

        await expect(keysPage.submitPage.validationInputError).toHaveText(
          `Item at index 0 is missing required field: ${propertyName}`,
        );

        await test.step('Verify that other tabs and controls are disabled', async () => {
          await expect(
            keysPage.submitPage.formBlock
              .getByRole('button')
              .getByText('Parsed'),
          ).toBeDisabled();
          await expect(
            keysPage.submitPage.formBlock
              .getByRole('button')
              .getByText('Parameters'),
          ).toBeDisabled();

          await expect(keysPage.submitPage.amountInput).toBeDisabled();
          await expect(keysPage.submitPage.submitKeysButton).toBeDisabled();
          // @TODO: Uncomment it after bug fixed
          // await expect(keysPage.submitPage.confirmKeysReady).toBeDisabled();
        });
      },
    );
  });

  invalidTextValidation.forEach((propertyName) => {
    test(
      qase(
        347,
        `Should display error if ${propertyName} does not passed for index >0 in array of keys`,
      ),
      async () => {
        const keys = keysGeneratorService.generateKeys(3);
        // @ts-expect-error negative test for validation
        keys[2] = omitField(keys[2], propertyName);

        await keysPage.submitPage.fillKeys(keys);

        await expect(keysPage.submitPage.validationInputError).toHaveText(
          `Item at index 2 is missing required field: ${propertyName}`,
        );

        await test.step('Verify that other tabs and controls are disabled', async () => {
          await expect(
            keysPage.submitPage.formBlock
              .getByRole('button')
              .getByText('Parsed'),
          ).toBeDisabled();
          await expect(
            keysPage.submitPage.formBlock
              .getByRole('button')
              .getByText('Parameters'),
          ).toBeDisabled();

          await expect(keysPage.submitPage.amountInput).toBeDisabled();
          await expect(keysPage.submitPage.submitKeysButton).toBeDisabled();
          // @TODO: Uncomment it after bug fixed
          // await expect(keysPage.submitPage.confirmKeysReady).toBeDisabled();
        });
      },
    );
  });

  test(
    qase(
      354,
      'Shouldnt display error for valid eth2_network_name for current chain',
    ),
    async ({ widgetConfig }) => {
      const key = keysGeneratorService.generateKeys();
      const propertyName = 'network_name';
      const newJson = omitField(key[0], propertyName as keyof DepositKey);

      // @ts-expect-error negative test for validation
      newJson.eth2_network_name =
        widgetConfig.standConfig.networkConfig.chainName.toLowerCase();

      // @ts-expect-error negative test for validation
      await keysPage.submitPage.fillKeys([newJson]);
      await expect(keysPage.submitPage.validationInputError).toBeHidden();
    },
  );

  test(
    qase(355, 'Should ignore validation for optional deposit_cli_version'),
    async () => {
      const propertyName = 'deposit_cli_version';
      const key = keysGeneratorService.generateKeys();
      const newJson = omitField(key[0], propertyName as keyof DepositKey);

      await keysPage.submitPage.fillKeys(
        // @ts-expect-error negative test for validation
        [newJson],
      );

      await expect(keysPage.submitPage.validationInputError).toBeHidden();
    },
  );
});
