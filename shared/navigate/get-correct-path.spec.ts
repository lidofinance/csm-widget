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
        flags({
          CAN_CREATE: false,
          HAS_MANAGER_ROLE: true,
          HAS_ANY_ROLE: true,
        }),
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

describe('getCorrectPath — claimer-only wallet', () => {
  const claimer = flags({ HAS_ANY_ROLE: true });
  const operator = flags({ HAS_MANAGER_ROLE: true, HAS_ANY_ROLE: true });
  const nobody = flags({});

  it('gives a claimer full access to the bond pages', () => {
    expect(getCorrectPath(PATH.BOND, claimer)).toBe(PATH.BOND_CLAIM);
    expect(getCorrectPath(PATH.BOND_CLAIM, claimer)).toBe(PATH.BOND_CLAIM);
    expect(getCorrectPath(PATH.BOND_ADD, claimer)).toBe(PATH.BOND_ADD);
    expect(getCorrectPath(PATH.BOND_UNLOCK, claimer)).toBe(PATH.BOND_UNLOCK);
  });

  it('gives a claimer full access to the keys pages', () => {
    expect(getCorrectPath(PATH.KEYS, claimer)).toBe(PATH.KEYS_VIEW);
    expect(getCorrectPath(PATH.KEYS_VIEW, claimer)).toBe(PATH.KEYS_VIEW);
    expect(getCorrectPath(PATH.KEYS_SUBMIT, claimer)).toBe(PATH.KEYS_VIEW);
    expect(getCorrectPath(PATH.KEYS_EXIT, claimer)).toBe(PATH.KEYS_EXIT);
  });

  it('gives a claimer full access to the settings pages', () => {
    expect(getCorrectPath(PATH.SETTINGS, claimer)).toBe(PATH.SETTINGS_ROLES);
    expect(getCorrectPath(PATH.SETTINGS_ROLES, claimer)).toBe(
      PATH.SETTINGS_ROLES,
    );
  });

  it('keeps the ICS claim type page operator-only for a claimer', () => {
    expect(
      getCorrectPath(
        PATH.TYPE_ICS_CLAIM,
        flags({
          HAS_ANY_ROLE: true,
          CAN_CLAIM_ICS: true,
          ICS_APPLY_ENABLED: false,
        }),
      ),
    ).toBe(PATH.TYPE_PARAMETERS);
  });

  it('leaves an operator on the requested bond and keys pages', () => {
    expect(getCorrectPath(PATH.BOND_ADD, operator)).toBe(PATH.BOND_ADD);
    expect(getCorrectPath(PATH.KEYS_SUBMIT, operator)).toBe(PATH.KEYS_SUBMIT);
  });

  it('sends a wallet with no role to the fallback pages', () => {
    expect(getCorrectPath(PATH.BOND, nobody)).toBe(PATH.HOME);
    expect(getCorrectPath(PATH.KEYS, nobody)).toBe(PATH.CREATE);
    expect(getCorrectPath(PATH.SETTINGS, nobody)).toBe(PATH.SETTINGS_INBOX);
  });
});
