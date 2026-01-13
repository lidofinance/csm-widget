import { test } from '../../../test.fixture';
import { expect } from '@playwright/test';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { applyApplicationMockResponse } from 'tests/services/mockResponses/applyApplication.mock';

const secretPhrase = generateMnemonic(english, 128);

test.use({ secretPhrase: secretPhrase });

test.describe('Operator with keys. ICS. Apply application. Socials', async () => {
  test.beforeAll(async ({ widgetService, httpMockerService }) => {
    const applicationForm = widgetService.operatorType.applicationForm;
    await applicationForm.open();

    await test.step('Set up mock', async () => {
      const applyApplicationResponse = applyApplicationMockResponse;
      await httpMockerService.mockIcsApply(applyApplicationResponse);

      const statusResponse = applyApplicationMockResponse;
      await httpMockerService.mockIcsStatus(statusResponse);
    });

    await applicationForm.signInForm.signIn();
  });

  test.beforeEach(async ({ widgetService }) => {
    const applicationForm = widgetService.operatorType.applicationForm;

    await applicationForm.open();
  });

  test.afterAll(async ({ widgetService }) => {
    await test.step('Clear session storage', async () => {
      await widgetService.page.evaluate(() => {
        sessionStorage.clear();
      });
    });
  });

  test('Check socials text appearance', async ({ widgetService }) => {
    const applicationForm = widgetService.operatorType.applicationForm;

    await test.step('Verify main texts', async () => {
      await expect(
        applicationForm.submitApplicationForm.socialProofSection,
      ).toContainText(
        'You can add your social accounts. To prove you own an account, post a message. For more info see the guide',
      );

      await expect(
        applicationForm.submitApplicationForm.socialProofTitile,
      ).toContainText('Optional');
    });

    await test.step('Verify link in socials section', async () => {
      const guideLink =
        applicationForm.submitApplicationForm.socialProofSection.getByRole(
          'link',
          { name: 'the guide' },
        );
      await expect(guideLink).toHaveAttribute(
        'href',
        'https://www.youtube.com/watch?v=yUX34iCbCWE',
      );
    });
  });

  test('Check Twitter section appearance', async ({
    widgetService,
    secretPhrase,
  }) => {
    const applicationForm = widgetService.operatorType.applicationForm;

    await test.step('Verify Twitter section texts', async () => {
      await expect(
        applicationForm.submitApplicationForm.twitterSection.locator('h4'),
      ).toContainText('X (formerly Twitter)');
      await expect(
        applicationForm.submitApplicationForm.twitterProofStep1,
      ).toContainText(
        'Step 1. Prove the ownership of the X account by posting a tweet with the following text',
      );

      await test.step('Verify link in description of step 1', async () => {
        const csmChannelLink =
          applicationForm.submitApplicationForm.socialProofSection.getByRole(
            'link',
            { name: 'the CSM channel' },
          );
        await expect(csmChannelLink).toHaveAttribute(
          'href',
          'https://discord.com/channels/761182643269795850/1404810479292907662',
        );
      });

      await expect(
        applicationForm.submitApplicationForm.twitterProofStep2,
      ).toContainText('Step 2. Paste the link to this post');
    });
    const address = mnemonicToAccount(secretPhrase).address;

    await test.step('Verify Twitter proof message input', async () => {
      await expect(
        applicationForm.submitApplicationForm.twitterProofStep1Input,
      ).toHaveValue(
        `This post is proof that I am the owner of this X account. My address to get verified for ICS: ${address.toLowerCase()}`,
      );

      await expect(
        applicationForm.submitApplicationForm.twitterProofStep1CopyBtn,
      ).toBeVisible();
    });
  });

  test('Check Discord section appearance', async ({ widgetService }) => {
    const applicationForm = widgetService.operatorType.applicationForm;

    await test.step('Verify Discord section texts', async () => {
      await expect(
        applicationForm.submitApplicationForm.discordSection.locator('h4'),
      ).toContainText('Discord');
      await expect(
        applicationForm.submitApplicationForm.discordProofStep1,
      ).toContainText(
        'Step 1. Prove the ownership of the Discord account by posting the following message to the CSM channel',
      );

      await expect(
        applicationForm.submitApplicationForm.discordProofStep2,
      ).toContainText('Step 2. Paste the link to this message');
    });
    const address = mnemonicToAccount(secretPhrase).address;

    await test.step('Verify Discord proof message input', async () => {
      await expect(
        applicationForm.submitApplicationForm.discordProofStep1Input,
      ).toHaveValue(
        `This post is proof that I am the owner of this Discord account. My address to get verified for ICS: ${address.toLowerCase()}`,
      );

      await expect(
        applicationForm.submitApplicationForm.discordProofStep1CopyBtn,
      ).toBeVisible();
    });
  });
});
