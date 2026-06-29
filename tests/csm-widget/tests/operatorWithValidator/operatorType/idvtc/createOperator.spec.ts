import { test } from '../../../test.fixture';
import { expect } from '@playwright/test';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { Tags, TokenSymbol } from 'tests/shared/consts/common.const';
import { KeysGeneratorService } from 'tests/shared/services/keysGenerator.service';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

test.describe(
  'Operator without keys. IDVTC issued. Create operator (forked)',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(
      async ({
        useFork,
        evmNode,
        forkActionService,
        widgetService,
        secretPhrase,
      }) => {
        test.skip(!useFork, 'Test suite runs only on forked network');

        snapshotId = await evmNode.snapshot();

        await test.step('Issue IDVTC status to the connected address', async () => {
          await forkActionService.setGateAddrs(
            'idvtc',
            mnemonicToAccount(secretPhrase).address,
          );
        });

        await widgetService.setFeatureFlag('icsApplyForm', true);
      },
    );

    test.afterAll(async ({ evmNode, widgetService }) => {
      await widgetService.setFeatureFlag('icsApplyForm', false);
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test('Should offer only ICS and IDVTC types without DEF', async ({
      widgetService,
    }) => {
      const modal = widgetService.mainPage.operatorTypeModal;
      await widgetService.mainPage.openOperatorTypeModal();

      await test.step('ICS and IDVTC cards are shown', async () => {
        await expect(modal.icsCard).toBeVisible();
        await expect(modal.idvtcCard).toBeVisible();
        await expect(modal.getCardButton('idvtc')).toContainText(
          'Create IDVTC operator',
        );
      });

      await test.step('DEF card is not offered', async () => {
        await expect(modal.defCard).toBeHidden();
      });
    });

    test('Should open the create operator page from the IDVTC card', async ({
      widgetService,
    }) => {
      const modal = widgetService.mainPage.operatorTypeModal;
      await widgetService.mainPage.openOperatorTypeModal();

      await modal.getCardButton('idvtc').click();
      await expect(widgetService.page).toHaveURL(/\/create/);
    });

    test('Should require a 1.5 ETH bond for the first key', async ({
      widgetService,
    }) => {
      const form = widgetService.keysPage.createNodeOperatorForm;
      const keys = new KeysGeneratorService().generateKeys(1);

      await widgetService.keysPage.goto();

      await test.step('Select ETH bond token and add one key', async () => {
        await form.getBondTokenElement(TokenSymbol.ETH).click();
        await form.fillKeys(keys);
      });

      await expect(form.amountInput).toHaveValue('1.5');
    });
  },
);
