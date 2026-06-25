import { Locator, Page } from '@playwright/test';

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

    // Errors
    this.addressError = this.step1.getByTestId('inputMessageError');
    this.signatureError = this.step2.getByTestId('inputMessageError');
  }
}
