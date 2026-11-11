import { PATH } from 'consts/urls';
import { ShowFlags } from 'shared/hooks';
import { getCorrectPath } from './get-correct-path';

const flags = (patch: Partial<ShowFlags>): ShowFlags =>
  ({
    CAN_CREATE: true,
    CAN_CREATE_0X01: false,
    CAN_CREATE_ICS: false,
    CAN_CREATE_IDVTC: false,
    CAN_CREATE_0X02: false,
    CAN_CREATE_CM: false,
    IS_CM: false,
    HAS_APPLY_OPTIONS: false,
    HAS_MANAGER_ROLE: false,
    HAS_REWARDS_ROLE: false,
    HAS_ANY_ROLE: false,
    ...patch,
  }) as ShowFlags;

describe('getCorrectPath(PATH.CREATE)', () => {
  it('sends an operator who cannot create to their keys', () => {
    expect(
      getCorrectPath(
        PATH.CREATE,
        flags({ CAN_CREATE: false, HAS_MANAGER_ROLE: true }),
      ),
    ).toBe(PATH.KEYS);
  });

  it('jumps straight to the only creatable type', () => {
    expect(getCorrectPath(PATH.CREATE, flags({ CAN_CREATE_0X01: true }))).toBe(
      PATH.CREATE_0x01,
    );
    expect(getCorrectPath(PATH.CREATE, flags({ CAN_CREATE_ICS: true }))).toBe(
      PATH.CREATE_ICS,
    );
    expect(getCorrectPath(PATH.CREATE, flags({ CAN_CREATE_IDVTC: true }))).toBe(
      PATH.CREATE_IDVTC,
    );
    expect(getCorrectPath(PATH.CREATE, flags({ CAN_CREATE_0X02: true }))).toBe(
      PATH.CREATE_0x02,
    );
  });

  it('keeps the selection page when several types are creatable', () => {
    expect(
      getCorrectPath(
        PATH.CREATE,
        flags({ CAN_CREATE_0X01: true, CAN_CREATE_0X02: true }),
      ),
    ).toBe(PATH.CREATE);
  });

  it('keeps the selection page when no per-type flag is set', () => {
    expect(getCorrectPath(PATH.CREATE, flags({}))).toBe(PATH.CREATE);
  });

  it('keeps the selection page when an apply card makes it a real choice', () => {
    expect(
      getCorrectPath(
        PATH.CREATE,
        flags({ CAN_CREATE_0X01: true, HAS_APPLY_OPTIONS: true }),
      ),
    ).toBe(PATH.CREATE);
  });

  it('sends a CM-eligible wallet with no other option straight to /create/cm', () => {
    expect(getCorrectPath(PATH.CREATE, flags({ CAN_CREATE_CM: true }))).toBe(
      PATH.CREATE_CM,
    );
  });

  it('keeps the picker when CM and 0x01 are both creatable', () => {
    expect(
      getCorrectPath(
        PATH.CREATE,
        flags({ CAN_CREATE_CM: true, CAN_CREATE_0X01: true }),
      ),
    ).toBe(PATH.CREATE);
  });
});

describe('getCorrectPath — settings metadata', () => {
  it('metadata settings stay for CM operators only', () => {
    expect(getCorrectPath(PATH.SETTINGS_METADATA, flags({ IS_CM: true }))).toBe(
      PATH.SETTINGS_METADATA,
    );
    expect(
      getCorrectPath(PATH.SETTINGS_METADATA, flags({ IS_CM: false })),
    ).toBe(PATH.SETTINGS);
  });
});

describe('getCorrectPath — bond pages', () => {
  const claimer = flags({ HAS_ANY_ROLE: true });
  const operator = flags({ HAS_MANAGER_ROLE: true, HAS_ANY_ROLE: true });

  it('keeps a claimer-only wallet inside the claim page', () => {
    expect(getCorrectPath(PATH.BOND, claimer)).toBe(PATH.BOND_CLAIM);
    expect(getCorrectPath(PATH.BOND_CLAIM, claimer)).toBe(PATH.BOND_CLAIM);
    expect(getCorrectPath(PATH.BOND_ADD, claimer)).toBe(PATH.BOND_CLAIM);
    expect(getCorrectPath(PATH.BOND_UNLOCK, claimer)).toBe(PATH.BOND_CLAIM);
  });

  it('keeps a role holder on the hub', () => {
    expect(getCorrectPath(PATH.BOND, operator)).toBe(PATH.BOND);
    expect(
      getCorrectPath(
        PATH.BOND,
        flags({ HAS_REWARDS_ROLE: true, HAS_ANY_ROLE: true }),
      ),
    ).toBe(PATH.BOND);
  });

  it('leaves an operator on the requested bond page', () => {
    expect(getCorrectPath(PATH.BOND_ADD, operator)).toBe(PATH.BOND_ADD);
    expect(getCorrectPath(PATH.BOND_UNLOCK, operator)).toBe(PATH.BOND_UNLOCK);
  });

  it('sends a wallet with no role home', () => {
    expect(getCorrectPath(PATH.BOND, flags({}))).toBe(PATH.HOME);
    expect(getCorrectPath(PATH.BOND_CLAIM, flags({}))).toBe(PATH.HOME);
    expect(getCorrectPath(PATH.BOND_ADD, flags({}))).toBe(PATH.HOME);
  });
});

