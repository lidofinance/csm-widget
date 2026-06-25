import { Locator, Page } from '@playwright/test';
import { WalletPage } from '@lidofinance/wallets-testing-wallets';
import { BasePage } from '../../../../../shared/pages/base.page';
import { ClusterMemberPage } from './clusterMember.page';

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
  discordProofStep1Input: Locator;
  discordProofStep1CopyBtn: Locator;
  discordProofStep2: Locator;
  discordLinkInput: Locator;
  discordLinkError: Locator;
  telegramSection: Locator;
  telegramUsernameInput: Locator;

  // Cluster members section
  clusterMembersSection: Locator;
  clusterProgress: Locator;

  // Confirmations + submit
  confirmationsSection: Locator;
  confirmCheckbox: Locator;
  confirmCheckboxInput: Locator;
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
    this.discordProofStep1Input =
      this.discordProofStep1.locator('#discord-message');
    this.discordProofStep1CopyBtn =
      this.discordProofStep1.getByTestId('copyBtn');
    this.discordProofStep2 =
      this.discordSection.getByTestId('discordProofStep2');
    this.discordLinkInput = this.discordProofStep2.locator(
      'input[name="discordLink"]',
    );
    this.discordLinkError =
      this.discordProofStep2.getByTestId('inputMessageError');
    this.telegramSection =
      this.socialProofSection.getByTestId('telegramSection');
    this.telegramUsernameInput = this.telegramSection.locator(
      'input[name="telegramUsername"]',
    );

    // clusterMembersSection
    this.clusterMembersSection = this.form.getByTestId('clusterMembersSection');
    this.clusterProgress =
      this.clusterMembersSection.getByTestId('clusterProgress');

    // confirmations + submit
    this.confirmationsSection = this.form.getByTestId('confirmationsSection');
    this.confirmCheckbox = this.form.getByTestId('confirmCheckbox');
    this.confirmCheckboxInput = this.confirmCheckbox.getByRole('checkbox');
    this.submitBtn = this.form.getByTestId('submitBtn');
  }

  getClusterMember(index: number) {
    return new ClusterMemberPage(this.page, index, this.clusterMembersSection);
  }
}
