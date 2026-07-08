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
import { SubmitPage } from 'tests/cm-widget/pages/tabs/keys/submit.page';

test.use({ secretPhrase: PRESETS.ONLY_OPERATOR.secretPhrase });

const omitField = <K extends keyof DepositKey>(
  obj: DepositKey,
  field: K,
): Omit<DepositKey, K> => {
  const { [field]: _removed, ...rest } = obj;
  return rest;
};

// Unparseable JSON keeps depositData empty, so the Parsed/Parameters tabs and
// downstream controls must stay locked.
const expectFormLocked = (submitPage: SubmitPage) =>
  test.step('Verify Parsed/Parameters tabs and controls are disabled', async () => {
    await expect(submitPage.parsedTab).toBeDisabled();
    await expect(submitPage.parametersTab).toBeDisabled();
    await expect(submitPage.amountInput).toBeDisabled();
    await expect(submitPage.submitKeysButton).toBeDisabled();
    await expect(submitPage.confirmKeysReadyInput).toBeDisabled();
  });

// Omitting any of these required fields makes the SDK parser reject the JSON
// before per-key validation runs, surfacing a "missing required field" error.
const requiredFields: (keyof DepositKey)[] = [
  'withdrawal_credentials',
  'amount',
  'deposit_data_root',
  'deposit_message_root',
  'fork_version',
  'pubkey',
  'signature',
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

      await test.step('Verify Parsed tab is available with error counter', async () => {
        await expect(keysPage.submitPage.parsedTab).toBeEnabled();
        await expect(keysPage.submitPage.parametersTab).toBeEnabled();
        await expect(keysPage.submitPage.parsedTabCounter).toHaveText('1');
      });

      await keysPage.submitPage.selectTab('Parsed');
      await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
      for (const row of await keysPage.submitPage.depositDataRow.all()) {
        await expect(row.getByTestId('deposit-data-error')).toHaveText(
          'amount is not equal to 32 ETHsignature failed BLS verification',
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
          'signature failed BLS verification',
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
            'signature failed BLS verification',
          );
          await expect(row.getByTestId('deposit-data-error')).toContainText(
            'pubkey is not a valid hex string',
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
            'signature failed BLS verification',
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
            'signature failed BLS verification',
          );
          await expect(row.getByTestId('deposit-data-error')).toContainText(
            'deposit_message_root is not a valid hex string',
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
            'withdrawal_credentials is not the Lido Withdrawal Vaultsignature failed BLS verification',
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
          'wrong key type: only 0x02 withdrawal credentials are supportedsignature failed BLS verification',
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
            'signature failed BLS verification',
          );
          await expect(row.getByTestId('deposit-data-error')).toContainText(
            'withdrawal_credentials is not a valid hex string',
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
            `network_name is not equal to ${widgetConfig.standConfig.networkConfig.chainName.toLowerCase()}`,
          );
        }
      },
    );

    test(
      qase(365, 'Should count only invalid keys when some keys are valid'),
      async () => {
        const keys = keysGeneratorService.generateKeys(3);
        keys[0].amount = 1;
        keys[2].amount = 1;

        await keysPage.submitPage.fillKeys(keys);
        await expect(keysPage.submitPage.validationInputError).toContainText(
          'Invalid deposit data',
        );

        await test.step('Verify counter reflects only the invalid keys', async () => {
          await expect(keysPage.submitPage.parsedTab).toBeEnabled();
          await expect(keysPage.submitPage.parsedTabCounter).toHaveText('2');
        });

        await keysPage.submitPage.selectTab('Parsed');
        await expect(keysPage.submitPage.depositDataRow).toHaveCount(3);

        await test.step('Verify per-row error detection', async () => {
          const rows = keysPage.submitPage.depositDataRow;
          await expect(
            rows.nth(0).getByTestId('deposit-data-error-detected'),
          ).toHaveText('Yes');
          await expect(
            rows.nth(1).getByTestId('deposit-data-error-detected'),
          ).toHaveText('No');
          await expect(
            rows.nth(2).getByTestId('deposit-data-error-detected'),
          ).toHaveText('Yes');

          await expect(
            rows.nth(0).getByTestId('deposit-data-error'),
          ).toContainText('amount is not equal to 32 ETH');
          await expect(
            rows.nth(1).getByTestId('deposit-data-error'),
          ).toBeHidden();
          await expect(
            rows.nth(2).getByTestId('deposit-data-error'),
          ).toContainText('amount is not equal to 32 ETH');
        });
      },
    );

    requiredFields.forEach((propertyName) => {
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

          await expect(keysPage.submitPage.validationInputError).toHaveText(
            `Item at index 0 is missing required field: ${propertyName}`,
          );

          await expectFormLocked(keysPage.submitPage);
        },
      );
    });

    requiredFields.forEach((propertyName) => {
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

          await expect(keysPage.submitPage.validationInputError).toHaveText(
            `Item at index 0 is missing required field: ${propertyName}`,
          );

          await expectFormLocked(keysPage.submitPage);
        },
      );
    });

    requiredFields.forEach((propertyName) => {
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

          await expect(keysPage.submitPage.validationInputError).toHaveText(
            `Item at index 2 is missing required field: ${propertyName}`,
          );

          await expectFormLocked(keysPage.submitPage);
        },
      );
    });
  },
);
