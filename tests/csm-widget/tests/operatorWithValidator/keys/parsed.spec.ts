import { test } from '../../test.fixture';
import { KeysPage } from 'tests/csm-widget/pages';
import { expect } from '@playwright/test';
import { KeysGeneratorService } from 'tests/shared/services/keysGenerator.service';
import { randomBytes } from 'node:crypto';
import { generateWithdrawalCredentials } from 'tests/shared/helpers/accountData';
import { qase } from 'playwright-qase-reporter/playwright';

test.use({ secretPhrase: process.env.EMPTY_NODE_SECRET_PHRASE });

test.describe('Operator with keys. Validation keys json.', async () => {
  let keysPage: KeysPage;
  let keysGeneratorService: KeysGeneratorService;

  test.beforeEach(
    async ({ widgetService, keysGeneratorService: keysGenerator }) => {
      keysPage = new KeysPage(widgetService.page);
      await keysPage.submitPage.open();
      keysGeneratorService = keysGenerator;
    },
  );

  test(qase(326, 'Should display error for invalid amount'), async () => {
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
        'amount is not equal to 32 ETH',
      );
    }
  });

  test(qase(327, 'Should display error for invalid hex pubkey'), async () => {
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
    qase(392, 'Should display error for invalid pubkey with random symbols'),
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
        await expect(row.getByTestId('deposit-data-error')).toHaveText(
          'pubkey is not a valid hex string',
        );
      }
    },
  );

  test(
    qase(328, 'Should display error for invalid deposit_message_root'),
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
    qase(386, 'Should display error for invalid string deposit_message_root'),
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
        await expect(row.getByTestId('deposit-data-error')).toHaveText(
          'deposit_message_root is not a valid hex string',
        );
      }
    },
  );

  test(
    qase(329, 'Should display error for invalid withdrawal_credentials'),
    async () => {
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
          'withdrawal_credentials is not the Lido Withdrawal Vault',
        );
      }
    },
  );

  test(
    qase(387, 'Should display error for invalid string withdrawal_credentials'),
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
        await expect(row.getByTestId('deposit-data-error')).toHaveText(
          'withdrawal_credentials is not a valid hex string',
        );
      }
    },
  );

  test(qase(330, 'Should display error for invalid fork_version'), async () => {
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
  });

  test(
    qase(
      331,
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
          `network_name is not equal to ${widgetConfig.standConfig.keysGeneratorConfig.chain.toLowerCase()}`,
        );
      }
    },
  );

  test('Should count only invalid keys when some keys are valid', async () => {
    const keys = keysGeneratorService.generateKeys({ numValidators: 3 });
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

      await expect(rows.nth(0).getByTestId('deposit-data-error')).toContainText(
        'amount is not equal to 32 ETH',
      );
      await expect(rows.nth(1).getByTestId('deposit-data-error')).toBeHidden();
      await expect(rows.nth(2).getByTestId('deposit-data-error')).toContainText(
        'amount is not equal to 32 ETH',
      );
    });
  });
});
