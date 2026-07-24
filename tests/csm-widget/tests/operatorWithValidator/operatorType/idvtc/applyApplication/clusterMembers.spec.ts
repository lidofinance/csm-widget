import { test } from '../../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

const CLUSTER_SIZE = 4;

const clusterMemberMessage = (memberAddress: string, mainAddress: string) =>
  `Verify ownership of address ${memberAddress.toLowerCase()} for DVT cluster with main address ${mainAddress.toLowerCase()}`;

test.describe('Operator with keys. IDVTC. Apply application. Cluster members', async () => {
  test.beforeAll(async ({ widgetService }) => {
    await widgetService.setFeatureFlag('icsApplyForm', true);

    const { signInForm } = widgetService.operatorType.dvtApplicationForm;
    await widgetService.operatorType.dvtApplicationForm.open();
    await signInForm.signIn();
  });

  test.beforeEach(async ({ widgetService }) => {
    await test.step('Reset persisted form and reopen', async () => {
      const dvtForm = widgetService.operatorType.dvtApplicationForm;
      await dvtForm.applyForm.clearPersisted();
      await dvtForm.open();
      await dvtForm.applyForm.form.waitFor({ state: 'visible' });
    });
  });

  test.afterEach(async ({ widgetService }) => {
    await widgetService.operatorType.dvtApplicationForm.applyForm.clearPersisted();
  });

  test.afterAll(async ({ widgetService }) => {
    await test.step('Clear storage and disable flag', async () => {
      await widgetService.page.evaluate(() => sessionStorage.clear());
      await widgetService.setFeatureFlag('icsApplyForm', false);
    });
  });

  test(
    qase(477, 'Should fill all cluster member addresses'),
    async ({ widgetService }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;
      const addresses = Array.from(
        { length: CLUSTER_SIZE },
        () => mnemonicToAccount(generateMnemonic(english, 128)).address,
      );

      await test.step('Fill every cluster member address', async () => {
        for (const [index, address] of addresses.entries()) {
          await applyForm.getClusterMember(index).enterAddress(address);
        }
      });

      await test.step('Each member keeps its address and is unverified', async () => {
        for (const [index, address] of addresses.entries()) {
          const member = applyForm.getClusterMember(index);
          await expect(member.addressInput).toHaveValue(address);
          await expect(member.unverifiedChip).toBeVisible();
        }
        await expect(applyForm.clusterProgress).toContainText('0 / 4 verified');
      });
    },
  );

  test(
    qase(452, 'Should generate and copy the message to sign'),
    async ({ widgetService, secretPhrase }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;
      const member = applyForm.getClusterMember(0);
      const mainAddress = mnemonicToAccount(secretPhrase).address;
      const memberAddress = mnemonicToAccount(
        generateMnemonic(english, 128),
      ).address;

      await test.step('Empty message for an invalid address', async () => {
        await member.addressInput.fill('0xnot-an-address');
        await expect(member.messageToSignInput).toHaveValue('');
      });

      await test.step('Generated message for a valid address', async () => {
        await member.addressInput.fill(memberAddress);
        await expect(member.messageToSignInput).toHaveValue(
          clusterMemberMessage(memberAddress, mainAddress),
        );
      });

      await test.step('Copy the message to sign', async () => {
        await member.copyMessageBtn.click();
        const clipboard = await widgetService.page.evaluate(() =>
          navigator.clipboard.readText(),
        );
        expect(clipboard).toBe(
          clusterMemberMessage(memberAddress, mainAddress),
        );
      });
    },
  );

  test(
    qase(453, 'Should toggle the confirmation checkbox'),
    async ({ widgetService }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;

      await expect(applyForm.confirmCheckboxInput).not.toBeChecked();

      await test.step('Check the confirmation', async () => {
        await applyForm.confirmCheckboxInput.check({ force: true });
        await expect(applyForm.confirmCheckboxInput).toBeChecked();
      });

      await test.step('Uncheck the confirmation', async () => {
        await applyForm.confirmCheckboxInput.uncheck({ force: true });
        await expect(applyForm.confirmCheckboxInput).not.toBeChecked();
      });
    },
  );

  test(
    qase(454, 'Should reject an invalid signature'),
    async ({ widgetService, secretPhrase }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;
      const member = applyForm.getClusterMember(0);
      const mainAddress = mnemonicToAccount(secretPhrase).address;
      const memberAccount = mnemonicToAccount(generateMnemonic(english, 128));
      const otherAccount = mnemonicToAccount(generateMnemonic(english, 128));

      await test.step('Sign with a different account than the address', async () => {
        await member.enterAddress(memberAccount.address);
        const message = clusterMemberMessage(
          memberAccount.address,
          mainAddress,
        );
        const wrongSignature = await otherAccount.signMessage({ message });
        await member.signatureInput.fill(wrongSignature);
      });

      await test.step('Verification fails and member stays unverified', async () => {
        await member.verifySignatureBtn.click();
        await expect(member.signatureError).toContainText(
          'Invalid signature for this address and message',
        );
        await expect(member.unverifiedChip).toBeVisible();
        await expect(applyForm.clusterProgress).toContainText('0 / 4 verified');
      });
    },
  );

  test(
    qase(455, 'Should require ICS-approved cluster addresses'),
    async ({ widgetService }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;
      const member = applyForm.getClusterMember(0);

      await member.addressInput.fill(
        mnemonicToAccount(generateMnemonic(english, 128)).address,
      );

      await expect(member.addressError).toContainText(
        'Address is not ICS-approved',
      );
      await expect(applyForm.submitBtn).toBeDisabled();
    },
  );

  test(
    qase(
      456,
      'Should not verify a member when its address is not ICS-approved',
    ),
    async ({ widgetService, secretPhrase }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;
      const member = applyForm.getClusterMember(0);
      const mainAddress = mnemonicToAccount(secretPhrase).address;
      const memberAccount = mnemonicToAccount(generateMnemonic(english, 128));

      await test.step('Sign correctly for a non-ICS address and verify', async () => {
        await member.enterAddress(memberAccount.address);
        await expect(member.addressError).toContainText(
          'Address is not ICS-approved',
        );

        const message = clusterMemberMessage(
          memberAccount.address,
          mainAddress,
        );
        const signature = await memberAccount.signMessage({ message });
        await member.signatureInput.fill(signature);
        await member.verifySignatureBtn.click();
      });

      await test.step('Member stays unverified once verification settles', async () => {
        await expect(member.addressError).toContainText(
          'Address is not ICS-approved',
        );
        await expect(member.verifiedChip).toBeHidden();
        await expect(member.unverifiedChip).toBeVisible();
        await expect(applyForm.clusterProgress).toContainText('0 / 4 verified');
      });
    },
  );

  test(
    qase(457, 'Should reject duplicate cluster addresses'),
    async ({ widgetService }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;
      const member0 = applyForm.getClusterMember(0);
      const member1 = applyForm.getClusterMember(1);
      const duplicateAddress = mnemonicToAccount(
        generateMnemonic(english, 128),
      ).address;

      await test.step('Fill the same address into two members', async () => {
        await member0.addressInput.fill(duplicateAddress);
        await member1.addressInput.fill(duplicateAddress);
      });

      await test.step('Both members show the duplicate error', async () => {
        await expect(member1.addressError).toContainText(
          'Duplicate addresses are not allowed',
        );
        await expect(applyForm.submitBtn).toBeDisabled();
      });
    },
  );

  test(
    qase(458, 'Should accept optional member contacts'),
    async ({ widgetService }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;
      const member = applyForm.getClusterMember(0);

      await member.addressInput.fill(
        mnemonicToAccount(generateMnemonic(english, 128)).address,
      );

      await test.step('Fill optional Discord and Telegram contacts', async () => {
        await member.discordHandleInput.fill('member#1234');
        await member.telegramUsernameInput.fill('@member_tg');

        await expect(member.discordHandleInput).toHaveValue('member#1234');
        await expect(member.telegramUsernameInput).toHaveValue('@member_tg');
      });
    },
  );
});
