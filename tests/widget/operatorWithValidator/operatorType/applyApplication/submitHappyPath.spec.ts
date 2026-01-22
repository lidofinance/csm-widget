import { test } from '../../../test.fixture';
import { expect } from '@playwright/test';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { Tags } from 'tests/consts/common.const';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase: secretPhrase });

test.describe('Operator with keys. ICS. Apply application. Submit Happy Path', async () => {
  test.beforeAll(async ({ widgetService }) => {
    await widgetService.setFeatureFlag('icsApplyForm', true);

    const applicationForm = widgetService.operatorType.applicationForm;
    await applicationForm.open();

    await applicationForm.signInForm.signIn();
  });

  test.afterAll(async ({ widgetService }) => {
    await widgetService.setFeatureFlag('icsApplyForm', false);
  });

  test(
    'Should successfully verify signature with 1 additional addresses and socials',
    {
      tag: [Tags.smoke],
    },
    async ({ widgetService, secretPhrase }) => {
      const applicationForm = widgetService.operatorType.applicationForm;
      const additionalAddress = mnemonicToAccount(
        generateMnemonic(english, 128),
      );
      await applicationForm.submitApplicationForm.addAdditionalAddress(
        additionalAddress,
        mnemonicToAccount(secretPhrase).address,
      );

      await applicationForm.submitApplicationForm.addSocialsProof();

      await applicationForm.submitApplicationForm.submitBtn.click();
      await widgetService.operatorType.txModal.modal.waitFor({
        state: 'visible',
      });
      await expect(widgetService.operatorType.txModal.title).toContainText(
        'Your application has been submitted',
      );
      await expect(
        widgetService.operatorType.txModal.description,
      ).toContainText(
        'You can track your application’s status on the Operator Type tab.',
      );

      await widgetService.operatorType.txModal.closeModal();
      await applicationForm.applicationFormStatus.form.waitFor({
        state: 'visible',
      });
      await expect(
        applicationForm.applicationFormStatus.scoreChip,
      ).toBeVisible();
      await expect(
        applicationForm.applicationFormStatus.scoreChip,
      ).toContainText('Pending');
    },
  );
});
