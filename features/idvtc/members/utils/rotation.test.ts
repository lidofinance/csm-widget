import {
  buildRotationBody,
  countChangedSlots,
  validateInitDraft,
  validateRotationDraft,
  SlotDraft,
} from './rotation';

const base = (over: Partial<SlotDraft> = {}): SlotDraft => ({
  changed: false,
  newAddress: '',
  signature: '',
  verified: false,
  ...over,
});

describe('rotation draft logic', () => {
  const active = [
    '0x1111111111111111111111111111111111111111',
    '0x2222222222222222222222222222222222222222',
    '0x3333333333333333333333333333333333333333',
    '0x4444444444444444444444444444444444444444',
  ];

  it('counts only changed slots', () => {
    expect(
      countChangedSlots([
        base(),
        base({ changed: true }),
        base(),
        base({ changed: true }),
      ]),
    ).toBe(2);
  });

  it('builds a body with only changed slots populated', () => {
    const body = buildRotationBody([
      base(),
      base({
        changed: true,
        newAddress: '0xaaa0000000000000000000000000000000000001',
        signature: '0xsig',
        discordHandle: 'd',
      }),
      base(),
      base(),
    ]);
    expect(body.slot1).toBeUndefined();
    expect(body.slot2).toEqual({
      newAddress: '0xaaa0000000000000000000000000000000000001',
      signature: '0xsig',
      discordHandle: 'd',
    });
  });

  it('rejects when no slot changed', () => {
    expect(
      validateRotationDraft([base(), base(), base(), base()], active),
    ).toBe('NO_SLOTS');
  });

  it('rejects duplicate proposed addresses', () => {
    const dup = '0xaaa0000000000000000000000000000000000001';
    expect(
      validateRotationDraft(
        [
          base({ changed: true, newAddress: dup, verified: true }),
          base({ changed: true, newAddress: dup, verified: true }),
          base(),
          base(),
        ],
        active,
      ),
    ).toBe('DUPLICATE_ADDRESS');
  });

  it('rejects a proposed address equal to an unchanged active slot', () => {
    expect(
      validateRotationDraft(
        [
          base({ changed: true, newAddress: active[1], verified: true }),
          base(),
          base(),
          base(),
        ],
        active,
      ),
    ).toBe('ALREADY_ACTIVE');
  });

  it('rejects unverified changed slots', () => {
    expect(
      validateRotationDraft(
        [
          base({
            changed: true,
            newAddress: '0xaaa0000000000000000000000000000000000001',
            verified: false,
          }),
          base(),
          base(),
          base(),
        ],
        active,
      ),
    ).toBe('UNVERIFIED');
  });

  it('passes a valid single-slot change', () => {
    expect(
      validateRotationDraft(
        [
          base({
            changed: true,
            newAddress: '0xaaa0000000000000000000000000000000000001',
            signature: '0xsig',
            verified: true,
          }),
          base(),
          base(),
          base(),
        ],
        active,
      ),
    ).toBeNull();
  });
});

describe('validateInitDraft', () => {
  const A = '0xaaa0000000000000000000000000000000000001';
  const B = '0xbbb0000000000000000000000000000000000002';
  const C = '0xccc0000000000000000000000000000000000003';
  const D = '0xddd0000000000000000000000000000000000004';

  const initSlot = (
    newAddress: string,
    over: Partial<SlotDraft> = {},
  ): SlotDraft =>
    base({
      changed: true,
      newAddress,
      signature: '0xsig',
      verified: true,
      ...over,
    });

  it('rejects when fewer than 4 slots are fully defined', () => {
    expect(
      validateInitDraft([
        initSlot(A),
        initSlot(B),
        initSlot(C),
        base({ changed: true }),
      ]),
    ).toBe('INCOMPLETE');
  });

  it('rejects a slot missing its signature', () => {
    expect(
      validateInitDraft([
        initSlot(A),
        initSlot(B),
        initSlot(C),
        initSlot(D, { signature: '' }),
      ]),
    ).toBe('INCOMPLETE');
  });

  it('rejects unverified slots', () => {
    expect(
      validateInitDraft([
        initSlot(A),
        initSlot(B),
        initSlot(C),
        initSlot(D, { verified: false }),
      ]),
    ).toBe('UNVERIFIED');
  });

  it('rejects duplicate proposed addresses', () => {
    expect(
      validateInitDraft([initSlot(A), initSlot(A), initSlot(C), initSlot(D)]),
    ).toBe('DUPLICATE_ADDRESS');
  });

  it('passes when all 4 are defined, verified, and unique', () => {
    expect(
      validateInitDraft([initSlot(A), initSlot(B), initSlot(C), initSlot(D)]),
    ).toBeNull();
  });
});
