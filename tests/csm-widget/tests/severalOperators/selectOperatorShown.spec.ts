import { expect } from '@playwright/test';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { generateMnemonic, mnemonicToAccount } from 'viem/accounts';
import { Tags } from 'tests/shared/consts/common.const';
import { ROLES, SHORT_ROLES } from 'tests/shared/consts/roles';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../test.fixture';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

const MANAGED_IDS = [0, 1];

test.describe(
  'Wallet manages several Node Operators. Select modal (forked)',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    const expectedBadges = [SHORT_ROLES[ROLES.MANAGER]];

    test.beforeAll(async ({ useFork, evmNode, forkActionService, csmSDK }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');

      const address = mnemonicToAccount(secretPhrase).address;
      snapshotId = await evmNode.snapshot();

      await test.step('Move the manager role of two operators onto the wallet', async () => {
        for (const noId of MANAGED_IDS) {
          await forkActionService.proposeManager(noId, address);
          await forkActionService.confirmManager(noId);
        }
      });

      const operators = await csmSDK.getNodeOperatorsByAddress(address);
      expect(
        operators.map((operator) => Number(operator.nodeOperatorId)).sort(),
        'the manager role must have moved onto both operators',
      ).toEqual(MANAGED_IDS);
    });

    test.afterAll(async ({ evmNode, widgetService }) => {
      if (snapshotId) await evmNode.revert(snapshotId);
      await widgetService.selectOperatorModal.forgetSelectionAndReload();
    });

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.selectOperatorModal.forgetSelectionAndReload();
    });

    test('Should list every managed operator', async ({ widgetService }) => {
      const modal = widgetService.selectOperatorModal;

      await test.step('The prompt explains why it is shown', async () => {
        await expect(modal.modal).toBeVisible({ timeout: PAGE_WAIT_TIMEOUT });
        await expect(modal.title).toBeVisible();
        await expect(modal.description).toContainText(
          'Your wallet manages several Node Operators. Choose the one to work with.',
        );
      });

      await test.step('Every managed operator has its own row', async () => {
        await expect(modal.rows).toHaveCount(MANAGED_IDS.length);
        for (const noId of MANAGED_IDS) {
          await expect(modal.rowById(noId)).toBeVisible();
        }
      });

      await test.step('Each row shows the roles the wallet holds', async () => {
        for (const noId of MANAGED_IDS) {
          await expect(modal.roleBadgesById(noId)).toHaveText(expectedBadges);
        }
      });

      await test.step('Both role legends are shown', async () => {
        await expect(modal.legendManager).toContainText('Manager Address role');
        await expect(modal.legendRewards).toContainText('Rewards Address role');
      });

      await test.step('The app shell stays hidden behind the prompt', async () => {
        await expect(widgetService.header.accountSection).toBeHidden();
        await expect(widgetService.header.switchOperatorButton).toBeHidden();
      });
    });

    test('Should activate the clicked operator', async ({ widgetService }) => {
      const target = MANAGED_IDS[1];

      await test.step('Pick the second operator in the list', async () => {
        await widgetService.selectOperatorModal.selectOperator(target);
        expect(await widgetService.extractNodeOperatorId()).toBe(target);
      });

      await test.step('The pick survives a reload', async () => {
        await widgetService.page.reload();
        await expect(widgetService.header.switchOperatorButton).toBeVisible();
        await expect(widgetService.selectOperatorModal.modal).toBeHidden();
        expect(await widgetService.extractNodeOperatorId()).toBe(target);
      });
    });

    test('Should disconnect when the prompt is closed', async ({
      widgetService,
    }) => {
      const modal = widgetService.selectOperatorModal;
      const closings: [string, () => Promise<void>][] = [
        ['the cross', () => modal.clickCross()],
        ['Escape', () => modal.pressEscape()],
        ['the backdrop', () => modal.clickBackdrop()],
      ];

      for (const [name, close] of closings) {
        await test.step(`Closing by ${name} disconnects the wallet`, async () => {
          await expect(modal.modal).toBeVisible({ timeout: PAGE_WAIT_TIMEOUT });
          await close();
          await expect(widgetService.header.connectWalletBtn).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await expect(widgetService.header.accountSection).toBeHidden();
        });

        await test.step(`Reconnecting after ${name} asks again`, async () => {
          await widgetService.connectWallet({ keepOperatorPrompt: true });
          await expect(modal.modal).toBeVisible({ timeout: PAGE_WAIT_TIMEOUT });
        });
      }
    });

    test('Should ask again after a deliberate disconnect', async ({
      widgetService,
    }) => {
      const modal = widgetService.selectOperatorModal;

      await test.step('Pick the first operator', async () => {
        await modal.selectOperator(MANAGED_IDS[0]);
        expect(await widgetService.extractNodeOperatorId()).toBe(
          MANAGED_IDS[0],
        );
      });

      await test.step('Disconnecting forgets the pick', async () => {
        await widgetService.header.disconnectWallet();
        await widgetService.connectWallet({ keepOperatorPrompt: true });
        await expect(modal.modal).toBeVisible({ timeout: PAGE_WAIT_TIMEOUT });
      });
    });
  },
);
