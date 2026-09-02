// `consts` reaches config → next publicRuntimeConfig, which is undefined under
// Jest. Only the two module booleans are used by the function under test.
jest.mock('consts', () => ({ isModuleCM: false, isModuleCSM: true }));

import { PATH } from 'consts/urls';
import { ShowFlags } from 'shared/hooks';
import { getCorrectPath } from './get-correct-path';

const flags = (patch: Partial<ShowFlags>): ShowFlags =>
  ({
    CAN_CREATE: true,
    CAN_CREATE_DEF: false,
    CAN_CREATE_ICS: false,
    CAN_CREATE_IDVTC: false,
    CAN_CREATE_0X02: false,
    HAS_MANAGER_ROLE: false,
    HAS_REWARDS_ROLE: false,
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
    expect(getCorrectPath(PATH.CREATE, flags({ CAN_CREATE_DEF: true }))).toBe(
      PATH.CREATE_DEF,
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
        flags({ CAN_CREATE_DEF: true, CAN_CREATE_0X02: true }),
      ),
    ).toBe(PATH.CREATE);
  });

  it('keeps the selection page when no per-type flag is set', () => {
    expect(getCorrectPath(PATH.CREATE, flags({}))).toBe(PATH.CREATE);
  });
});
