import {
  CURATED_OPERATOR_STEP_LABELS,
  CURATED_OPERATOR_STEPS,
  getGateCardTestId,
  getStepHeading,
  isRepeatClick,
  isStepComplete,
} from './curated-operator-wizard';

describe('CURATED_OPERATOR_STEPS', () => {
  it('orders type, addresses, name, confirm with the Figma labels', () => {
    expect(CURATED_OPERATOR_STEP_LABELS).toEqual([
      'Choose type',
      'Specify addresses',
      'Set name',
      'Create Node Operator',
    ]);
  });

  it('validates only the fields of each step', () => {
    expect(CURATED_OPERATOR_STEPS.map(({ fields }) => fields)).toEqual([
      ['gateName'],
      ['managerAddress', 'rewardAddress'],
      ['name', 'description'],
      [],
    ]);
  });
});

describe('getStepHeading', () => {
  it('keeps the e2e-pinned copy per step', () => {
    expect(getStepHeading(0)).toEqual({
      title: 'Select Sub-Node Operator Type',
      description:
        'Choose the type you want to create now. You can create additional Sub-Node Operators with other types later',
    });
    expect(getStepHeading(1)).toEqual({
      title: 'Specify addresses',
      description:
        'Manager Address will have the ultimate control over the Node Operator, while Rewards Address is mainly used to receive rewards',
      note: 'Rewards Address cannot reset the Manager Address. Manager Address can change the Rewards Address.',
    });
    expect(getStepHeading(2)).toEqual({
      title: 'Set Node Operator name and description',
    });
    expect(getStepHeading(3)).toEqual({
      title: 'Confirm Node Operator creation',
    });
  });

  it('falls back to the first step out of range', () => {
    expect(getStepHeading(9)).toBe(getStepHeading(0));
  });
});

describe('isStepComplete', () => {
  it.each<[string, unknown[], boolean, boolean]>([
    ['a step without fields', [], false, true],
    ['all fields filled', ['0xabc', '0xdef'], false, true],
    ['an undefined field', ['0xabc', undefined], false, false],
    ['an empty string field', ['name', ''], false, false],
    ['filled fields with an error', ['0xabc', '0xdef'], true, false],
  ])('%s', (_name, values, hasError, expected) => {
    expect(isStepComplete(values, hasError)).toBe(expected);
  });
});

describe('getGateCardTestId', () => {
  it('replaces + with Plus', () => {
    expect(getGateCardTestId('PTO')).toBe('gateCardPTO');
    expect(getGateCardTestId('IODC+')).toBe('gateCardIODCPlus');
  });
});

describe('isRepeatClick', () => {
  it.each<[string, number, boolean]>([
    ['a single click', 1, false],
    ['the second click of a double-click', 2, true],
  ])('%s', (_name, detail, expected) => {
    expect(isRepeatClick(detail)).toBe(expected);
  });
});
