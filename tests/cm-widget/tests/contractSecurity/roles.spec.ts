import { qase } from 'playwright-qase-reporter/playwright';
import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup';
import { contracts } from 'tests/cm-widget/consts/contracts.const';
import { Tags } from 'tests/shared/consts/common.const';
import { ROLES } from 'tests/shared/consts/roles';
import { LOW_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const NEW_ADDRESS = PRESETS.EMPTY_OPERATOR.address;
const INVITER_NO_ID = PRESETS.ONLY_OPERATOR.noId as number;

test.describe(
  ...suite({
    epic: EPIC.security,
    feature: 'Contract address',
    story: 'Roles & Settings',
    tag: Tags.contractSecurityCheck,
  }),
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(async ({ cmSDK, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();
      await widgetService.settingsPage.managerAddressPage.open();
      noId = await widgetService.extractNodeOperatorId();
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test(
      qase(599, 'Should send Propose manager address to CuratedModule'),
      async ({ widgetService }) => {
        const { managerAddressPage } = widgetService.settingsPage;
        const { walletPage } = widgetService;

        await test.step('Submit the proposal', async () => {
          await managerAddressPage.open();
          await managerAddressPage.addressInput.fill(NEW_ADDRESS);
          await managerAddressPage.addressValidIcon.waitFor();
          await managerAddressPage.proposeButton.click();
        });

        await test.step('Transaction goes to CuratedModule', async () => {
          await walletPage.assertReceiptAddress(contracts.module);
          await walletPage.cancelTx();
        });
      },
    );

    test(
      qase(600, 'Should send Change rewards address to CuratedModule'),
      async ({ widgetService }) => {
        const { rewardsAddressPage } = widgetService.settingsPage;
        const { walletPage } = widgetService;

        await test.step('Submit the change', async () => {
          await rewardsAddressPage.open();
          await rewardsAddressPage.addressInput.fill(NEW_ADDRESS);
          await rewardsAddressPage.addressValidIcon.waitFor();
          await rewardsAddressPage.page
            .getByRole('button', { name: 'Change Rewards Address' })
            .click();
          await rewardsAddressPage.page
            .getByRole('button', { name: 'Continue', exact: true })
            .click();
        });

        await test.step('Transaction goes to CuratedModule', async () => {
          await walletPage.assertReceiptAddress(contracts.module);
          await walletPage.cancelTx();
        });
      },
    );

    test(
      qase(601, 'Should send Set rewards claimer to Accounting'),
      async ({ widgetService }) => {
        const { claimerPage } = widgetService.settingsPage;
        const { walletPage } = widgetService;

        await test.step('Submit the claimer', async () => {
          await claimerPage.open();
          await claimerPage.setAddress(NEW_ADDRESS);
        });

        await test.step('Transaction goes to Accounting', async () => {
          await walletPage.assertReceiptAddress(contracts.accounting);
          await walletPage.cancelTx();
        });
      },
    );

    test(
      qase(602, 'Should send Set fee splits to Accounting'),
      async ({ widgetService }) => {
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
          await walletPage.assertReceiptAddress(contracts.accounting);
          await walletPage.cancelTx();
        });
      },
    );

    test(
      qase(603, 'Should send Save metadata to MetaRegistry'),
      async ({ widgetService }) => {
        const { metadataPage } = widgetService.settingsPage;
        const { walletPage } = widgetService;

        await test.step('Submit new metadata', async () => {
          await metadataPage.open();
          await metadataPage.nameInput.fill('Contract check');
          await metadataPage.descriptionInput.fill('Contract address check');
          await metadataPage.saveButton.click();
        });

        await test.step('Transaction goes to MetaRegistry', async () => {
          await walletPage.assertReceiptAddress(contracts.metaRegistry);
          await walletPage.cancelTx();
        });
      },
    );

    test(
      qase(604, 'Should send Accept invite to CuratedModule'),
      async ({ widgetService, forkActionService }) => {
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
            .getAcceptButton(INVITER_NO_ID, ROLES.REWARDS)
            .click();
        });

        await test.step('Transaction goes to CuratedModule', async () => {
          await walletPage.assertReceiptAddress(contracts.module);
          await walletPage.cancelTx();
        });
      },
    );

    test(
      qase(605, 'Should send Revoke manager proposal to CuratedModule'),
      async ({ widgetService, forkActionService }) => {
        const { managerAddressPage } = widgetService.settingsPage;
        const { walletPage } = widgetService;

        await test.step('Set up: propose a manager address', async () => {
          await forkActionService.proposeManager(noId, NEW_ADDRESS);
        });

        await test.step('Revoke the proposal', async () => {
          await managerAddressPage.open();
          await managerAddressPage.revokeButton.click();
        });

        await test.step('Transaction goes to CuratedModule', async () => {
          await walletPage.assertReceiptAddress(contracts.module);
          await walletPage.cancelTx();
        });
      },
    );
  },
);
