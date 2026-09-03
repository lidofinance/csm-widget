import { expect } from '@playwright/test';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { generateMnemonic, mnemonicToAccount } from 'viem/accounts';
import { Tags, TokenSymbol } from 'tests/shared/consts/common.const';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../test.fixture';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

test.describe(
  'Address without operators. Create the first one.',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ useFork, evmNode }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
      snapshotId = await evmNode.snapshot();
      await evmNode.setBalance(mnemonicToAccount(secretPhrase).address, 1000);
    });

    test.afterAll(async ({ evmNode }) => {
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test('Should not offer a switch', async ({
      widgetService,
      keysGeneratorService,
      csmSDK,
    }) => {
      const txModal = widgetService.txModal;
      const keys = keysGeneratorService.generateKeys(1);

      await test.step('Create the operator', async () => {
        await widgetService.keysPage.goto();
        await widgetService.keysPage.createNodeOperatorForm.submitNewKeys(
          keys,
          TokenSymbol.ETH,
        );
        await widgetService.walletPage.confirmTx();
        await widgetService.page.waitForSelector(
          'text=Node Operator has been created',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
      });

      await test.step('The success screen offers no switch', async () => {
        await expect(txModal.switchToOperatorBtn).toBeHidden();
      });

      await test.step('The created operator is already active', async () => {
        const operators = await csmSDK.getNodeOperatorsByAddress(
          mnemonicToAccount(secretPhrase).address,
        );
        const ids = operators.map((operator) =>
          Number(operator.nodeOperatorId),
        );
        expect(
          ids,
          'the create must leave the wallet with exactly one operator',
        ).toHaveLength(1);

        await expect(txModal.description).toContainText(
          `Node Operator ID is ${ids[0]}`,
        );

        await txModal.closeModal();
        await expect(txModal.modal).toBeHidden();
        expect(await widgetService.extractNodeOperatorId()).toBe(ids[0]);
      });
    });
  },
);
