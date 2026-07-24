import {
  buildCancelAllPatch,
  buildCancelPatch,
  buildInitBody,
  buildSlotPatch,
  validateInitDraft,
  validateSlotDraft,
  type SlotDraft,
} from './rotation';

const A = '0xaaa0000000000000000000000000000000000001';
const B = '0xbbb0000000000000000000000000000000000002';
const C = '0xccc0000000000000000000000000000000000003';
const D = '0xddd0000000000000000000000000000000000004';

const draft = (over: Partial<SlotDraft> = {}): SlotDraft => ({
  newAddress: '',
  signature: '',
  verified: false,
  ...over,
});

const full = (newAddress: string, over: Partial<SlotDraft> = {}): SlotDraft =>
  draft({ newAddress, signature: '0xsig', verified: true, ...over });

describe('patch builders', () => {
  it('builds a single-slot set patch (1-based slot key)', () => {
    expect(buildSlotPatch(1, full(A, { discordHandle: 'd' }))).toEqual({
      slot2: { newAddress: A, signature: '0xsig', discordHandle: 'd' },
    });
  });

  it('omits empty contact fields from the slot', () => {
    expect(buildSlotPatch(0, full(A))).toEqual({
      slot1: { newAddress: A, signature: '0xsig' },
    });
  });

  it('builds a single-slot cancel patch', () => {
    expect(buildCancelPatch(2)).toEqual({ slot3: null });
  });

  it('builds an all-null full-cancel patch', () => {
    expect(buildCancelAllPatch()).toEqual({
      slot1: null,
      slot2: null,
      slot3: null,
      slot4: null,
    });
  });

  it('builds a full init body with all four slots set', () => {
    const body = buildInitBody([full(A), full(B), full(C), full(D)]);
    expect(body.slot1?.newAddress).toBe(A);
    expect(body.slot2?.newAddress).toBe(B);
    expect(body.slot3?.newAddress).toBe(C);
    expect(body.slot4?.newAddress).toBe(D);
  });
});

describe('validateSlotDraft', () => {
  const taken = [B, C];

  it('rejects a draft missing address or signature', () => {
    expect(validateSlotDraft(draft(), taken)).toBe('INCOMPLETE');
    expect(validateSlotDraft(draft({ newAddress: A }), taken)).toBe(
      'INCOMPLETE',
    );
  });

  it('rejects an unverified draft', () => {
    expect(validateSlotDraft(full(A, { verified: false }), taken)).toBe(
      'UNVERIFIED',
    );
  });

  it('rejects an address already taken, case-insensitively', () => {
    expect(validateSlotDraft(full(B), taken)).toBe('ALREADY_ACTIVE');
    expect(
      validateSlotDraft(full(B.toUpperCase().replace('0X', '0x')), taken),
    ).toBe('ALREADY_ACTIVE');
  });

  it('passes a complete, verified, non-colliding draft', () => {
    expect(validateSlotDraft(full(A), taken)).toBeNull();
  });
});

describe('validateInitDraft', () => {
  it('rejects when fewer than 4 slots are fully defined', () => {
    expect(validateInitDraft([full(A), full(B), full(C), draft()])).toBe(
      'INCOMPLETE',
    );
  });

  it('rejects a slot missing its signature', () => {
    expect(
      validateInitDraft([
        full(A),
        full(B),
        full(C),
        full(D, { signature: '' }),
      ]),
    ).toBe('INCOMPLETE');
  });

  it('rejects unverified slots', () => {
    expect(
      validateInitDraft([
        full(A),
        full(B),
        full(C),
        full(D, { verified: false }),
      ]),
    ).toBe('UNVERIFIED');
  });

  it('rejects duplicate proposed addresses', () => {
    expect(validateInitDraft([full(A), full(A), full(C), full(D)])).toBe(
      'DUPLICATE_ADDRESS',
    );
  });

  it('passes when all 4 are defined, verified, and unique', () => {
    expect(validateInitDraft([full(A), full(B), full(C), full(D)])).toBeNull();
  });
});
