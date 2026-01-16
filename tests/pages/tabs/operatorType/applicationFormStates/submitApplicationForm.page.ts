import { Locator, Page, test, expect } from '@playwright/test';
import {
  WalletConnectType,
  WalletPage,
} from '@lidofinance/wallets-testing-wallets';
import { BasePage } from 'tests/pages/base.page';
import { AdditionalAddressPage } from './additionalAddress.page';
import { Wallet, utils } from 'ethers';
import { HDAccount } from 'viem/accounts';

export class SubmitApplicationForm extends BasePage {
  form: Locator;

  mainAddressSection: Locator;
  mainAddressTitle: Locator;
  mainAddressInput: Locator;
  mainAddressLabel: Locator;
  mainAddressVerifiedChip: Locator;

  additionalAddressesSection: Locator;
  addNewAddressBtn: Locator;

  // Socials section
  socialProofSection: Locator;
  socialProofTitile: Locator;

  // Twitter section
  twitterSection: Locator;
  twitterProofStep1: Locator;
  twitterProofStep1Input: Locator;
  twitterProofStep1CopyBtn: Locator;
  twitterProofStep2: Locator;
  defaultTwitterMessageUrl = 'https://x.com/someuser/status/1234567890';

  // Discord section
  discordSection: Locator;
  discordProofStep1: Locator;
  discordProofStep1Input: Locator;
  discordProofStep1CopyBtn: Locator;
  discordProofStep2: Locator;
  defaultDiscordMessageUrl = 'https://discord.com/channels/123/456/789';

  // btn
  submitBtn: Locator;

  constructor(
    page: Page,
    public walletPage: WalletPage<WalletConnectType>,
  ) {
    super(page);
    this.form = page.getByTestId('applyForm');

    this.mainAddressSection = this.form.getByTestId('mainAddressSection');
    this.mainAddressTitle = this.mainAddressSection.getByTestId('formTitle');
    this.mainAddressInput = this.mainAddressSection.locator(
      'input[name="mainAddress"]',
    );
    this.mainAddressLabel = this.mainAddressSection.locator(
      'xpath=//input[@name="mainAddress"]/ancestor::label',
    );
    this.mainAddressVerifiedChip =
      this.mainAddressSection.getByTestId('verifiedChip');

    this.additionalAddressesSection = this.form.getByTestId(
      'additionalAddressesSection',
    );
    this.addNewAddressBtn =
      this.additionalAddressesSection.getByTestId('addNewAddressBtn');

    // socialsSection
    this.socialProofSection = this.form.getByTestId('socialProofSection');
    this.socialProofTitile = this.socialProofSection.getByTestId('formTitle');

    // twitterSection
    this.twitterSection = this.socialProofSection.getByTestId('twitterSection');
    this.twitterProofStep1 =
      this.twitterSection.getByTestId('twitterProofStep1');
    this.twitterProofStep1Input =
      this.twitterProofStep1.locator('#twitter-message');
    this.twitterProofStep1CopyBtn =
      this.twitterProofStep1.getByTestId('copyBtn');
    this.twitterProofStep2 =
      this.twitterSection.getByTestId('twitterProofStep2');

    // discordSection
    this.discordSection = this.socialProofSection.getByTestId('discordSection');
    this.discordProofStep1 =
      this.discordSection.getByTestId('discordProofStep1');
    this.discordProofStep1Input =
      this.discordProofStep1.locator('#discord-message');
    this.discordProofStep1CopyBtn =
      this.discordProofStep1.getByTestId('copyBtn');
    this.discordProofStep2 =
      this.discordSection.getByTestId('discordProofStep2');

    // btn
    this.submitBtn = this.form.getByRole('button', {
      name: 'Submit application',
    });
  }

  getAdditionalAddressFieldByIndex(index: number) {
    return new AdditionalAddressPage(
      this.page,
      index,
      this.additionalAddressesSection,
    );
  }

  async fillAdditionalAddress(index: number, address: string) {
    const addressInput = this.additionalAddressesSection.locator(
      `xpath=(//input[@name="additionalAddresses.${index}.address"])`,
    );

    await addressInput.fill(address);
  }

  async addAdditionalAddress(account: HDAccount, mainAddress: `0x${string}`) {
    await this.addNewAddressBtn.click();
    const lastAdditionalAddressIndex = this.additionalAddressesSection.locator(
      '[data-testid*="additionalAddressInfo"]',
    );
    const count = await lastAdditionalAddressIndex.count();
    const lastIndex = count - 1;
    await this.fillAdditionalAddress(lastIndex, account.address);

    await test.step('Check verified state for address', async () => {
      const signMessage = `Verify ownership of address ${account.address.toLowerCase()} for ICS with main address ${mainAddress.toLowerCase()}`;
      const signature = await new Wallet(
        // @ts-expect-error may be null
        utils.hexlify(account.getHdKey().privateKey),
      ).signMessage(signMessage);

      const addressField = this.getAdditionalAddressFieldByIndex(lastIndex);

      await addressField.signatureInput.fill(signature);
      await expect(addressField.signMessageInput).toHaveValue(signMessage);
      await addressField.verifySignatureBtn.click();
      await expect(addressField.verifyChip).toBeVisible();
    });
  }

  async addSocialsProof() {
    await test.step('Fill Twitter proof', async () => {
      await this.twitterProofStep2
        .locator('input')
        .fill(this.defaultTwitterMessageUrl);
    });

    await test.step('Fill Discord proof', async () => {
      await this.discordProofStep2
        .locator('input')
        .fill(this.defaultDiscordMessageUrl);
    });
  }
}
