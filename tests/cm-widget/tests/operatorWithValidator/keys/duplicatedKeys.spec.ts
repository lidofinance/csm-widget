import { test } from '../../test.fixture';
import { KeysPage } from '../../../pages';
import { TokenSymbol } from '../../../../shared/consts/common.const';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { KeysGeneratorService } from '../../../../shared/services/keysGenerator.service';
import { Tags } from 'tests/shared/consts/common.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.ONLY_OPERATOR.secretPhrase });

test.describe(
  'Operator with keys. Validation duplicated keys.',
  { tag: [Tags.forked] },
  () => {
    let keysPage: KeysPage;
    let keysGeneratorService: KeysGeneratorService;

    test.beforeEach(async ({ widgetService }) => {
      keysPage = new KeysPage(widgetService.page);
      await keysPage.submitPage.open();
      keysGeneratorService = new KeysGeneratorService({ isCM: true });
    });

    test(qase(87, 'Should failed if uploaded duplicate keys'), async () => {
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

    test(
      qase(91, 'Should failed if uploaded deposit data with existing pubkey'),
      async () => {
        const existsValidatorKey = {
          pubkey:
            'b3bdd2660984a2e754358b0155cce4f29f676386798a19ce38281c7fb6e36c68660b37ed63a32e04959609a44b9ca3ac',
          withdrawal_credentials:
            '0200000000000000000000004473dcddbf77679a643bdb654dbd86d67f8d32f2',
          amount: 32000000000,
          signature:
            '8b483bbef13858a1b525b086031c3512970802c7ad95e3802eea74e4e8f24d6861bb5fe9b0b82af648bf21b9eb143a451685faccb7473bac8f70e080c9d97c17b86ae8c49edcd4c5621fbdeeeae94ee02f360f50db662b07b793379fe98ffd50',
          deposit_message_root:
            '575acd3eaa182e87bbb77331220b98e90101d4ba315403bc9123326698a70750',
          deposit_data_root:
            '2aa20cd60cee21607f854ca68a308ab4912bef82dba913ebe7990a9d02425e68',
          fork_version: '10000910',
          network_name: 'hoodi',
          deposit_cli_version: '1.3.0',
        };
        await keysPage.submitPage.fillKeys([existsValidatorKey]);
        await expect(keysPage.submitPage.validationInputError).toContainText(
          'Invalid deposit data',
        );
        await keysPage.submitPage.selectTab('Parsed');
        await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
        for (const row of await keysPage.submitPage.depositDataRow.all()) {
          await expect(row.getByTestId('deposit-data-error')).toContainText(
            'pubkey already exists as a validator on CL',
          );
        }
      },
    );

    test(
      qase(
        88,
        'Should not display duplicate error if previous tx was canceled',
      ),
      async ({ widgetService }) => {
        const duplicatedKey = keysGeneratorService.generateKeys();

        await keysPage.submitPage.submitKeys(duplicatedKey, TokenSymbol.ETH);
        await widgetService.walletPage.cancelTx();
        await keysPage.submitPage.open();

        await keysPage.submitPage.fillKeys(duplicatedKey);

        await expect(
          keysPage.submitPage.validationInputError,
        ).not.toBeVisible();
      },
    );

    test(
      qase(89, 'Should display error if key in cache'),
      async ({ widgetService }) => {
        const duplicatedKey = keysGeneratorService.generateKeys();
        await widgetService.keysPage.setStorageData(
          'lido-keys-cache-560048',
          JSON.stringify({
            [duplicatedKey[0].pubkey]: Date.now(),
          }),
        );
        await widgetService.page.reload();
        await keysPage.submitPage.fillKeys(duplicatedKey);

        await expect(keysPage.submitPage.validationInputError).toContainText(
          'Invalid deposit data',
        );
        await keysPage.submitPage.selectTab('Parsed');
        await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
        for (const row of await keysPage.submitPage.depositDataRow.all()) {
          await expect(row.getByTestId('deposit-data-error')).toHaveText(
            'pubkey already submitted',
          );
        }
      },
    );

    test(
      qase(90, 'Should not display error if key in cache oldest than 2 weeks'),
      async ({ widgetService }) => {
        const duplicatedKey = keysGeneratorService.generateKeys();
        await widgetService.keysPage.setStorageData(
          'lido-keys-cache-560048',
          JSON.stringify({
            [duplicatedKey[0].pubkey]: Date.now() - 15 * 24 * 60 * 60 * 1000,
          }),
        );

        await keysPage.submitPage.fillKeys(duplicatedKey);

        await expect(keysPage.submitPage.validationInputError).toBeHidden();
      },
    );

    test(
      qase(92, 'Should display error if key already submitted'),
      async ({ widgetService }) => {
        const duplicatedKey = keysGeneratorService.generateKeys();

        await keysPage.submitPage.submitKeys(duplicatedKey, TokenSymbol.ETH);

        await widgetService.walletPage.confirmTx();
        await widgetService.keysPage.removeKeyFromLocalStorage(
          'lido-keys-cache-560048',
        );
        await keysPage.submitPage.open();

        await keysPage.submitPage.fillKeys(duplicatedKey);

        await expect(keysPage.submitPage.validationInputError).toContainText(
          'Invalid deposit data',
        );
        await keysPage.submitPage.selectTab('Parsed');
        await expect(keysPage.submitPage.depositDataRow).toHaveCount(1);
        for (const row of await keysPage.submitPage.depositDataRow.all()) {
          await expect(row.getByTestId('deposit-data-error')).toContainText(
            'pubkey already submitted',
          );
          await expect(row.getByTestId('deposit-data-error')).toContainText(
            'pubkey already submitted',
          );
        }
      },
    );
  },
);
