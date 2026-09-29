import { matchesInvalidationScope } from './match-invalidation-scope';

describe('matchesInvalidationScope', () => {
  it('ignores non-object key parts', () => {
    const queryKey = ['node-operators', null, 'x', 42];
    expect(matchesInvalidationScope(queryKey, 'operator')).toBe(false);
    expect(matchesInvalidationScope(queryKey, 'address')).toBe(false);
    expect(matchesInvalidationScope(queryKey, 'operatorAndAddress')).toBe(
      false,
    );
  });

  it('returns false for an empty key', () => {
    expect(matchesInvalidationScope([], 'operatorAndAddress')).toBe(false);
  });

  describe('scope operator', () => {
    it('matches a part with nodeOperatorId', () => {
      expect(
        matchesInvalidationScope([{ nodeOperatorId: 1n }], 'operator'),
      ).toBe(true);
    });

    it('matches a part with operator', () => {
      expect(matchesInvalidationScope([{ operator: {} }], 'operator')).toBe(
        true,
      );
    });

    it('does not match a part with address', () => {
      expect(matchesInvalidationScope([{ address: '0x1' }], 'operator')).toBe(
        false,
      );
    });
  });

  describe('scope address', () => {
    it('matches a part with address', () => {
      expect(matchesInvalidationScope([{ address: '0x1' }], 'address')).toBe(
        true,
      );
    });

    it('does not match a part with nodeOperatorId', () => {
      expect(
        matchesInvalidationScope([{ nodeOperatorId: 1n }], 'address'),
      ).toBe(false);
    });
  });

  describe('scope operatorAndAddress', () => {
    it('matches a part with nodeOperatorId', () => {
      expect(
        matchesInvalidationScope(
          [{ nodeOperatorId: 1n }],
          'operatorAndAddress',
        ),
      ).toBe(true);
    });

    it('matches a part with operator', () => {
      expect(
        matchesInvalidationScope([{ operator: {} }], 'operatorAndAddress'),
      ).toBe(true);
    });

    it('matches a part with address', () => {
      expect(
        matchesInvalidationScope([{ address: '0x1' }], 'operatorAndAddress'),
      ).toBe(true);
    });

    it('matches the discovery key shape that the address gap missed', () => {
      const queryKey = ['node-operators', { address: '0x1234' }];
      expect(matchesInvalidationScope(queryKey, 'operatorAndAddress')).toBe(
        true,
      );
    });
  });

  it('matches all scopes for a part combining address and nodeOperatorId', () => {
    const queryKey = [{ address: '0x1', nodeOperatorId: 1n }];
    expect(matchesInvalidationScope(queryKey, 'operator')).toBe(true);
    expect(matchesInvalidationScope(queryKey, 'address')).toBe(true);
    expect(matchesInvalidationScope(queryKey, 'operatorAndAddress')).toBe(true);
  });
});
