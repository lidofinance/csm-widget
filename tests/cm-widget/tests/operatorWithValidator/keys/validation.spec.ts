import { test } from '../../test.fixture';
import { KeysPage } from '../../../pages';
import { Tags } from '../../../../shared/consts/common.const';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import {
  KeysGeneratorService,
  DepositKey,
} from '../../../../shared/services/keysGenerator.service';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.ONLY_OPERATOR.secretPhrase });

const omitField = <K extends keyof DepositKey>(
  obj: DepositKey,
  field: K,
): Omit<DepositKey, K> => {
  const { [field]: _removed, ...rest } = obj;
  return rest;
};

test.describe(
  'Operator with keys. Validation keys. JSON tab',
  { tag: [Tags.forked] },
  () => {
    let keysPage: KeysPage;
    let keysGeneratorService: KeysGeneratorService;

    test.beforeEach(async ({ widgetService }) => {
      keysPage = new KeysPage(widgetService.page);
      await keysPage.submitPage.open();
      keysGeneratorService = new KeysGeneratorService({ isCM: true });
    });

    test(
      qase(103, 'Should display error for empty keys json'),
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

    test(
      qase(
        125,
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
      qase(126, 'Should ignore validation for optional deposit_cli_version'),
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
  },
);
