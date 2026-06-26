import { Locator, Page, expect } from '@playwright/test';

export class ClusterMemberPage {
  card: Locator;

  // Step 1 — address + message to sign
  step1: Locator;
  addressInput: Locator;
  messageToSignInput: Locator;
  copyMessageBtn: Locator;
  signBtn: Locator;

  // Step 2 — signature
  step2: Locator;
  signatureInput: Locator;
  verifySignatureBtn: Locator;
  verifyingIndicator: Locator;

  // Optional contacts
  discordHandleInput: Locator;
  telegramUsernameInput: Locator;

  // Verified state
  verifiedChip: Locator;
  unverifiedChip: Locator;
  clearBtn: Locator;

  // Errors
  addressError: Locator;
  signatureError: Locator;

  constructor(
    public page: Page,
    public index: number,
    public section: Locator,
  ) {
    this.card = section.getByTestId(`clusterMember-${index}`);

    // Step 1
    this.step1 = this.card.getByTestId('clusterMemberStep1');
    this.addressInput = this.card.locator(
      `input[name="clusterMembers.${index}.address"]`,
    );
    this.messageToSignInput = this.card.locator(
      `input[name="clusterMembers.${index}.messageToSign"]`,
    );
    this.copyMessageBtn = this.step1.getByTestId('copyBtn');
    this.signBtn = this.step1.getByTestId('signBtn');

    // Step 2
    this.step2 = this.card.getByTestId('clusterMemberStep2');
    this.signatureInput = this.card.locator(
      `input[name="clusterMembers.${index}.signature"]`,
    );
    this.verifySignatureBtn = this.card.getByTestId('verifySignatureBtn');
    this.verifyingIndicator = this.card.getByText('Verifying...');

    // Optional contacts
    this.discordHandleInput = this.card.locator(
      `input[name="clusterMembers.${index}.discordHandle"]`,
    );
    this.telegramUsernameInput = this.card.locator(
      `input[name="clusterMembers.${index}.telegramUsername"]`,
    );

    // Verified state
    this.verifiedChip = this.card.getByTestId('verifiedChip');
    this.unverifiedChip = this.card.getByTestId('unverifiedChip');
    this.clearBtn = this.card.getByTestId('clearBtn');

    // Errors — bound to their own input (the verified layout drops step1/step2,
    // but the disabled address input and its error stay), so scope by input.
    this.addressError = this.addressInput
      .locator('xpath=ancestor::label[1]')
      .getByTestId('inputMessageError');
    this.signatureError = this.signatureInput
      .locator('xpath=ancestor::label[1]')
      .getByTestId('inputMessageError');
  }

  async enterAddress(address: string) {
    await this.addressInput.fill(address);
    await expect(this.messageToSignInput).toHaveValue(
      new RegExp(address.toLowerCase()),
    );
  }
}
