import { test } from '../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { Tags, TokenSymbol } from 'tests/shared/consts/common.const';

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

    test(
      qase(469, 'Should offer only ICS and IDVTC types without 0x01'),
      async ({ widgetService }) => {
        const cards = widgetService.mainPage.operatorTypeCards;
        await widgetService.mainPage.openCreateOperator();

        await test.step('ICS and IDVTC cards are shown', async () => {
          await expect(cards.icsCard).toBeVisible();
          await expect(cards.idvtcCard).toBeVisible();
          await expect(cards.getCardButton('idvtc')).toContainText(
            'Create IDVTC operator',
          );
        });

        await test.step('0x01 card is not offered', async () => {
          await expect(cards.csm01Card).toBeHidden();
        });
      },
    );

    test(
      qase(443, 'Should open the create operator page from the IDVTC card'),
      async ({ widgetService }) => {
        const cards = widgetService.mainPage.operatorTypeCards;
        await widgetService.mainPage.openCreateOperator();

        await cards.getCardButton('idvtc').click();
        await expect(widgetService.page).toHaveURL(/\/create/);
        await expect(widgetService.keysPage.headerTitle).toContainText('IDVTC');
      },
    );

    test(
      qase(444, 'Should require a 1.5 ETH bond for the first key'),
      async ({ widgetService, keysGeneratorService }) => {
        const form = widgetService.keysPage.createNodeOperatorForm;
        const keys = keysGeneratorService.generateKeys(1);

        await widgetService.keysPage.goto('idvtc');

        await test.step('Select ETH bond token and add one key', async () => {
          await form.getBondTokenElement(TokenSymbol.ETH).click();
          await form.fillKeys(keys);
        });

        await expect(form.amountInput).toHaveValue('1.5');
      },
    );
  },
);
