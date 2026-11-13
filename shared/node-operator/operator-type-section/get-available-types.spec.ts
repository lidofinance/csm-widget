import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import { getAvailableTypes } from './get-available-types';

const on = { canCreate0x01: true, canCreate0x02: true };
const off = { canCreate0x01: false, canCreate0x02: false };
const types = (list: ReturnType<typeof getAvailableTypes>) =>
  list.map(({ type }) => type);

describe('getAvailableTypes', () => {
  it('pre-operator gets every type when create flags are on', () => {
    expect(types(getAvailableTypes(undefined, on))).toEqual([
      OPERATOR_TYPE.CSM_ICS,
      OPERATOR_TYPE.CSM_IDVTC,
      OPERATOR_TYPE.CSM_DEF,
      OPERATOR_TYPE.CSM2_DEF,
    ]);
  });

  it('omits 0x01 and 0x02 when create flags are off', () => {
    expect(types(getAvailableTypes(undefined, off))).toEqual([
      OPERATOR_TYPE.CSM_ICS,
      OPERATOR_TYPE.CSM_IDVTC,
    ]);
  });

  it('excludes the current type', () => {
    expect(types(getAvailableTypes(OPERATOR_TYPE.CSM_ICS, on))).toEqual([
      OPERATOR_TYPE.CSM_IDVTC,
      OPERATOR_TYPE.CSM_DEF,
      OPERATOR_TYPE.CSM2_DEF,
    ]);
    expect(types(getAvailableTypes(OPERATOR_TYPE.CSM_IDVTC, off))).toEqual([
      OPERATOR_TYPE.CSM_ICS,
    ]);
  });

  it('0x01 operator is offered 0x02 only with its flag', () => {
    expect(
      types(
        getAvailableTypes(OPERATOR_TYPE.CSM_DEF, {
          ...off,
          canCreate0x02: true,
        }),
      ),
    ).toEqual([
      OPERATOR_TYPE.CSM_ICS,
      OPERATOR_TYPE.CSM_IDVTC,
      OPERATOR_TYPE.CSM2_DEF,
    ]);
  });

  it('0x02 operator gets 0x01 only with its flag', () => {
    expect(types(getAvailableTypes(OPERATOR_TYPE.CSM2_DEF, off))).toEqual([
      OPERATOR_TYPE.CSM_ICS,
      OPERATOR_TYPE.CSM_IDVTC,
    ]);
    expect(types(getAvailableTypes(OPERATOR_TYPE.CSM2_DEF, on))).toContain(
      OPERATOR_TYPE.CSM_DEF,
    );
  });

  it('maps targets', () => {
    const list = getAvailableTypes(undefined, on);
    expect(list.map(({ href }) => href)).toEqual([
      PATH.TYPE_ICS_SYSTEM,
      PATH.TYPE_IDVTC_DESCRIPTION,
      PATH.CREATE_0x01,
      PATH.CREATE_0x02,
    ]);
  });
});
