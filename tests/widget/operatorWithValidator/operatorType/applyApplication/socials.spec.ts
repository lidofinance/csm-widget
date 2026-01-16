import { test } from '../../../test.fixture';
import { expect } from '@playwright/test';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';

const secretPhrase = generateMnemonic(english, 128);

test.use({ secretPhrase: secretPhrase });

test.describe('Operator with keys. ICS. Apply application. Socials', async () => {
  test.beforeAll(async ({ widgetService }) => {
    const applicationForm = widgetService.operatorType.applicationForm;
    await applicationForm.open();

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
      await test.step('Verify link in description of step 1', async () => {
        const csmChannelLink =
          applicationForm.submitApplicationForm.discordSection.getByRole(
            'link',
            { name: 'the CSM channel' },
          );
        await expect(csmChannelLink).toHaveAttribute(
          'href',
          'https://discord.com/channels/761182643269795850/1404810479292907662',
        );
      });
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

  test('Should copy Twitter message to post after click to copy button', async ({
    widgetService,
    secretPhrase,
  }) => {
    const applicationForm = widgetService.operatorType.applicationForm;

    await test.step('Copy Twitter proof message', async () => {
      await applicationForm.submitApplicationForm.twitterProofStep1CopyBtn.click();
      const twitterMessage = await widgetService.page.evaluate(() =>
        navigator.clipboard.readText(),
      );
      const address = mnemonicToAccount(secretPhrase).address;
      const expectedTwitterMessage = `This post is proof that I am the owner of this X account. My address to get verified for ICS: ${address.toLowerCase()}`;

      expect(twitterMessage).toBe(expectedTwitterMessage);
    });
  });

  test('Should copy Discord message to post after click to copy button', async ({
    widgetService,
    secretPhrase,
  }) => {
    const applicationForm = widgetService.operatorType.applicationForm;

    await test.step('Copy Discord proof message', async () => {
      await applicationForm.submitApplicationForm.discordProofStep1CopyBtn.click();
      const discordMessage = await widgetService.page.evaluate(() =>
        navigator.clipboard.readText(),
      );
      const address = mnemonicToAccount(secretPhrase).address;
      const expectedDiscordMessage = `This post is proof that I am the owner of this Discord account. My address to get verified for ICS: ${address.toLowerCase()}`;
      expect(discordMessage).toBe(expectedDiscordMessage);
    });
  });

  test('Should correctly paste Twitter proof link', async ({
    widgetService,
  }) => {
    const applicationForm = widgetService.operatorType.applicationForm;
    const twitterProofLink = 'https://x.com/someuser/status/1234567890';

    await test.step('Paste Twitter proof link', async () => {
      await applicationForm.submitApplicationForm.twitterProofStep2
        .locator('input')
        .fill(twitterProofLink);

      await expect(
        applicationForm.submitApplicationForm.twitterProofStep2.locator(
          'input',
        ),
      ).toHaveValue(twitterProofLink);

      await expect(
        applicationForm.submitApplicationForm.twitterProofStep2.locator(
          'input',
        ),
      ).toHaveAttribute('placeholder', 'https://x.com/username/status/...');
      await expect(
        applicationForm.submitApplicationForm.twitterProofStep2.getByText(
          'Must be a valid Twitter/X status URL',
        ),
      ).toBeHidden();
    });
  });

  test('Should correctly paste Discord proof link', async ({
    widgetService,
  }) => {
    const applicationForm = widgetService.operatorType.applicationForm;
    const discordProofLink = 'https://discord.com/channels/123/456/789';

    await test.step('Paste Discord proof link', async () => {
      await applicationForm.submitApplicationForm.discordProofStep2
        .locator('input')
        .fill(discordProofLink);

      await expect(
        applicationForm.submitApplicationForm.discordProofStep2.locator(
          'input',
        ),
      ).toHaveValue(discordProofLink);

      await expect(
        applicationForm.submitApplicationForm.discordProofStep2.locator(
          'input',
        ),
      ).toHaveAttribute('placeholder', 'https://discord.com/channels/...');
      await expect(
        applicationForm.submitApplicationForm.discordProofStep2.getByText(
          'Must be a valid Discord message URL',
        ),
      ).toBeHidden();
    });
  });

  test('Should show error if paste incorrect Twitter proof link', async ({
    widgetService,
  }) => {
    const applicationForm = widgetService.operatorType.applicationForm;
    const twitterProofLink = 'https://x.com/someuser/1234567890';

    await test.step('Paste Twitter incorrect proof link', async () => {
      await applicationForm.submitApplicationForm.twitterProofStep2
        .locator('input')
        .fill(twitterProofLink);

      await expect(
        applicationForm.submitApplicationForm.twitterProofStep2.getByText(
          'Must be a valid Twitter/X status URL',
        ),
      ).toBeVisible();

      await expect(
        applicationForm.submitApplicationForm.submitBtn,
      ).toBeDisabled();
    });
  });

  test('Should show error if paste incorrect Discord proof link', async ({
    widgetService,
  }) => {
    const applicationForm = widgetService.operatorType.applicationForm;
    const discordProofLink = 'https://discord.com/chan/123/456/789';
    await test.step('Paste Discord incorrect proof link', async () => {
      await applicationForm.submitApplicationForm.discordProofStep2
        .locator('input')
        .fill(discordProofLink);

      await expect(
        applicationForm.submitApplicationForm.discordProofStep2.getByText(
          'Must be a valid Discord message URL',
        ),
      ).toBeVisible();

      await expect(
        applicationForm.submitApplicationForm.submitBtn,
      ).toBeDisabled();
    });
  });
});
