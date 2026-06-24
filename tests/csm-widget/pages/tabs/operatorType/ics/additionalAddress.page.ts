import { Locator, Page } from '@playwright/test';

export class AdditionalAddressPage {
  // Common
  addressInfo: Locator;

  // Step 1
  addressField: Locator;

  // Step 2
  signMessageField: Locator;
  signMessageInput: Locator;
  copySignMessageBtn: Locator;
  signMessageBtn: Locator;

  // Step 3
  signatureField: Locator;
  signatureInput: Locator;
  verifySignatureBtn: Locator;

  // Verified
  verifyChip: Locator;
  verifiedAddressInput: Locator;

  constructor(
    public page: Page,
    public addressIndex: number,
    public section: Locator,
  ) {
    // Common
    this.addressInfo = section.getByTestId(
      `additionalAddressInfo-${addressIndex}`,
    );

    // Step 1
    this.addressField = this.section.getByTestId('additionalAddressStep1');

    // Step 2
    this.signMessageField = this.section.getByTestId('additionalAddressStep2');
    this.signMessageInput = this.signMessageField.locator(
      `xpath=//input[@name="additionalAddresses.${this.addressIndex}.messageToSign"]`,
    );
    this.copySignMessageBtn = this.signMessageField.getByTestId('copyBtn');
    this.signMessageBtn = this.signMessageField.getByTestId('signBtn');

    // Step 3
    this.signatureField = this.section.getByTestId('additionalAddressStep3');
    this.signatureInput = this.section.locator(
      `xpath=(//input[@name="additionalAddresses.${this.addressIndex}.signature"])`,
    );
    this.verifySignatureBtn = this.section.getByTestId('verifySignatureBtn');

    // Verified
    this.verifyChip = this.addressInfo.getByTestId('verifiedChip');
    this.verifiedAddressInput = this.addressInfo.locator(
      `xpath=(//input[@name="additionalAddresses.${addressIndex}.address"])`,
    );
  }
}
