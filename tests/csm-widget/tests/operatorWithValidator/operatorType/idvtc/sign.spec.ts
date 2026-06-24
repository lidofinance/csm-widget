import { test } from '../../../test.fixture';
import { expect } from '@playwright/test';
import { mnemonicToAccount } from 'viem/accounts';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

test.describe('Operator with keys. IDVTC. Sign in', async () => {
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

  test('Should show apply form and save token when signed in', async ({
    widgetService,
    secretPhrase,
  }) => {
    const { signInForm, applyForm } =
      widgetService.operatorType.dvtApplicationForm;
    await widgetService.operatorType.dvtApplicationForm.open();

    await signInForm.signIn();

    await test.step('Verify apply form sections are shown', async () => {
      await expect(applyForm.form).toBeVisible();
      await expect(applyForm.mainAddressSection).toBeVisible();
      await expect(applyForm.socialProofSection).toBeVisible();
      await expect(applyForm.clusterMembersSection).toBeVisible();
      await expect(applyForm.submitBtn).toBeVisible();
      await expect(applyForm.mainAddressInput).toHaveValue(
        mnemonicToAccount(secretPhrase).address,
      );
    });

    await test.step('Verify SIWE token saved to Session Storage', async () => {
      const address = mnemonicToAccount(secretPhrase).address;
      const siweToken = await signInForm.getSessionStorageData(
        `siwe-token-${address}`,
      );
      expect(siweToken).not.toBeNull();
    });
  });

  test('Should sign out when token removed from Session Storage', async ({
    widgetService,
    secretPhrase,
  }) => {
    const { signInForm } = widgetService.operatorType.dvtApplicationForm;
    await widgetService.operatorType.dvtApplicationForm.open();

    await signInForm.signIn();

    const address = mnemonicToAccount(secretPhrase).address;
    await signInForm.removeKeyFromSessionStorage(`siwe-token-${address}`);

    await widgetService.page.reload();
    await expect(signInForm.form).toBeVisible();
  });

  test('Should show correct sign in form', async ({
    widgetService,
    secretPhrase,
  }) => {
    const { signInForm } = widgetService.operatorType.dvtApplicationForm;
    await widgetService.operatorType.dvtApplicationForm.open();

    await test.step('Verify sign in form text', async () => {
      await expect(signInForm.form).toContainText('Sign in');
      await expect(signInForm.form).toContainText(
        'To continue, please sign a message with your connected address to prove ownership.',
      );
      await expect(signInForm.form).toContainText(
        'You are requesting IDVTC operator type for the following address:',
      );
    });

    await test.step('Verify sign in input', async () => {
      await expect(signInForm.mainAddressInput).toHaveValue(
        mnemonicToAccount(secretPhrase).address,
      );
    });
  });
});
