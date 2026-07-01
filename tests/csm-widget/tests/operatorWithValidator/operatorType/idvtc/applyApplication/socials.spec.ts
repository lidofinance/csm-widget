import { test } from '../../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

const discordMessage = (address: string) =>
  `This post is proof that I am the owner of this Discord account. My address to get verified for IDVTC: ${address.toLowerCase()}`;

test.describe('Operator with keys. IDVTC. Apply application. Socials', async () => {
  test.beforeAll(async ({ widgetService }) => {
    await widgetService.setFeatureFlag('icsApplyForm', true);

    const { signInForm } = widgetService.operatorType.dvtApplicationForm;
    await widgetService.operatorType.dvtApplicationForm.open();
    await signInForm.signIn();
  });

  test.beforeEach(async ({ widgetService }) => {
    await test.step('Reset persisted form and reopen', async () => {
      await widgetService.page.evaluate(() => {
        Object.keys(localStorage)
          .filter((key) => key.startsWith('dvt-apply-'))
          .forEach((key) => localStorage.removeItem(key));
      });
      await widgetService.operatorType.dvtApplicationForm.open();
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
    qase(479, 'Should generate and copy the Discord proof message'),
    async ({ widgetService, secretPhrase }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;
      const address = mnemonicToAccount(secretPhrase).address;

      await test.step('Verify generated Discord message', async () => {
        await expect(applyForm.discordProofStep1Input).toHaveValue(
          discordMessage(address),
        );
      });

      await test.step('Copy Discord message', async () => {
        await applyForm.discordProofStep1CopyBtn.click();
        const clipboard = await widgetService.page.evaluate(() =>
          navigator.clipboard.readText(),
        );
        expect(clipboard).toBe(discordMessage(address));
      });
    },
  );

  test(
    qase(461, 'Should validate the Discord message link'),
    async ({ widgetService }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;

      await test.step('Invalid link shows an error', async () => {
        await applyForm.discordLinkInput.fill(
          'https://discord.com/channels/123/456',
        );
        await expect(applyForm.discordLinkError).toContainText(
          'Must be a valid Discord message URL',
        );
        await expect(applyForm.submitBtn).toBeDisabled();
      });

      await test.step('Valid link clears the error', async () => {
        await applyForm.discordLinkInput.fill(
          'https://discord.com/channels/123/456/789',
        );
        await expect(applyForm.discordLinkError).toBeHidden();
      });
    },
  );

  test(
    qase(462, 'Should accept optional Telegram username'),
    async ({ widgetService }) => {
      const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;

      await applyForm.telegramUsernameInput.fill('@operator_tg');
      await expect(applyForm.telegramUsernameInput).toHaveValue('@operator_tg');
    },
  );
});
