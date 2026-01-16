import { test } from '../../../test.fixture';
import { expect } from '@playwright/test';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { Wallet, utils } from 'ethers';
import { PAGE_WAIT_TIMEOUT } from 'tests/consts/timeouts';

const secretPhrase = generateMnemonic(english, 128);

test.use({ secretPhrase: secretPhrase });

test.describe('Operator with keys. ICS. Apply application. Addresses', async () => {
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

  test('Check main address appearance', async ({
    widgetService,
    secretPhrase,
  }) => {
    const applicationForm = widgetService.operatorType.applicationForm;

    await test.step('Verify texts', async () => {
      await expect(
        applicationForm.submitApplicationForm.mainAddressTitle,
      ).toContainText('Main address');
      await expect(
        applicationForm.submitApplicationForm.mainAddressSection,
      ).toContainText(
        'You are requesting ICS operator type to the following address:',
      );
    });

    await test.step('Verify main address input', async () => {
      const address = mnemonicToAccount(secretPhrase).address;
      await expect(
        applicationForm.submitApplicationForm.mainAddressInput,
      ).toHaveValue(address);
      await expect(
        applicationForm.submitApplicationForm.mainAddressLabel,
      ).toBeDisabled();
    });

    await test.step('Verify verified chip', async () => {
      await expect(
        applicationForm.submitApplicationForm.mainAddressVerifiedChip,
      ).toBeVisible();
      await expect(
        applicationForm.submitApplicationForm.mainAddressVerifiedChip,
      ).toContainText('Verified');
    });
  });

  test('Should add maximum 5 additional addresses', async ({
    widgetService,
  }) => {
    const applicationForm = widgetService.operatorType.applicationForm;

    await test.step('Verify section description', async () => {
      await expect(
        applicationForm.submitApplicationForm.additionalAddressesSection,
      ).toContainText(
        'You can add up to 5 addresses where your achievements are stored. To prove you own each address, sign a message on Etherscan. For more info see the guide',
      );
    });

    await test.step('Add 5 additional addresses', async () => {
      for (let i = 0; i < 5; i++) {
        await applicationForm.submitApplicationForm.addNewAddressBtn.click();
      }
    });

    await expect(
      applicationForm.submitApplicationForm.addNewAddressBtn,
    ).toBeHidden();
  });

  test('Check additional addresses appearance', async ({ widgetService }) => {
    const applicationForm = widgetService.operatorType.applicationForm;
    const additionalAddress = mnemonicToAccount(generateMnemonic(english, 128));

    const additionalAddressField0 =
      applicationForm.submitApplicationForm.getAdditionalAddressFieldByIndex(0);

    await test.step('Add new additional address', async () => {
      await applicationForm.submitApplicationForm.addNewAddressBtn.click();
      await expect(additionalAddressField0.addressField).toContainText(
        'Step 1. Insert your Ethereum address',
      );

      await applicationForm.submitApplicationForm.fillAdditionalAddress(
        0,
        additionalAddress.address,
      );
    });
    const address = mnemonicToAccount(secretPhrase).address;

    const expectedSignMessage = `Verify ownership of address ${additionalAddress.address.toLowerCase()} for ICS with main address ${address.toLowerCase()}`;
    await test.step('Verify autofill message to sign input', async () => {
      await expect(additionalAddressField0.signMessageField).toContainText(
        'Step 2. Copy the message and sign it on Etherscan (or other tool)',
      );

      await expect(additionalAddressField0.signMessageInput).toHaveValue(
        expectedSignMessage,
      );
    });

    await test.step('Verify signature input', async () => {
      const signature = await new Wallet(
        // @ts-expect-error may be null
        utils.hexlify(additionalAddress.getHdKey().privateKey),
      ).signMessage(expectedSignMessage);

      await additionalAddressField0.signatureInput.fill(signature);
      await expect(additionalAddressField0.signatureField).toContainText(
        'Step 3. Paste the signature in the field below',
      );

      await expect(additionalAddressField0.signMessageInput).toHaveValue(
        expectedSignMessage,
      );
    });
  });

  test('Should successfully verify signature', async ({
    widgetService,
    secretPhrase,
  }) => {
    const applicationForm = widgetService.operatorType.applicationForm;
    const additionalAddress = mnemonicToAccount(generateMnemonic(english, 128));

    const additionalAddressField0 =
      applicationForm.submitApplicationForm.getAdditionalAddressFieldByIndex(0);

    await test.step('Add new additional address', async () => {
      await applicationForm.submitApplicationForm.addNewAddressBtn.click();
      await applicationForm.submitApplicationForm.fillAdditionalAddress(
        0,
        additionalAddress.address,
      );
    });

    const address = mnemonicToAccount(secretPhrase).address;

    const signMessage = `Verify ownership of address ${additionalAddress.address.toLowerCase()} for ICS with main address ${address.toLowerCase()}`;

    await expect(additionalAddressField0.signMessageInput).toHaveValue(
      signMessage,
    );

    await test.step('Check verified state for address', async () => {
      const signature = await new Wallet(
        // @ts-expect-error may be null
        utils.hexlify(additionalAddress.getHdKey().privateKey),
      ).signMessage(signMessage);

      await additionalAddressField0.signatureInput.fill(signature);
      await additionalAddressField0.verifySignatureBtn.click();
      await expect(additionalAddressField0.verifyChip).toBeVisible();
      await expect(additionalAddressField0.verifiedAddressInput).toBeDisabled();
      await expect(additionalAddressField0.verifiedAddressInput).toHaveValue(
        additionalAddress.address,
      );
    });
  });

  test('Should copy message to sign after click to copy button', async ({
    widgetService,
  }) => {
    const applicationForm = widgetService.operatorType.applicationForm;
    const additionalAddress = mnemonicToAccount(
      generateMnemonic(english, 128),
    ).address;
    const additionalAddressField0 =
      applicationForm.submitApplicationForm.getAdditionalAddressFieldByIndex(0);

    await test.step('Add new additional address', async () => {
      await applicationForm.submitApplicationForm.addNewAddressBtn.click();

      await applicationForm.submitApplicationForm.fillAdditionalAddress(
        0,
        additionalAddress,
      );
    });

    await test.step('Verify copy button for sign message', async () => {
      const address = mnemonicToAccount(secretPhrase).address;
      const signMessage = `Verify ownership of address ${additionalAddress.toLowerCase()} for ICS with main address ${address.toLowerCase()}`;

      await expect(additionalAddressField0.signMessageInput).toHaveValue(
        signMessage,
      );
      await additionalAddressField0.copySignMessageBtn.click();

      const clipboardText = await widgetService.page.evaluate(() =>
        navigator.clipboard.readText(),
      );
      expect(clipboardText).toBe(signMessage);
    });
  });

  test('Should open sign link in a new tab', async ({ widgetService }) => {
    const applicationForm = widgetService.operatorType.applicationForm;
    const additionalAddress = mnemonicToAccount(
      generateMnemonic(english, 128),
    ).address;
    const additionalAddressField0 =
      applicationForm.submitApplicationForm.getAdditionalAddressFieldByIndex(0);

    await test.step('Add new additional address', async () => {
      await applicationForm.submitApplicationForm.addNewAddressBtn.click();

      await applicationForm.submitApplicationForm.fillAdditionalAddress(
        0,
        additionalAddress,
      );
    });

    await test.step('Verify sign link opening', async () => {
      const [etherscanPageForSign] = await Promise.all([
        widgetService.operatorType.waitForPage(PAGE_WAIT_TIMEOUT),
        additionalAddressField0.signMessageBtn.click(),
      ]);
      await expect(etherscanPageForSign).toHaveURL(
        'https://etherscan.io/verifiedSignatures#',
      );
      await etherscanPageForSign.close();
    });
  });
});
