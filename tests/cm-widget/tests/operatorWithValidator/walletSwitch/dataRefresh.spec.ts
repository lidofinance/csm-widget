import { expect } from '@playwright/test';
import { Address, Hex, toHex } from 'viem';
import { generatePrivateKey, mnemonicToAccount } from 'viem/accounts';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';
import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { Tags } from 'tests/shared/consts/common.const';
import { ROLES } from 'tests/shared/consts/roles';
import { RPC_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../test.fixture';

// any address the widget has never seen: it never signs, so it needs no funding
const OTHER_WALLET_KEY = generatePrivateKey();

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.cache,
    story: 'Account switch',
    tag: [Tags.forked],
  }),
  () => {
    let snapshotId: string;
    let operatorKey: Hex;
    let operatorAddress: Address;

    test.beforeAll(async ({ useFork, cmSDK, secretPhrase }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
      const operator = mnemonicToAccount(secretPhrase);
      operatorKey = toHex(operator.getHdKey().privateKey as Uint8Array);
      operatorAddress = operator.address;
      snapshotId = await cmSDK.evmSnapshot();
    });

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.dashboardPage.open();
    });

    test.afterAll(async ({ cmSDK, widgetService }) => {
      if (!snapshotId) return;
      // the wallet is worker-scoped: leave the operator active for the next spec
      await widgetService.walletPage.importKey(operatorKey);
      await cmSDK.evmRevert(snapshotId);
    });

    test('Should show an invite received while another wallet was connected', async ({
      widgetService,
      forkActionService,
    }) => {
      const { header, walletPage, navBlockElement } = widgetService;
      // an operator of another preset: its manager is not the wallet under test
      const invitedNoId = PRESETS.ONLY_OPERATOR.noId as number;
      const { inboxRequestsPage } = widgetService.settingsPage;
      const invitesCounter = navBlockElement.navCounter('Settings');
      let invitesBefore: number;

      await test.step('Read the invites the wallet has now', async () => {
        invitesBefore = (await invitesCounter.isVisible())
          ? Number(await invitesCounter.textContent())
          : 0;
      });

      await test.step('Switch to another wallet', async () => {
        await walletPage.importKey(OTHER_WALLET_KEY);
        await expect(
          widgetService.welcomePage.welcomeSection.welcomeSection,
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
        await navBlockElement.navItem('Settings').click();
        await navBlockElement.switcherTab('Inbox requests').click();
        await expect(
          inboxRequestsPage.getRequestLocator(invitedNoId, ROLES.REWARDS),
        ).toBeVisible({ timeout: RPC_WAIT_TIMEOUT });
      });
    });
  },
);
