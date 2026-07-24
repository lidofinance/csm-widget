import { VALIDATION_MESSAGES, validationMessage } from './messages';

describe('VALIDATION_MESSAGES static strings', () => {
  it('single-sentence messages have no trailing dot', () => {
    const singleSentenceKeys: (keyof typeof VALIDATION_MESSAGES)[] = [
      'invalidDepositData',
      'invalidAddress',
      'hexMustStartWith0x',
      'hexNotHexadecimal',
      'shareGreaterThanZero',
      'shareNotExceed100',
      'invalidId',
      'confirmKeysReady',
      'specifyValidRewardsAddress',
      'specifyValidManagerAddress',
      'selectOperatorType',
      'invalidOperatorType',
      'operatorTypePaused',
      'operatorTypeAlreadyUsed',
      'notEligibleForOperatorType',
      'enterAmountGreaterThanZero',
      'amountNotValid',
      'enterPenaltyTypeGreaterThanZero',
      'specifyValidAddress',
      'notSameAsCurrentClaimer',
      'notSameAsCurrentAddress',
      'notSameAsProposedAddress',
      'noChangesAdditionalAddresses',
      'exceededTotalShare',
      'duplicateAddress',
      'noKeysSelected',
      'proofNotProvided',
      'claimAlreadyConsumed',
      'onlyOwnerCanClaimType',
      'icsPaused',
      'idvtcPaused',
      'pleaseSelectInvite',
      'noChangesDetected',
      'editsRestricted',
      'addressNotIcsApproved',
      'duplicateAddressesNotAllowed',
      'invalidSignatureForAddress',
      'discordLinkRequired',
      'mustBeValidDiscordUrl',
      'mustConfirmApplication',
      'additionalAddressCannotBeMain',
      'mustBeValidTwitterUrl',
      'stakeLimitEthDeposits',
    ];

    for (const key of singleSentenceKeys) {
      const msg = VALIDATION_MESSAGES[key];
      // eslint-disable-next-line jest/no-conditional-expect
      expect(msg.endsWith('.')).toBe(false);
    }
  });
});

describe('validationMessage builders', () => {
  it('tooManyKeys: single sentence with no trailing dot, contains limit', () => {
    const msg = validationMessage.tooManyKeys(25);
    expect(msg).toContain('25');
    expect(msg.endsWith('.')).toBe(false);
  });

  it('addKeysLimitReached: contains keys limit, two sentences with trailing dot', () => {
    const msg = validationMessage.addKeysLimitReached(10);
    expect(msg).toContain('10');
    expect(msg.endsWith('.')).toBe(true);
  });

  it('addKeysLimitExceeded: contains keys limit and available slots', () => {
    const msg = validationMessage.addKeysLimitExceeded(10, 3);
    expect(msg).toContain('10');
    expect(msg).toContain('3');
    expect(msg.endsWith('.')).toBe(true);
  });

  it('submitKeysLimitExceeded: contains keys limit with trailing dot', () => {
    const msg = validationMessage.submitKeysLimitExceeded(10);
    expect(msg).toContain('10');
    expect(msg.endsWith('.')).toBe(true);
  });

  it('maxNodeOperatorId: contains max value', () => {
    const msg = validationMessage.maxNodeOperatorId(99n);
    expect(msg).toContain('99');
  });

  it('tooShort: contains minLength', () => {
    const msg = validationMessage.tooShort(3);
    expect(msg).toContain('3');
  });

  it('tooLong: contains maxLength', () => {
    const msg = validationMessage.tooLong(256);
    expect(msg).toContain('256');
  });

  it('notEnoughBalance: contains token name', () => {
    const msg = validationMessage.notEnoughBalance('stETH');
    expect(msg).toContain('stETH');
  });

  it('enterAmount: contains token and field', () => {
    const msg = validationMessage.enterAmount('stETH', 'amount');
    expect(msg).toContain('stETH');
    expect(msg).toContain('amount');
  });

  it('enterAmountGreaterThanZero: contains token and field', () => {
    const msg = validationMessage.enterAmountGreaterThanZero('ETH', 'amount');
    expect(msg).toContain('ETH');
    expect(msg).toContain('amount');
    expect(msg).toContain('0');
  });

  it('enterAmountGreaterThan100Wei: contains token and field', () => {
    const msg = validationMessage.enterAmountGreaterThan100Wei('ETH', 'amount');
    expect(msg).toContain('ETH');
    expect(msg).toContain('100 wei');
  });

  it('amountIsNotValid: contains token and field', () => {
    const msg = validationMessage.amountIsNotValid('stETH', 'amount');
    expect(msg).toContain('stETH');
    expect(msg).toContain('amount');
  });

  it('maxAdditionalAddressesDynamic: contains count', () => {
    const msg = validationMessage.maxAdditionalAddressesDynamic(5);
    expect(msg).toContain('5');
  });
});
