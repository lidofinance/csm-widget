import { test } from '../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { mnemonicToAccount } from 'viem/accounts';
import { Tags } from 'tests/shared/consts/common.const';

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

  test(
    qase(433, 'Should show apply form and save token when signed in'),
    { tag: [Tags.smoke] },
    async ({ widgetService, secretPhrase }) => {
      const { signInForm, applyForm } =
        widgetService.operatorType.dvtApplicationForm;
      await widgetService.operatorType.dvtApplicationForm.open();

      await signInForm.signIn();

      await test.step('Verify apply form sections are shown', async () => {
        await expect(applyForm.form).toBeVisible();
        await expect(applyForm.mainAddressSection).toBeVisible();
      });

      await test.step('Verify SIWE token saved to Session Storage', async () => {
        const address = mnemonicToAccount(secretPhrase).address;
        const siweToken = await signInForm.getSessionStorageData(
          `siwe-token-${address}`,
        );
        expect(siweToken).not.toBeNull();
      });
    },
  );

  test(
    qase(473, 'Should sign out when token removed from Session Storage'),
    async ({ widgetService, secretPhrase }) => {
      const { signInForm } = widgetService.operatorType.dvtApplicationForm;
      await widgetService.operatorType.dvtApplicationForm.open();

      await signInForm.signIn();

      const address = mnemonicToAccount(secretPhrase).address;
      await signInForm.removeKeyFromSessionStorage(`siwe-token-${address}`);

      await widgetService.page.reload();
      await expect(signInForm.form).toBeVisible();
    },
  );

  test(
    qase(474, 'Should show correct sign in form'),
    async ({ widgetService, secretPhrase }) => {
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
    },
  );

  test(
    qase(475, 'Should show error and stay signed out when sign in cancelled'),
    async ({ widgetService, secretPhrase }) => {
      const { signInForm } = widgetService.operatorType.dvtApplicationForm;
      const txModal = widgetService.operatorType.txModal;
      await widgetService.operatorType.dvtApplicationForm.open();

      await test.step('Reject the sign in message in the wallet', async () => {
        await signInForm.signInButton.click();
        await widgetService.page.waitForSelector(
          'text=Please sign the message',
        );
        await widgetService.walletPage.cancelTx();
      });

      await test.step('Sign in failed modal is shown', async () => {
        await expect(txModal.title).toContainText('Sign in failed');
        await expect(txModal.modalContent).toContainText(
          'User denied the transaction signature',
        );
      });

      await test.step('Stays on sign in form without a token', async () => {
        await txModal.closeModal();
        await expect(signInForm.form).toBeVisible();

        const address = mnemonicToAccount(secretPhrase).address;
        const siweToken = await signInForm.getSessionStorageData(
          `siwe-token-${address}`,
        );
        expect(siweToken).toBeNull();
      });
    },
  );
});
