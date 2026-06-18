import { test } from '../../test.fixture';
import { KeysPage } from '../../../pages';
import { Tags } from '../../../../shared/consts/common.const';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import {
  KeysGeneratorService,
  DepositKey,
} from '../../../../shared/services/keysGenerator.service';
import { randomBytes } from 'node:crypto';
import { generateWithdrawalCredentials } from '../../../../shared/helpers/accountData';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.ONLY_OPERATOR.secretPhrase });

const omitField = <K extends keyof DepositKey>(
  obj: DepositKey,
  field: K,
): Omit<DepositKey, K> => {
  const { [field]: _removed, ...rest } = obj;
  return rest;
};

const invalidTextValidation: {
  key: keyof DepositKey;
  expectedError: string;
}[] = [
  {
    key: 'withdrawal_credentials',
    expectedError:
      'withdrawal_credentials is not a valid stringinvalid signature',
  },
  {
    key: 'amount',
    expectedError: 'amount is not equal to 32 ethinvalid signature',
  },
  {
    key: 'deposit_data_root',
    expectedError: 'deposit_data_root is not a valid string',
  },
  {
    key: 'deposit_message_root',
    expectedError:
      'deposit_message_root is not a valid stringinvalid signature',
  },
  {
    key: 'fork_version',
    expectedError: 'fork_version is not equal to 10000910',
  },
  {
    key: 'pubkey',
    expectedError: 'pubkey is not a valid stringinvalid signature',
  },
  { key: 'signature', expectedError: 'signature is not a valid string' },
];

