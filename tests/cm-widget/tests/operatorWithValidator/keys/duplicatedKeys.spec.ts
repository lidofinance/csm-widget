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
      await widgetService.setFeatureFlag(
        'disableDepositDataSignatureValidation',
        true,
      );
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
        const existsValidatorKey = keysGeneratorService.generateKeys();
        existsValidatorKey[0].pubkey =
          'b7937dc00d4e21e54bab83b6eaa15c408f1726315e1fdac9c8cd77c793be2fa4fd2529147d637910f79f0664457375ab';
        await keysPage.submitPage.fillKeys([...existsValidatorKey]);
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
