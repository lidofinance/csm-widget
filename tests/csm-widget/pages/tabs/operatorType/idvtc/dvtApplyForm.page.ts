import { Locator, Page } from '@playwright/test';
import { WalletPage } from '@lidofinance/wallets-testing-wallets';
import { BasePage } from '../../../../../shared/pages/base.page';

export class DvtApplyForm extends BasePage {
  form: Locator;

  // Main address section
  mainAddressSection: Locator;
  mainAddressInput: Locator;
  mainAddressLabel: Locator;

  // Socials section
  socialProofSection: Locator;
  discordSection: Locator;
  discordProofStep1: Locator;
  discordProofStep2: Locator;
  discordLinkInput: Locator;
  telegramSection: Locator;

  // Cluster members section
  clusterMembersSection: Locator;

  // Confirmations + submit
  confirmCheckbox: Locator;
  submitBtn: Locator;

  constructor(
    page: Page,
    public walletPage: WalletPage,
  ) {
    super(page);
    this.form = page.getByTestId('applyForm');

    // mainAddressSection
    this.mainAddressSection = this.form.getByTestId('mainAddressSection');
    this.mainAddressInput = this.mainAddressSection.locator(
      'input[name="mainAddress"]',
    );
    this.mainAddressLabel = this.mainAddressSection.locator(
      'xpath=//input[@name="mainAddress"]/ancestor::label',
    );

    // socialProofSection
    this.socialProofSection = this.form.getByTestId('socialProofSection');
    this.discordSection = this.socialProofSection.getByTestId('discordSection');
    this.discordProofStep1 =
      this.discordSection.getByTestId('discordProofStep1');
    this.discordProofStep2 =
      this.discordSection.getByTestId('discordProofStep2');
    this.discordLinkInput = this.discordProofStep2.locator('input');
    this.telegramSection =
      this.socialProofSection.getByTestId('telegramSection');

    // clusterMembersSection
    this.clusterMembersSection = this.form.getByTestId('clusterMembersSection');

    // confirmations + submit
    this.confirmCheckbox = this.form.getByTestId('confirmCheckbox');
    this.submitBtn = this.form.getByTestId('submitBtn');
  }

  getClusterMemberByIndex(index: number) {
    return this.clusterMembersSection.getByTestId(`clusterMember-${index}`);
  }
}
