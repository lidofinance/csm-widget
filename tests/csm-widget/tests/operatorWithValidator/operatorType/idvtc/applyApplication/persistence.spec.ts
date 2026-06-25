import { test } from '../../../../test.fixture';
import { expect } from '@playwright/test';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

test.describe('Operator with keys. IDVTC. Apply application. Persistence', async () => {
  test.beforeAll(async ({ widgetService }) => {
    await widgetService.setFeatureFlag('icsApplyForm', true);

    const { signInForm } = widgetService.operatorType.dvtApplicationForm;
    await widgetService.operatorType.dvtApplicationForm.open();
    await signInForm.signIn();
  });

  test.beforeEach(async ({ widgetService }) => {
    await test.step('Reset persisted form and reopen', async () => {
      await widgetService.operatorType.dvtApplicationForm.applyForm.clearPersisted();
      await widgetService.operatorType.dvtApplicationForm.open();
    });
  });

  test.afterAll(async ({ widgetService }) => {
    await test.step('Clear storage and disable flag', async () => {
      await widgetService.page.evaluate(() => sessionStorage.clear());
      await widgetService.setFeatureFlag('icsApplyForm', false);
    });
  });

  test('Should keep entered values after reload', async ({ widgetService }) => {
    const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;
    const member0 = applyForm.getClusterMember(0);
    const member1 = applyForm.getClusterMember(1);
    const address0 = mnemonicToAccount(generateMnemonic(english, 128)).address;
    const address1 = mnemonicToAccount(generateMnemonic(english, 128)).address;
    const discordLink = 'https://discord.com/channels/123/456/789';
    const telegram = '@operator_tg';

    await test.step('Fill several fields and confirm', async () => {
      await member0.addressInput.fill(address0);
      await member1.addressInput.fill(address1);
      await applyForm.discordLinkInput.fill(discordLink);
      await applyForm.telegramUsernameInput.fill(telegram);
      await applyForm.confirmCheckboxInput.check();
      await expect(applyForm.confirmCheckboxInput).toBeChecked();
    });

    await applyForm.waitForPersisted(telegram);
    await widgetService.page.reload();

    await test.step('Values are restored after reload', async () => {
      await expect(member0.addressInput).toHaveValue(address0);
      await expect(member1.addressInput).toHaveValue(address1);
      await expect(applyForm.discordLinkInput).toHaveValue(discordLink);
      await expect(applyForm.telegramUsernameInput).toHaveValue(telegram);
    });

    await test.step('Confirmation checkbox is not persisted', async () => {
      await expect(applyForm.confirmCheckboxInput).not.toBeChecked();
    });
  });

  test('Should keep the ICS error after reload for one member', async ({
    widgetService,
  }) => {
    const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;
    const member = applyForm.getClusterMember(0);
    const address = mnemonicToAccount(generateMnemonic(english, 128)).address;

    await test.step('Non-ICS address shows the error', async () => {
      await member.addressInput.fill(address);
      await expect(member.addressError).toContainText(
        'Address is not ICS-approved',
      );
    });

    await applyForm.waitForPersisted(address);
    await widgetService.page.reload();

    await test.step('Address and error are both restored', async () => {
      await expect(member.addressInput).toHaveValue(address);
      await expect(member.addressError).toContainText(
        'Address is not ICS-approved',
      );
    });
  });

  test('Should keep ICS errors after reload for multiple members', async ({
    widgetService,
  }) => {
    const applyForm = widgetService.operatorType.dvtApplicationForm.applyForm;
    const members = [0, 1, 2].map((i) => ({
      page: applyForm.getClusterMember(i),
      address: mnemonicToAccount(generateMnemonic(english, 128)).address,
    }));

    await test.step('Fill three non-ICS addresses', async () => {
      for (const { page, address } of members) {
        await page.addressInput.fill(address);
        await expect(page.addressError).toContainText(
          'Address is not ICS-approved',
        );
      }
    });

    await applyForm.waitForPersisted(members[members.length - 1].address);
    await widgetService.page.reload();

    await test.step('Every address and its error are restored', async () => {
      for (const { page, address } of members) {
        await expect(page.addressInput).toHaveValue(address);
        await expect(page.addressError).toContainText(
          'Address is not ICS-approved',
        );
      }
    });
  });
});
