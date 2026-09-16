import { test } from '../../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { qase } from 'playwright-qase-reporter/playwright';
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
  ...suite({
    epic: EPIC.operatorType,
    feature: 'IDVTC',
    story: 'Apply. Submit happy path',
    tag: [Tags.forked],
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(
      async ({ useFork, evmNode, forkActionService, widgetService }) => {
        test.skip(!useFork, 'Test suite runs only on forked network');

        snapshotId = await evmNode.snapshot();

        await test.step('Make cluster member addresses ICS-approved', async () => {
          await forkActionService.setGateAddrs(
            'ics',
            ...memberAccounts.map((account) => account.address),
          );
        });

        await widgetService.setFeatureFlag('icsApplyForm', true);
        const dvtForm = widgetService.operatorType.dvtApplicationForm;
        await dvtForm.open();
        await dvtForm.signInForm.signIn();

        await test.step('Reset persisted form and reopen', async () => {
          await dvtForm.applyForm.clearPersisted();
          await dvtForm.open();
          await dvtForm.applyForm.form.waitFor({ state: 'visible' });
        });
      },
    );

    test.afterAll(async ({ evmNode, widgetService }) => {
      await test.step('Clear storage, disable flag and revert fork', async () => {
        await widgetService.operatorType.dvtApplicationForm.applyForm.clearPersisted();
        await widgetService.page.evaluate(() => sessionStorage.clear());
        await widgetService.setFeatureFlag('icsApplyForm', false);
        if (snapshotId) await evmNode.revert(snapshotId);
      });
    });

    test(
      qase(
        436,
        'Should submit successfully after verifying all cluster members',
      ),
      { tag: [Tags.noStaging, Tags.noProd] },
      async ({ widgetService, secretPhrase }) => {
        const applyForm =
          widgetService.operatorType.dvtApplicationForm.applyForm;
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
          await expect(applyForm.clusterProgress).toContainText(
            '4 / 4 verified',
          );
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
            "You can track your application's status on the Operator Type tab",
          );
        });
      },
    );
  },
);