describe('getCorrectPath — type claim pages', () => {
  it('keeps an owner eligible to claim on the claim page', () => {
    expect(
      getCorrectPath(PATH.TYPE_ICS_CLAIM, flags({ CAN_CLAIM_ICS: true })),
    ).toBe(PATH.TYPE_ICS_CLAIM);
    expect(
      getCorrectPath(PATH.TYPE_IDVTC_CLAIM, flags({ CAN_CLAIM_IDVTC: true })),
    ).toBe(PATH.TYPE_IDVTC_CLAIM);
  });

  it('redirects a non-owner manager off the claim page even with a role', () => {
    expect(
      getCorrectPath(
        PATH.TYPE_ICS_CLAIM,
        flags({ HAS_MANAGER_ROLE: true, CAN_CLAIM_ICS: false }),
      ),
    ).not.toBe(PATH.TYPE_ICS_CLAIM);
    expect(
      getCorrectPath(
        PATH.TYPE_IDVTC_CLAIM,
        flags({ HAS_MANAGER_ROLE: true, CAN_CLAIM_IDVTC: false }),
      ),
    ).not.toBe(PATH.TYPE_IDVTC_CLAIM);
  });

  it('falls back to the type system page when apply is enabled', () => {
    expect(
      getCorrectPath(
        PATH.TYPE_ICS_CLAIM,
        flags({ CAN_CLAIM_ICS: false, ICS_APPLY_ENABLED: true }),
      ),
    ).toBe(PATH.TYPE_ICS_SYSTEM);
    expect(
      getCorrectPath(
        PATH.TYPE_IDVTC_CLAIM,
        flags({ CAN_CLAIM_IDVTC: false, ICS_APPLY_ENABLED: true }),
      ),
    ).toBe(PATH.TYPE_IDVTC_DESCRIPTION);
  });

  it('falls back to type parameters when apply is disabled', () => {
    expect(
      getCorrectPath(
        PATH.TYPE_ICS_CLAIM,
        flags({ CAN_CLAIM_ICS: false, ICS_APPLY_ENABLED: false }),
      ),
    ).toBe(PATH.TYPE_PARAMETERS);
    expect(
      getCorrectPath(
        PATH.TYPE_IDVTC_CLAIM,
        flags({ CAN_CLAIM_IDVTC: false, ICS_APPLY_ENABLED: false }),
      ),
    ).toBe(PATH.TYPE_PARAMETERS);
  });
});

describe('getCorrectPath — settings hub', () => {
  it('keeps the hub for wallets with a manager or rewards role', () => {
    expect(
      getCorrectPath(PATH.SETTINGS, flags({ HAS_MANAGER_ROLE: true })),
    ).toBe(PATH.SETTINGS);
    expect(
      getCorrectPath(PATH.SETTINGS, flags({ HAS_REWARDS_ROLE: true })),
    ).toBe(PATH.SETTINGS);
  });

  it('sends claimer-only wallets and invitees to the inbox', () => {
    expect(getCorrectPath(PATH.SETTINGS, flags({ HAS_ANY_ROLE: true }))).toBe(
      PATH.SETTINGS_INBOX,
    );
    expect(getCorrectPath(PATH.SETTINGS, flags({}))).toBe(PATH.SETTINGS_INBOX);
  });
});

describe('getCorrectPath(PATH.KEYS)', () => {
  it('keeps the hub for a manager', () => {
    expect(getCorrectPath(PATH.KEYS, flags({ HAS_MANAGER_ROLE: true }))).toBe(
      PATH.KEYS,
    );
  });

  it('keeps the hub for a rewards-only wallet', () => {
    expect(getCorrectPath(PATH.KEYS, flags({ HAS_REWARDS_ROLE: true }))).toBe(
      PATH.KEYS,
    );
  });

  it('keeps the hub for a manager with zero keys', () => {
    expect(
      getCorrectPath(
        PATH.KEYS,
        flags({ HAS_MANAGER_ROLE: true, HAS_KEYS: false }),
      ),
    ).toBe(PATH.KEYS);
  });

  it('sends a wallet without a role to create', () => {
    expect(getCorrectPath(PATH.KEYS, flags({}))).toBe(PATH.CREATE);
  });
});

describe('getCorrectPath(PATH.KEYS_SUBMIT)', () => {
  it('sends a non-manager to the hub', () => {
    expect(
      getCorrectPath(PATH.KEYS_SUBMIT, flags({ HAS_REWARDS_ROLE: true })),
    ).toBe(PATH.KEYS);
  });

  it('keeps submit for a manager', () => {
    expect(
      getCorrectPath(PATH.KEYS_SUBMIT, flags({ HAS_MANAGER_ROLE: true })),
    ).toBe(PATH.KEYS_SUBMIT);
  });
});