test.describe(
  'Operator with keys. Validation keys. Parsed tab',
  { tag: [Tags.forked] },
  () => {
    let keysPage: KeysPage;
    let keysGeneratorService: KeysGeneratorService;

    test.beforeEach(async ({ widgetService }) => {
      keysPage = new KeysPage(widgetService.page);
      await keysPage.submitPage.open();
      keysGeneratorService = new KeysGeneratorService({ isCM: true });
    });

    test(qase(93, 'Should display error for invalid amount'), async () => {
      const key = keysGeneratorService.generateKeys();
      key[0].amount = 1;

      await keysPage.submitPage.fillKeys(key);
      await expect(keysPage.submitPage.validationInputError).toContainText(
        'Invalid deposit data',
      );
      await keysPage.submitPage.selectTab('Parsed');
      await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
      for (const row of await keysPage.submitPage.depositDataRow.all()) {
        await expect(row.getByTestId('deposit-data-error')).toHaveText(
          'amount is not equal to 32 ethinvalid signature',
        );
      }
    });

    test(qase(94, 'Should display error for invalid hex pubkey'), async () => {
      const key = keysGeneratorService.generateKeys();
      key[0].pubkey = randomBytes(48).toString('hex');

      await keysPage.submitPage.fillKeys(key);
      await expect(keysPage.submitPage.validationInputError).toContainText(
        'Invalid deposit data',
      );
      await keysPage.submitPage.selectTab('Parsed');
      await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
      for (const row of await keysPage.submitPage.depositDataRow.all()) {
        await expect(row.getByTestId('deposit-data-error')).toHaveText(
          'invalid signature',
        );
      }
    });

    test(
      qase(95, 'Should display error for invalid pubkey with random symbols'),
      async () => {
        const key = keysGeneratorService.generateKeys();
        key[0].pubkey = 'asdfgh';

        await keysPage.submitPage.fillKeys(key);
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
            'pubkey is not valid string',
          );
        }
      },
    );

    test(
      qase(96, 'Should display error for invalid deposit_message_root'),
      async () => {
        const key = keysGeneratorService.generateKeys();
        key[0].deposit_message_root = randomBytes(32).toString('hex');

        await keysPage.submitPage.fillKeys(key);
        await expect(keysPage.submitPage.validationInputError).toContainText(
          'Invalid deposit data',
        );
        await keysPage.submitPage.selectTab('Parsed');
        await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
        for (const row of await keysPage.submitPage.depositDataRow.all()) {
          await expect(row.getByTestId('deposit-data-error')).toHaveText(
            'invalid signature',
          );
        }
      },
    );

    test(
      qase(97, 'Should display error for invalid string deposit_message_root'),
      async () => {
        const key = keysGeneratorService.generateKeys();
        key[0].deposit_message_root = 'asdsd';

        await keysPage.submitPage.fillKeys(key);
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
            'deposit_message_root is not a valid string',
          );
        }
      },
    );

    test(
      qase(98, 'Should display error for invalid withdrawal_credentials'),
      async () => {
        const key = keysGeneratorService.generateKeys();

        key[0].withdrawal_credentials = generateWithdrawalCredentials(true);

        await keysPage.submitPage.fillKeys(key);
        await expect(keysPage.submitPage.validationInputError).toContainText(
          'Invalid deposit data',
        );
        await keysPage.submitPage.selectTab('Parsed');
        await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
        for (const row of await keysPage.submitPage.depositDataRow.all()) {
          await expect(row.getByTestId('deposit-data-error')).toHaveText(
            'withdrawal_credentials is not the Lido Withdrawal Vaultinvalid signature',
          );
        }
      },
    );

    test(qase(99, 'Should display error for wrong key type'), async () => {
      const key = keysGeneratorService.generateKeys();

      key[0].withdrawal_credentials = generateWithdrawalCredentials();

      await keysPage.submitPage.fillKeys(key);
      await expect(keysPage.submitPage.validationInputError).toContainText(
        'Invalid deposit data',
      );
      await keysPage.submitPage.selectTab('Parsed');
      await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
      for (const row of await keysPage.submitPage.depositDataRow.all()) {
        await expect(row.getByTestId('deposit-data-error')).toHaveText(
          'wrong key type: only 0x02 withdrawal credentials are supportedinvalid signature',
        );
      }
    });

    test(
      qase(
        100,
        'Should display error for invalid string withdrawal_credentials',
      ),
      async () => {
        const key = keysGeneratorService.generateKeys();

        key[0].withdrawal_credentials = 'dasdasd';

        await keysPage.submitPage.fillKeys(key);
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
            'withdrawal_credentials is not a valid string',
          );
        }
      },
    );

    test(
      qase(101, 'Should display error for invalid fork_version'),
      async () => {
        const key = keysGeneratorService.generateKeys();

        key[0].fork_version = '10000920';

        await keysPage.submitPage.fillKeys(key);
        await expect(keysPage.submitPage.validationInputError).toContainText(
          'Invalid deposit data',
        );
        await keysPage.submitPage.selectTab('Parsed');
        await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
        for (const row of await keysPage.submitPage.depositDataRow.all()) {
          await expect(row.getByTestId('deposit-data-error')).toHaveText(
            'fork_version is not equal to 10000910',
          );
        }
      },
    );

    test(
      qase(
        102,
        'Should display error for invalid network_name for current chain',
      ),
      async ({ widgetConfig }) => {
        const key = keysGeneratorService.generateKeys();

        key[0].network_name = 'invalid_network_name';

        await keysPage.submitPage.fillKeys(key);
        await expect(keysPage.submitPage.validationInputError).toContainText(
          'Invalid deposit data',
        );
        await keysPage.submitPage.selectTab('Parsed');
        await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
        for (const row of await keysPage.submitPage.depositDataRow.all()) {
          await expect(row.getByTestId('deposit-data-error')).toHaveText(
            `network_name or eth2_network_name is not equal to ${widgetConfig.standConfig.networkConfig.chainName.toLowerCase()}`,
          );
        }
      },
    );

    invalidTextValidation.forEach(({ key: propertyName, expectedError }) => {
      test(
        qase(
          104,
          `Should display error if ${propertyName} does not passed for 1 key as object`,
        ),
        async () => {
          qase.parameters({ propertyName });
          const key = keysGeneratorService.generateKeys();
          const newJson = omitField(key[0], propertyName);

          await keysPage.submitPage.fillKeys(
            // @ts-expect-error negative test for validation
            newJson,
          );

          await test.step('Verify invalid deposit data error is shown', async () => {
            await expect(keysPage.submitPage.validationInputError).toHaveText(
              'Invalid deposit data',
            );
          });

          await test.step('Verify Parsed tab shows per-key error', async () => {
            await keysPage.submitPage.selectTab('Parsed');
            await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
            const row = keysPage.submitPage.depositDataRow.first();
            await expect(row.getByTestId('deposit-data-error')).toContainText(
              expectedError,
            );
          });
        },
      );
    });

    invalidTextValidation.forEach(({ key: propertyName, expectedError }) => {
      test(
        qase(
          111,
          `Should display error if ${propertyName} does not passed for array of keys`,
        ),
        async () => {
          qase.parameters({ propertyName });
          const key = keysGeneratorService.generateKeys();
          const newJson = omitField(key[0], propertyName);

          await keysPage.submitPage.fillKeys(
            // @ts-expect-error negative test for validation
            [newJson],
          );

          await test.step('Verify invalid deposit data error is shown', async () => {
            await expect(keysPage.submitPage.validationInputError).toHaveText(
              'Invalid deposit data',
            );
          });

          await test.step('Verify Parsed tab shows per-key error', async () => {
            await keysPage.submitPage.selectTab('Parsed');
            await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
            const row = keysPage.submitPage.depositDataRow.first();
            await expect(row.getByTestId('deposit-data-error')).toContainText(
              expectedError,
            );
          });
        },
      );
    });

    invalidTextValidation.forEach(({ key: propertyName, expectedError }) => {
      test(
        qase(
          118,
          `Should display error if ${propertyName} does not passed for index >0 in array of keys`,
        ),
        async () => {
          qase.parameters({ propertyName });
          const keys = keysGeneratorService.generateKeys(3);
          // @ts-expect-error negative test for validation
          keys[2] = omitField(keys[2], propertyName);

          await keysPage.submitPage.fillKeys(keys);

          await test.step('Verify invalid deposit data error is shown', async () => {
            await expect(keysPage.submitPage.validationInputError).toHaveText(
              'Invalid deposit data',
            );
          });

          await test.step('Verify Parsed tab shows error only on key at index 2', async () => {
            await keysPage.submitPage.selectTab('Parsed');
            await expect(keysPage.submitPage.depositDataRow).toHaveCount(3);

            const rows = await keysPage.submitPage.depositDataRow.all();
            await expect(
              rows[0].getByTestId('deposit-data-error'),
            ).not.toBeVisible();
            await expect(
              rows[1].getByTestId('deposit-data-error'),
            ).not.toBeVisible();
            await expect(
              rows[2].getByTestId('deposit-data-error'),
            ).toContainText(expectedError);
          });
        },
      );
    });
  },
);
