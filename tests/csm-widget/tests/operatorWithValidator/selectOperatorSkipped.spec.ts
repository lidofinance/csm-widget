import { expect } from '@playwright/test';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { generateMnemonic, mnemonicToAccount } from 'viem/accounts';
import { Tags } from 'tests/shared/consts/common.const';
import { test } from '../test.fixture';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

const MANAGED_ID = 0;

test.describe(
  'Wallet manages a single Node Operator. Select modal (forked)',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ useFork, evmNode, forkActionService, csmSDK }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');

      const address = mnemonicToAccount(secretPhrase).address;
      snapshotId = await evmNode.snapshot();

      await test.step('Move the manager role of one operator onto the wallet', async () => {
        await forkActionService.proposeManager(MANAGED_ID, address);
        await forkActionService.confirmManager(MANAGED_ID);
      });

      const operators = await csmSDK.getNodeOperatorsByAddress(address);
      expect(
        operators.map((operator) => Number(operator.nodeOperatorId)),
        'the wallet must manage exactly one operator',
      ).toEqual([MANAGED_ID]);
    });

    test.afterAll(async ({ evmNode, widgetService }) => {
      if (snapshotId) await evmNode.revert(snapshotId);
      await widgetService.selectOperatorModal.forgetSelectionAndReload();
    });

    test('Should skip operator selection', async ({ widgetService }) => {
      await test.step('Drop the cached selection and reload', async () => {
        await widgetService.selectOperatorModal.forgetSelectionAndReload();
      });

      await test.step('The widget resolves the operator on its own', async () => {
        await expect(widgetService.header.switchOperatorButton).toBeVisible();
        await expect(widgetService.selectOperatorModal.modal).toBeHidden();
        expect(await widgetService.extractNodeOperatorId()).toBe(MANAGED_ID);
      });
    });
  },
);
