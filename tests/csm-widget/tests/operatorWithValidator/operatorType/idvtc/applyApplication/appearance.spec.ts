import { test } from '../../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

test.describe('Operator with keys. IDVTC. Apply application. Appearance', async () => {
  test.beforeAll(async ({ widgetService }) => {
    await widgetService.setFeatureFlag('icsApplyForm', true);

    const { signInForm } = widgetService.operatorType.dvtApplicationForm;
    await widgetService.operatorType.dvtApplicationForm.open();
    await signInForm.signIn();
  });

  test.beforeEach(async ({ widgetService }) => {
    await widgetService.operatorType.dvtApplicationForm.open();
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
    qase(476, 'Should show main address section texts'),
    async ({ widgetService }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;

      await expect(applyForm.mainAddressSection).toContainText('Main address');
      await expect(applyForm.mainAddressSection).toContainText(
        'You are requesting IDVTC operator type for the following address:',
      );
      await expect(applyForm.mainAddressSection).toContainText('Verified');
    },
  );

  test(
    qase(448, 'Should show socials section texts'),
    async ({ widgetService }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;

      await test.step('Socials heading and description', async () => {
        await expect(applyForm.socialProofSection).toContainText('Socials');
        await expect(applyForm.socialProofSection).toContainText(
          'You must add your social accounts. To prove you own an account, post a message. For more info see the guide',
        );
        await expect(
          applyForm.socialProofSection.getByRole('link', { name: 'the guide' }),
        ).toHaveAttribute(
          'href',
          'https://www.youtube.com/watch?v=yUX34iCbCWE',
        );
      });

      await test.step('Discord section', async () => {
        await expect(applyForm.discordSection).toContainText('Discord');
        await expect(applyForm.discordProofStep1).toContainText(
          'Step 1. Prove the ownership of the Discord account by posting the following message to the CSM channel',
        );
        await expect(
          applyForm.discordSection.getByRole('link', {
            name: 'the CSM channel',
          }),
        ).toHaveAttribute(
          'href',
          'https://discord.com/channels/761182643269795850/1404810479292907662',
        );
        await expect(applyForm.discordProofStep2).toContainText(
          'Step 2. Paste the link to this message',
        );
      });

      await test.step('Telegram section is optional', async () => {
        await expect(applyForm.telegramSection).toContainText('Telegram');
        await expect(applyForm.telegramSection).toContainText('Optional');
      });
    },
  );

  test(
    qase(449, 'Should show cluster members section texts'),
    async ({ widgetService }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;
      const member = applyForm.getClusterMember(0);

      await test.step('Section heading, description and progress', async () => {
        await expect(applyForm.clusterMembersSection).toContainText(
          'Cluster member addresses',
        );
        await expect(applyForm.clusterMembersSection).toContainText(
          'Verify ownership of 4 additional Ethereum addresses in your validator cluster.',
        );
        await expect(applyForm.clusterProgress).toContainText('0 / 4 verified');
      });

      await test.step('First member card texts', async () => {
        await expect(member.card).toContainText('Cluster member #1');
        await expect(member.step1).toContainText(
          'Step 1. Insert cluster member #1 Ethereum address and send the link to this member to sign the transaction on Etherscan.',
        );
        await expect(member.step1).toContainText('Message to sign');
        await expect(member.signBtn).toContainText('Sign');
        await expect(member.step2).toContainText(
          'Step 2. Copy the signature and past in the field below',
        );
        await expect(member.card).toContainText('Add contacts');
      });
    },
  );

  test(
    qase(450, 'Should show confirmation and submit texts'),
    async ({ widgetService }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;

      await test.step('Confirmation copy', async () => {
        await expect(applyForm.confirmationsSection).toContainText(
          'I confirm that:',
        );
        await expect(applyForm.confirmationsSection).toContainText(
          'Cluster participants understand the requirements and eligibility criteria',
        );
        await expect(applyForm.confirmationsSection).toContainText(
          'Cluster participants agree to enroll in monitoring via DVT provider specific tooling (e.g. Obol Grafana metrics or automatic SSV Network metrics)',
        );
      });

      await test.step('Submit button label', async () => {
        await expect(applyForm.submitBtn).toContainText('Submit application');
      });
    },
  );
});
