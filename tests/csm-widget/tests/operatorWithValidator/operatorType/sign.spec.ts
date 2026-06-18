import { test } from '../../test.fixture';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { mnemonicToAccount } from 'viem/accounts';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

test.describe('Operator with keys. ICS. Sign in', async () => {
  test.beforeAll(async ({ widgetService }) => {
    await widgetService.setFeatureFlag('icsApplyForm', true);
  });

  test.afterAll(async ({ widgetService }) => {
    await widgetService.setFeatureFlag('icsApplyForm', false);
  });

  test.afterEach(async ({ widgetService }) => {
    await widgetService.page.evaluate(() => {
      sessionStorage.clear();
    });
  });

  test(
    qase(360, 'Should make sign transaction and save data to Session Storage'),
    async ({ widgetService, secretPhrase }) => {
      const applicationForm = widgetService.operatorType.applicationForm;
      await applicationForm.open();
      await applicationForm.signInForm.signIn();

      await expect(
        widgetService.page.locator('text=Submit application'),
      ).toBeVisible();

      const address = mnemonicToAccount(secretPhrase).address;
      const icsToken = await applicationForm.signInForm.getSessionStorageData(
        `ics-token-${address}`,
      );

      expect(icsToken).not.toBeNull();
    },
  );

  test(
    qase(361, 'Should sign out after remove ICS token from Session Storage'),
    async ({ widgetService, secretPhrase }) => {
      const applicationForm = widgetService.operatorType.applicationForm;
      await applicationForm.open();

      await applicationForm.signInForm.signIn();

      const address = mnemonicToAccount(secretPhrase).address;
      await applicationForm.signInForm.removeKeyFromSessionStorage(
        `ics-token-${address}`,
      );

      await widgetService.page.reload();
      await expect(applicationForm.signInForm.form).toBeVisible();
    },
  );

  test(
    qase(362, 'Check sign in appearence'),
    async ({ widgetService, secretPhrase }) => {
      const applicationForm = widgetService.operatorType.applicationForm;
      await applicationForm.open();

      await test.step('Verify sign in form text', async () => {
        await expect(applicationForm.signInForm.form).toContainText('Sign in');
        await expect(applicationForm.signInForm.form).toContainText(
          'To continue, please sign a message with your connected address to prove ownership.',
        );
        await expect(applicationForm.signInForm.form).toContainText(
          'You are requesting ICS operator type for the following address:',
        );
      });

      await test.step('Verify sign in input', async () => {
        const mainAddressInput = applicationForm.signInForm.mainAddressInput;
        const address = mnemonicToAccount(secretPhrase).address;
        await expect(mainAddressInput).toHaveValue(address);
      });
    },
  );
});
