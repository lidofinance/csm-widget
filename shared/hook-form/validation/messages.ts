// Single source of truth for client-side form validation copy.
// CLAUDE.md copy rule: a single sentence carries NO trailing dot; two or more
// sentences do. Dynamic messages are builders so callers never concatenate copy
// inline. Punctuation notes are listed inline for multi-sentence messages.

import { pluralKeys } from 'utils/plural';

// Static validation copy — single-sentence messages, no trailing dot.
export const VALIDATION_MESSAGES = {
  // Deposit data
  invalidDepositData: 'Invalid deposit data',

  // Address / hex
  invalidAddress: 'Enter a valid Ethereum address',
  hexMustStartWith0x: 'Should start with "0x"',
  hexNotHexadecimal: 'Is not hexadecimal string',

  // Percent share
  shareGreaterThanZero: 'Share must be greater than 0',
  shareNotExceed100: 'Share must not exceed 100%',

  // Node operator ID
  invalidId: 'Invalid ID',

  // Keys
  confirmKeysReady: 'Please confirm that the keys are ready',
  noKeysSelected: 'No keys selected',

  // Address fields (submit-keys form)
  specifyValidRewardsAddress: 'Specify a valid Rewards Address',
  specifyValidManagerAddress: 'Specify a valid Manager Address',

  // Curated operator type
  selectOperatorType: 'Please select Operator Type',
  invalidOperatorType: 'Invalid Operator Type selected',
  operatorTypePaused: 'This Operator Type is currently paused',
  operatorTypeAlreadyUsed: 'You have already used this Operator Type',
  notEligibleForOperatorType: 'You are not eligible for this Operator Type',

  // Penalty report amounts
  enterAmountGreaterThanZero: 'Enter amount greater than 0',
  amountNotValid: 'Amount is not valid',
  enterPenaltyTypeGreaterThanZero: 'Enter penalty type greater than 0',

  // Address change forms
  specifyValidAddress: 'Specify a valid address',
  notSameAsCurrentClaimer: 'Should not be same as current claimer',
  notSameAsCurrentAddress: 'Should not be same as current address',
  notSameAsProposedAddress: 'Should not be same as proposed address',

  // Fee splits
  noChangesAdditionalAddresses:
    'No changes were made to the additional addresses',
  exceededTotalShare: "You've exceeded 100% of the total share",
  duplicateAddress: 'Duplicate address',

  // Claim type
  proofNotProvided: 'Proof is not provided',
  claimAlreadyConsumed: 'Claim has already been consumed',
  onlyOwnerCanClaimType: 'Only owner can claim type',
  icsPaused: 'ICS is paused',
  idvtcPaused: 'IDVTC is paused',

  // Accept invite
  pleaseSelectInvite: 'Please select an invite',

  // Metadata
  noChangesDetected: 'No changes detected',
  editsRestricted: 'Edits are restricted',

  // ICS proof
  addressNotIcsApproved: 'Address is not ICS-approved',

  // Apply forms (ICS / DVT)
  duplicateAddressesNotAllowed: 'Duplicate addresses are not allowed',
  invalidSignatureForAddress: 'Invalid signature for this address and message',
  discordLinkRequired: 'Discord message link is required',
  mustBeValidDiscordUrl: 'Must be a valid Discord message URL',
  mustConfirmApplication: 'You must confirm the application',
  additionalAddressCannotBeMain:
    'Additional address cannot be the same as main address',
  mustBeValidTwitterUrl: 'Must be a valid Twitter/X status URL',

  // Bond — stake limit for ETH (single long sentence, no dot)
  stakeLimitEthDeposits:
    'Lido protocol has reached its stake limit for ETH deposits — use another token or try later',
} as const;

// Dynamic validation message builders — used when copy depends on a runtime value.
// All produce single sentences; no trailing dot unless explicitly stated.
export const validationMessage = {
  // was: 'Too many keys in one transaction. Maximum allowed: N.' — two-sentence dot violation
  tooManyKeys: (limit: number): string =>
    `Too many keys in one transaction, maximum allowed: ${limit}`,

  // Add-keys flow: operator's non-withdrawn keys would exceed the limit.
  // Two sentences → trailing dot per CLAUDE.md.
  addKeysLimitReached: (keysLimit: number): string =>
    `Keys limit of ${keysLimit} non-withdrawn ${pluralKeys({
      value: keysLimit,
    })} reached. New keys can't be uploaded.`,
  addKeysLimitExceeded: (keysLimit: number, availableSlots: number): string =>
    `Keys limit of ${keysLimit} non-withdrawn ${pluralKeys({
      value: keysLimit,
    })} exceeded. Only ${availableSlots} more ${pluralKeys({
      value: availableSlots,
    })} can be uploaded.`,
  // Submit-keys flow: the new keys count alone exceeds the limit.
  submitKeysLimitExceeded: (keysLimit: number): string =>
    `Keys limit exceeded. Up to ${pluralKeys({
      value: keysLimit,
      showValue: true,
    })} can be uploaded.`,

  // Node operator ID max
  maxNodeOperatorId: (max: bigint): string => `Max Node Operator ID is ${max}`,

  // String length
  tooShort: (min: number): string => `Is too short, minimum is ${min}`,
  tooLong: (max: number): string => `Is too long, maximum is ${max}`,

  // Token balance
  notEnoughBalance: (token: string): string => `Not enough balance of ${token}`,

  // Ether amount validation
  enterAmount: (token: string, field: string): string =>
    `Enter ${token} ${field}`,
  enterAmountGreaterThanZero: (token: string, field: string): string =>
    `Enter ${token} ${field} greater than 0`,
  enterAmountGreaterThan100Wei: (token: string, field: string): string =>
    `Enter ${token} ${field} greater than 100 wei`,
  amountIsNotValid: (token: string, field: string): string =>
    `${token} ${field} is not valid`,

  // Splits: max additional addresses (dynamic count)
  maxAdditionalAddressesDynamic: (max: number): string =>
    `Maximum ${max} additional addresses`,
} as const;
