import { expect } from '@playwright/test';
import { Address, Hex, toHex } from 'viem';
import { generatePrivateKey, mnemonicToAccount } from 'viem/accounts';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { ROLES } from 'tests/shared/consts/roles';
import { RPC_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';

const OTHER_WALLET_KEY = generatePrivateKey();

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.cache,
    story: 'Account switch',
  }),
  () => {
    let snapshotId: string;
    let operatorKey: Hex;
    let operatorAddress: Address;

    test.beforeAll(async ({ csmSDK, secretPhrase }) => {
      const operator = mnemonicToAccount(secretPhrase);
      operatorKey = toHex(operator.getHdKey().privateKey as Uint8Array);
      operatorAddress = operator.address;
      snapshotId = await csmSDK.evmSnapshot();
    });

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.dashboardPage.open();
    });

    test.afterAll(async ({ csmSDK, widgetService }) => {
      if (!snapshotId) return;
      await widgetService.walletPage.importKey(operatorKey);
      await csmSDK.evmRevert(snapshotId);
    });

    test(
      qase(
        561,
        'Should show an invite received while another wallet was connected',
      ),
      async ({ widgetService, forkActionService, csmSDK }) => {
        const { header, walletPage } = widgetService;
        const { inboxRequestsPage } = widgetService.settingsPage;
        const navBlock = widgetService.navBlockElement;
        const invitesCounter = navBlock.navCounter('Settings');
        let invitedNoId: number;
        let invitesBefore: number;

        await test.step('Pick an operator the wallet does not own', async () => {
          const owned = await csmSDK.getNodeOperatorsByAddress(operatorAddress);
          const ownedIds = owned.map((operator) =>
            Number(operator.nodeOperatorId),
          );
          invitedNoId = Array.from(
            { length: 200 },
            (_, index) => index + 1,
          ).find((id) => !ownedIds.includes(id)) as number;
          invitesBefore = (await invitesCounter.isVisible())
            ? Number(await invitesCounter.textContent())
            : 0;
        });

        await test.step('Switch to another wallet', async () => {
          await walletPage.importKey(OTHER_WALLET_KEY);
          await expect(
            widgetService.mainPage.starterPackSection.section,
          ).toBeVisible({ timeout: RPC_WAIT_TIMEOUT });
        });

        await test.step('Propose the operator wallet as a rewards address', async () => {
          await forkActionService.proposeReward(invitedNoId, operatorAddress);
        });

        await test.step('Switch back to the operator wallet', async () => {
          await walletPage.importKey(operatorKey);
          await expect(header.switchOperatorButton).toBeVisible({
            timeout: RPC_WAIT_TIMEOUT,
          });
        });

        await test.step('Settings counts the new invite without a reload', async () => {
          await expect(invitesCounter).toHaveText(String(invitesBefore + 1), {
            timeout: RPC_WAIT_TIMEOUT,
          });
        });

        await test.step('Inbox requests lists the new invite', async () => {
          await navBlock.navItem('Settings').click();
          await navBlock.switcherTab('Inbox requests').click();
          await expect(
            inboxRequestsPage.getRequestLocator(invitedNoId, ROLES.REWARDS),
          ).toBeVisible({ timeout: RPC_WAIT_TIMEOUT });
        });
      },
    );
  },
);
