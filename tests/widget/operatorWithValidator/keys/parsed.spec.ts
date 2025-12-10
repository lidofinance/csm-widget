import { test } from '../../test.fixture';
import { KeysPage } from 'tests/pages';
import { expect } from '@playwright/test';
import { KeysGeneratorService } from 'tests/services/keysGenerator.service';
import { randomBytes } from 'node:crypto';
import { generateWithdrawalCredentials } from 'tests/helpers/accountData';
import { qase } from 'playwright-qase-reporter/playwright';

test.use({ secretPhrase: process.env.EMPTY_NODE_SECRET_PHRASE });

test.describe('Operator with keys. Validation keys json.', async () => {
  let keysPage: KeysPage;
  let keysGeneratorService: KeysGeneratorService;

  test.beforeEach(async ({ widgetService }) => {
    keysPage = new KeysPage(widgetService.page);
    await keysPage.submitPage.open();
    keysGeneratorService = new KeysGeneratorService();
  });

  test(qase(326, 'Should display error for invalid amount'), async () => {
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

  test(qase(327, 'Should display error for invalid pubkey'), async () => {
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
          'invalid signature',
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
          'withdrawal_credentials is not the Lido Withdrawal Vaultinvalid signature',
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
          `network_name or eth2_network_name is not equal to ${widgetConfig.standConfig.networkConfig.chainName.toLowerCase()}`,
        );
      }
    },
  );
});
