import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { contracts } from 'tests/csm-widget/consts/contracts.const';
import { Tags } from 'tests/shared/consts/common.const';
import { ROLES } from 'tests/shared/consts/roles';
import { LOW_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const NEW_ADDRESS = PRESETS.EMPTY_ADDRESS.address;
const INVITER_NO_ID = PRESETS.EMPTY_OPERATOR.noId as number;

test.describe(
  ...suite({
    epic: EPIC.security,
    feature: 'Contract address',
    story: 'Roles',
    tag: Tags.contractSecurityCheck,
  }),
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(async ({ csmSDK, widgetService }) => {
      snapshotId = await csmSDK.evmSnapshot();
      await widgetService.settingsPage.managerAddressPage.open();
      noId = await widgetService.extractNodeOperatorId();
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    test('Should send Propose manager address to CSModule', async ({
      widgetService,
    }) => {
      const { managerAddressPage } = widgetService.settingsPage;
      const { walletPage } = widgetService;

      await test.step('Submit the proposal', async () => {
        await managerAddressPage.open();
        await managerAddressPage.addressInput.fill(NEW_ADDRESS);
        await managerAddressPage.addressValidIcon.waitFor();
        await managerAddressPage.proposeButton.click();
      });

      await test.step('Transaction goes to CSModule', async () => {
        await walletPage.assertReceiptAddress(contracts.csm.module);
        await walletPage.cancelTx();
      });
    });

    test('Should send Propose rewards address to CSModule', async ({
      widgetService,
    }) => {
      const { rewardsAddressPage } = widgetService.settingsPage;
      const { walletPage } = widgetService;

      await test.step('Submit the proposal', async () => {
        await rewardsAddressPage.open();
        await rewardsAddressPage.addressInput.fill(NEW_ADDRESS);
        await rewardsAddressPage.addressValidIcon.waitFor();
        await rewardsAddressPage.proposeButton.click();
        await rewardsAddressPage.page
          .getByRole('button', { name: 'Continue', exact: true })
          .click();
      });

      await test.step('Transaction goes to CSModule', async () => {
        await walletPage.assertReceiptAddress(contracts.csm.module);
        await walletPage.cancelTx();
      });
    });

    test('Should send Set rewards claimer to Accounting', async ({
      widgetService,
    }) => {
      const { claimerPage } = widgetService.settingsPage;
      const { walletPage } = widgetService;

      await test.step('Submit the claimer', async () => {
        await claimerPage.open();
        await claimerPage.setAddress(NEW_ADDRESS);
      });

      await test.step('Transaction goes to Accounting', async () => {
        await walletPage.assertReceiptAddress(contracts.csm.accounting);
        await walletPage.cancelTx();
      });
    });

    test('Should send Set fee splits to Accounting', async ({
      widgetService,
    }) => {
      const { splitsPage } = widgetService.settingsPage;
      const { walletPage, page } = widgetService;

      await test.step('Submit a single 100% split', async () => {
        await splitsPage.open();
        await splitsPage.clickSetupSplits();
        await splitsPage.addSplit(0, { address: NEW_ADDRESS, share: '100' });
        await page.waitForTimeout(LOW_TIMEOUT);
        await splitsPage.saveSplitsButton.click();
        await page
          .getByRole('button', { name: 'Confirm', exact: true })
          .click();
      });

      await test.step('Transaction goes to Accounting', async () => {
        await walletPage.assertReceiptAddress(contracts.csm.accounting);
        await walletPage.cancelTx();
      });
    });

    test('Should send Accept invite to CSModule', async ({
      widgetService,
      forkActionService,
    }) => {
      const { inboxRequestsPage } = widgetService.settingsPage;
      const { walletPage } = widgetService;

      await test.step('Set up: invite the wallet as rewards address', async () => {
        await forkActionService.proposeReward(
          INVITER_NO_ID,
          PRESETS.FULL_OPERATOR.address,
        );
      });

      await test.step('Accept the invite', async () => {
        await inboxRequestsPage.open();
        await inboxRequestsPage
          .getRequestLocator(INVITER_NO_ID, ROLES.REWARDS)
          .click();
        await inboxRequestsPage.acceptRequestButton.click();
      });

      await test.step('Transaction goes to CSModule', async () => {
        await walletPage.assertReceiptAddress(contracts.csm.module);
        await walletPage.cancelTx();
      });
    });

    test('Should send Revoke manager proposal to CSModule', async ({
      widgetService,
      forkActionService,
    }) => {
      const { managerAddressPage } = widgetService.settingsPage;
      const { walletPage } = widgetService;

      await test.step('Set up: propose a manager address', async () => {
        await forkActionService.proposeManager(noId, NEW_ADDRESS);
      });

      await test.step('Revoke the proposal', async () => {
        await managerAddressPage.open();
        await managerAddressPage.revokeButton.click();
      });

      await test.step('Transaction goes to CSModule', async () => {
        await walletPage.assertReceiptAddress(contracts.csm.module);
        await walletPage.cancelTx();
      });
    });

    test('Should send Reset manager address to CSModule', async ({
      widgetService,
      forkActionService,
    }) => {
      const { managerAddressPage } = widgetService.settingsPage;
      const { walletPage } = widgetService;

      await test.step('Set up: move the manager role away', async () => {
        await forkActionService.confirmManager(noId);
      });

      await test.step('Reset the manager address', async () => {
        await managerAddressPage.open();
        await managerAddressPage.resetButton.click();
      });

      await test.step('Transaction goes to CSModule', async () => {
        await walletPage.assertReceiptAddress(contracts.csm.module);
        await walletPage.cancelTx();
      });
    });
  },
);
