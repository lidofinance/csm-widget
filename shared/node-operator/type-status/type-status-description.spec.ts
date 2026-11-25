import { getTypeStatusDescription } from './type-status-description';

describe('getTypeStatusDescription', () => {
  it('describes claimed type without trailing dot', () => {
    expect(getTypeStatusDescription('ICS', 'CLAIMED', true)).toBe(
      'Your Node Operator already has ICS type',
    );
  });

  it('ends multi-sentence copy with a dot', () => {
    expect(getTypeStatusDescription('IDVTC', 'ISSUED_NOT_OWNER', true)).toMatch(
      /owner\.$/,
    );
  });

  it('describes issued type by operator presence', () => {
    expect(getTypeStatusDescription('ICS', 'ISSUED', true)).toMatch(/^Claim/);
    expect(getTypeStatusDescription('ICS', 'ISSUED', false)).toMatch(
      /^Create a new Node Operator/,
    );
  });

  it('has no description for pending status', () => {
    expect(getTypeStatusDescription('ICS', 'PENDING', true)).toBeUndefined();
  });
});
