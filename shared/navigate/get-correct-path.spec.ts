// `consts` reaches config → next publicRuntimeConfig, which is undefined under
// Jest. Only the two module booleans are used by the function under test.
jest.mock('consts', () => ({ isModuleCM: false, isModuleCSM: true }));

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
    ).toBe(PATH.KEYS_VIEW);
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

  it('leaves an operator on the requested bond page', () => {
    expect(getCorrectPath(PATH.BOND, operator)).toBe(PATH.BOND_CLAIM);
    expect(getCorrectPath(PATH.BOND_ADD, operator)).toBe(PATH.BOND_ADD);
    expect(getCorrectPath(PATH.BOND_UNLOCK, operator)).toBe(PATH.BOND_UNLOCK);
  });

  it('sends a wallet with no role home', () => {
    expect(getCorrectPath(PATH.BOND, flags({}))).toBe(PATH.HOME);
    expect(getCorrectPath(PATH.BOND_CLAIM, flags({}))).toBe(PATH.HOME);
    expect(getCorrectPath(PATH.BOND_ADD, flags({}))).toBe(PATH.HOME);
  });
});
