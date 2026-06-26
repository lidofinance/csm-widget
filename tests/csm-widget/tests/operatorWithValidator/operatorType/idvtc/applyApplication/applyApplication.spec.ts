import { test } from '../../../../test.fixture';
import { expect } from '@playwright/test';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { Tags } from 'tests/shared/consts/common.const';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

const CLUSTER_SIZE = 4;

const clusterMemberMessage = (memberAddress: string, mainAddress: string) =>
  `Verify ownership of address ${memberAddress.toLowerCase()} for DVT cluster with main address ${mainAddress.toLowerCase()}`;

const memberAccounts = Array.from({ length: CLUSTER_SIZE }, () =>
  mnemonicToAccount(generateMnemonic(english, 128)),
);

test.describe(
  'Operator with keys. IDVTC. Apply application. Cluster members (forked)',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(
      async ({ useFork, csmSDK, forkActionService, widgetService }) => {
        test.skip(!useFork, 'Test suite runs only on forked network');

        snapshotId = await csmSDK.evmSnapshot();

        await test.step('Make cluster member addresses ICS-approved', async () => {
          await forkActionService.setGateAddrs(
            'ics',
            ...memberAccounts.map((account) => account.address),
          );
        });

        await widgetService.setFeatureFlag('icsApplyForm', true);
        const { signInForm } = widgetService.operatorType.dvtApplicationForm;
        await widgetService.operatorType.dvtApplicationForm.open();
        await signInForm.signIn();
      },
    );

    test.beforeEach(async ({ widgetService }) => {
      await test.step('Reset persisted form and reopen', async () => {
        const dvtForm = widgetService.operatorType.dvtApplicationForm;
        await dvtForm.open();
        await dvtForm.applyForm.clearPersisted();
        await dvtForm.open();
        await dvtForm.applyForm.form.waitFor({ state: 'visible' });
      });
    });

    test.afterEach(async ({ widgetService }) => {
      await widgetService.operatorType.dvtApplicationForm.applyForm.clearPersisted();
    });

    test.afterAll(async ({ csmSDK, widgetService }) => {
      await test.step('Clear storage, disable flag and revert fork', async () => {
        await widgetService.page.evaluate(() => sessionStorage.clear());
        await widgetService.setFeatureFlag('icsApplyForm', false);
        if (snapshotId) await csmSDK.evmRevert(snapshotId);
      });
    });

    test('Should verify a cluster member and update progress', async ({
      widgetService,
      secretPhrase,
    }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;
      const member = applyForm.getClusterMember(0);
      const mainAddress = mnemonicToAccount(secretPhrase).address;
      const account = memberAccounts[0];

      await test.step('Fill ICS-approved address and sign the message', async () => {
        await member.enterAddress(account.address);
        await expect(member.addressError).toBeHidden();

        const message = clusterMemberMessage(account.address, mainAddress);
        const signature = await account.signMessage({ message });
        await member.signatureInput.fill(signature);
      });

      await test.step('Verify marks the member verified', async () => {
        await expect(applyForm.clusterProgress).toContainText('0 / 4 verified');
        await member.verifySignatureBtn.click();

        await expect(member.verifiedChip).toBeVisible();
        await expect(member.addressInput).toBeDisabled();
        await expect(member.addressInput).toHaveValue(account.address);
        await expect(applyForm.clusterProgress).toContainText('1 / 4 verified');
      });

      await test.step('Clear resets the member to unverified', async () => {
        await member.clearBtn.click();
        await expect(member.unverifiedChip).toBeVisible();
        await expect(member.addressInput).toHaveValue('');
        await expect(applyForm.clusterProgress).toContainText('0 / 4 verified');
      });
    });

    test('Should verify all cluster members', async ({
      widgetService,
      secretPhrase,
    }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;
      const mainAddress = mnemonicToAccount(secretPhrase).address;

      for (const [index, account] of memberAccounts.entries()) {
        await test.step(`Verify cluster member #${index + 1}`, async () => {
          const member = applyForm.getClusterMember(index);

          await member.enterAddress(account.address);
          await expect(member.addressError).toBeHidden();

          const message = clusterMemberMessage(account.address, mainAddress);
          const signature = await account.signMessage({ message });
          await member.signatureInput.fill(signature);
          await member.verifySignatureBtn.click();

          await expect(member.verifiedChip).toBeVisible();
          await expect(applyForm.clusterProgress).toContainText(
            `${index + 1} / 4 verified`,
          );
        });
      }

      await expect(applyForm.clusterProgress).toContainText('4 / 4 verified');
    });

    test('Should submit successfully after verifying all cluster members', async ({
      widgetService,
      secretPhrase,
    }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;
      const mainAddress = mnemonicToAccount(secretPhrase).address;
      const discordLink = 'https://discord.com/channels/123/456/789';
      await applyForm.discordLinkInput.fill(discordLink);

      for (const [index, account] of memberAccounts.entries()) {
        await test.step(`Verify cluster member #${index + 1}`, async () => {
          const member = applyForm.getClusterMember(index);

          await member.enterAddress(account.address);
          await expect(member.addressError).toBeHidden();

          const message = clusterMemberMessage(account.address, mainAddress);
          const signature = await account.signMessage({ message });
          await member.signatureInput.fill(signature);
          await member.verifySignatureBtn.click();

          await expect(member.verifiedChip).toBeVisible();
        });
      }
      await test.step('Submit the application', async () => {
        await expect(applyForm.clusterProgress).toContainText('4 / 4 verified');
        await expect(applyForm.discordLinkInput).toHaveValue(discordLink);

        await applyForm.confirmCheckboxInput.check({ force: true });
        await expect(applyForm.confirmCheckboxInput).toBeChecked();

        await expect(applyForm.submitBtn).toBeEnabled();
        await applyForm.submitBtn.click();
      });

      await test.step('Submission succeeds', async () => {
        const txModal = widgetService.operatorType.txModal;
        await txModal.modal.waitFor({ state: 'visible' });
        await expect(txModal.title).toContainText(
          'Your application has been submitted',
        );
        await expect(txModal.description).toContainText(
          "You can track your application's status on the Operator Type tab.",
        );
      });
    });
  },
);
