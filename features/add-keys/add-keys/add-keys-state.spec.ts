import {
  getBondDeltaRow,
  getKeysConfirmItems,
  getKeysLimitState,
} from './add-keys-state';

describe('getKeysLimitState', () => {
  it('is undefined while the limit or the keys count is unknown', () => {
    expect(getKeysLimitState({ keysLimit: 10 })).toBeUndefined();
    expect(getKeysLimitState({ nonWithdrawnKeys: 3 })).toBeUndefined();
    expect(getKeysLimitState({})).toBeUndefined();
  });

  it('is undefined while a full upload still fits', () => {
    expect(
      getKeysLimitState({ keysLimit: 100, nonWithdrawnKeys: 25 }),
    ).toBeUndefined();
  });

  it('warns once fewer keys than a full upload are left', () => {
    expect(getKeysLimitState({ keysLimit: 100, nonWithdrawnKeys: 26 })).toEqual(
      {
        gap: 74,
        reached: false,
        message:
          'Approaching the keys limit. Only 74 more keys can be uploaded.',
      },
    );
  });

  it('uses the singular for one key left', () => {
    expect(
      getKeysLimitState({ keysLimit: 10, nonWithdrawnKeys: 9 })?.message,
    ).toBe('Approaching the keys limit. Only 1 more key can be uploaded.');
  });

  it('is reached at the limit', () => {
    expect(getKeysLimitState({ keysLimit: 10, nonWithdrawnKeys: 10 })).toEqual({
      gap: 0,
      reached: true,
      message:
        "Keys limit reached. New keys can't be uploaded until some of the current keys are withdrawn.",
    });
  });

  it('is reached past the limit', () => {
    expect(
      getKeysLimitState({ keysLimit: 10, nonWithdrawnKeys: 12 })?.reached,
    ).toBe(true);
  });
});

describe('getBondDeltaRow', () => {
  it('is undefined without a bond or with a zero delta', () => {
    expect(getBondDeltaRow()).toBeUndefined();
    expect(
      getBondDeltaRow({ delta: 0n, isInsufficient: true }),
    ).toBeUndefined();
  });

  it('describes an insufficient bond', () => {
    expect(getBondDeltaRow({ delta: 5n, isInsufficient: true })).toEqual({
      insufficient: true,
      label: 'Insufficient Bond',
      hint: 'Will be added to the transaction amount',
      amount: 5n,
    });
  });

  it('describes an excess bond', () => {
    expect(getBondDeltaRow({ delta: 7n, isInsufficient: false })).toEqual({
      insufficient: false,
      label: 'Excess Bond',
      hint: 'Will be subtracted from the transaction amount',
      amount: 7n,
    });
  });
});

describe('getKeysConfirmItems', () => {
  it('lists the two default items, comma-separated, no trailing dot', () => {
    expect(getKeysConfirmItems({ approaching: false, reached: false })).toEqual(
      [
        'My nodes are synced, running, and ready for the validator activation,',
        'I understand that deleting keys from the deposit queue will incur a removal fee',
      ],
    );
  });

  it('adds the approaching share limit item before the removal fee', () => {
    expect(getKeysConfirmItems({ approaching: true, reached: false })).toEqual([
      'My nodes are synced, running, and ready for the validator activation,',
      'I understand that the deposit time for my keys can be months or longer because CSM is approaching its stake share limit,',
      'I understand that deleting keys from the deposit queue will incur a removal fee',
    ]);
  });

  it('adds the reached share limit item before the removal fee', () => {
    expect(getKeysConfirmItems({ approaching: false, reached: true })).toEqual([
      'My nodes are synced, running, and ready for the validator activation,',
      'I understand that my newly uploaded keys are very unlikely to receive deposits in the near future because CSM has reached its stake share limit,',
      'I understand that deleting keys from the deposit queue will incur a removal fee',
    ]);
  });
});
