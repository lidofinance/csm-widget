import {
  SDKError,
  decodeRevertData,
  type ContractErrorName,
  type DecodedRevert,
} from '@lidofinance/lido-csm-sdk';
import { trackMatomoError } from './track-matomo-event';

// Shared copy constants — two ABI names intentionally map to the same string;
// using a named const makes future copy edits atomic and the intent explicit.
const PROOF_INVALID_COPY =
  'Your eligibility proof is no longer valid. Please refresh the page and try again.';
const SAME_ADDRESS_COPY =
  'The new address must be different from the current one';

// Friendly, operator-facing copy for decodable contract custom errors, keyed by
// the SDK's `ContractErrorName` (derived from CONTRACT_BASE_ABI via abitype).
// Typed as Partial<Record<…>>: a typo or removed ABI error fails to compile,
// while intentionally-unmapped (admin/oracle-internal) errors fall back to the
// generic CONTRACT_ERROR copy. Single-sentence messages carry no trailing dot;
// multi-sentence messages do (CLAUDE.md copy rule).
export const CONTRACT_ERROR_MESSAGES: Partial<
  Record<ContractErrorName, string>
> = {
  // Keys
  InvalidSigningKey:
    'One or more validator keys are invalid. Please check the key format and signatures.',
  PubkeyMismatch:
    'A validator key does not match its signature. Please verify the uploaded keys.',
  KeysLimitExceeded:
    'You are adding too many keys at once. Please reduce the number and try again.',
  NotEnoughKeys: 'Not enough validator keys available for this action',
  CannotAddKeys: 'Adding keys is currently unavailable for this module',
  SigningKeysInvalidOffset:
    'The selected keys are out of range. Please refresh the page and try again.',
  UnexpectedExtraKey:
    'An unexpected extra key was found. Please refresh the page and try again.',

  // Priority / top-up queue (CSM)
  NotEligibleForPriorityQueue:
    'This operator is not eligible for the priority queue',
  TopUpQueueIsFull:
    'The priority queue is currently full. Please try again later.',
  TopUpQueueIsEmpty: 'There are no keys available to top up',
  TopUpQueueDisabled: 'The top-up queue is currently disabled',
  PriorityQueueAlreadyUsed:
    'This operator has already used its priority queue allocation',
  PriorityQueueMaxDepositsUsed:
    'The priority queue deposit limit has already been reached',
  QueueCannotBeUsed: 'This queue cannot be used for this operation',

  // Bond
  BondLockNotExpired:
    'Your bond is still locked. Please wait until the lock period expires.',
  NoBondLocked: 'No bond is currently locked for this operator',
  InvalidBondLockAmount: 'The bond amount is outside the allowed range',
  InvalidBondLockPeriod: 'The lock period is outside the allowed range',
  InvalidAmount: 'The amount is invalid. Please enter a valid value.',
  NothingToClaim: 'There is nothing available to claim right now',
  NotEnoughShares: 'Not enough shares available for this operation',
  NotAllowedToRecover: 'Recovering these assets is not allowed',

  // Gates (ICS / curated / vetted)
  AlreadyConsumed: 'You have already claimed through this gate',
  InvalidProof: PROOF_INVALID_COPY,
  MerkleProofInvalidMultiproof: PROOF_INVALID_COPY,
  NotAllowedToClaim: 'This address is not allowed to claim',
  SenderIsNotEligible: 'This address is not eligible for this action',

  // Roles & addresses
  InvalidRewardAddress:
    'The reward address is invalid. Please enter a valid Ethereum address.',
  InvalidManagerAddress:
    'The manager address is invalid. Please enter a valid Ethereum address.',
  SenderIsNotManagerAddress: 'Only the manager address can perform this action',
  SenderIsNotRewardAddress: 'Only the reward address can perform this action',
  SenderIsNotProposedAddress:
    'Only the proposed address can confirm this change',
  AlreadyProposed: 'This change has already been proposed',
  AddressCannotBeSame: SAME_ADDRESS_COPY,
  SameAddress: SAME_ADDRESS_COPY,
  AddressCannotBeZero: 'The address cannot be the zero address',
  NodeOperatorDoesNotExist: 'This node operator does not exist',
  OwnerEditsRestricted: 'Editing is restricted for this operator',

  // Exits & withdrawals
  AlreadyWithdrawn: 'This validator has already been withdrawn',
  NothingToEject: 'There is nothing to eject',
  NotEnoughStrikesToEject:
    'This validator does not have enough strikes to be ejected',
  ValidatorIsNotWithdrawable: 'This validator is not withdrawable yet',
  ValidatorIsWithdrawable: 'This validator is already withdrawable',
  ValidatorIsSlashed: 'This validator has been slashed',
  ValidatorIsNotSlashed: 'This validator has not been slashed',
  ValidatorExitDelayNotApplicable:
    'The exit delay does not apply to this validator',
  SlashingPenaltyIsNotApplicable: 'The slashing penalty does not apply here',
  PartialWithdrawal:
    'Only a partial withdrawal is available for this validator',

  // Access control & paused state
  AccessControlUnauthorizedAccount:
    'Your wallet does not have permission to perform this action',
  MethodCallIsNotAllowed: 'This action is not allowed in the current state',
  SenderNotAllowed: 'Your wallet is not allowed to perform this action',
  ResumedExpected: 'This action is currently paused. Please try again later.',

  // Curated Module
  NodeOperatorAlreadyInGroup: 'This node operator is already in a group',
  AlreadyUsedAsExternalOperator:
    'This address is already used as an external operator',
  OperatorNameTooLong: 'The operator name is too long',
  OperatorDescriptionTooLong: 'The operator description is too long',
  InvalidName: 'The name is invalid',
  InvalidOperatorGroup: 'The operator group is invalid',
};

// Decoded revert for an error: read it straight off an SDKError, else attempt
// to decode raw (unwrapped) errors with the SDK's own decoder. No string
// parsing — the SDK already did the abi decode.
export const getDecodedRevert = (error: unknown): DecodedRevert | undefined =>
  error instanceof SDKError ? error.decodedRevert : decodeRevertData(error);

// Friendly copy for a decoded contract error, or undefined when there is no
// decodable revert or the name is intentionally unmapped.
export const getContractErrorCopy = (error: unknown): string | undefined => {
  const decoded = getDecodedRevert(error);
  return decoded ? CONTRACT_ERROR_MESSAGES[decoded.name] : undefined;
};

// Drift telemetry: a real, decodable revert with no friendly copy yet. Surfaces
// the raw name to analytics so the dictionary can be extended (compile-time
// typing already prevents typos; this catches *new* operator-reachable errors).
export const trackUnmappedContractError = (error: unknown): void => {
  const decoded = getDecodedRevert(error);
  if (decoded && !(decoded.name in CONTRACT_ERROR_MESSAGES)) {
    trackMatomoError(decoded.name, 'UNMAPPED_CONTRACT_ERROR');
  }
};
