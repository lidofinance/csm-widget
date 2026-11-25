import {
  CurveRef,
  MODULE_NAME,
  OPERATOR_TYPE,
} from '@lidofinance/lido-csm-sdk';
import { getTypeColumns } from './get-type-columns';

const curve = (module: MODULE_NAME, curveId: bigint) =>
  ({ module, curveId }) as CurveRef;

const csmDef = curve(MODULE_NAME.CSM, 0n);
const csmIcs = curve(MODULE_NAME.CSM, 1n);
const csm2Def = curve(MODULE_NAME.CSM_02, 0n);

describe('getTypeColumns', () => {
  it('IDVTC: own other curve becomes the tagged base', () => {
    expect(
      getTypeColumns({
        type: OPERATOR_TYPE.CSM_IDVTC,
        operatorCurve: csmIcs,
        typeCurve: curve(MODULE_NAME.CSM, 2n),
        defCurve: csmDef,
      }),
    ).toMatchObject({
      baseCurve: csmIcs,
      baseCurrent: true,
      baseOwnTitle: true,
      holdsTarget: false,
    });
  });

  it('IDVTC: holding the target tags the type column, base stays Default', () => {
    expect(
      getTypeColumns({
        type: OPERATOR_TYPE.CSM_ICS,
        operatorCurve: csmIcs,
        typeCurve: csmIcs,
        defCurve: csmDef,
      }),
    ).toMatchObject({
      baseCurve: csmDef,
      baseCurrent: false,
      holdsTarget: true,
    });
  });

  it('IDVTC: 0x02 operator does not count', () => {
    expect(
      getTypeColumns({
        type: OPERATOR_TYPE.CSM_ICS,
        operatorCurve: csm2Def,
        typeCurve: csmIcs,
        defCurve: csmDef,
      }),
    ).toMatchObject({ baseCurve: csmDef, baseCurrent: false });
  });

  it('0x02: base is always CSM Default, tagged only for a 0x01 operator', () => {
    const base = { type: OPERATOR_TYPE.CSM2_DEF, typeCurve: csm2Def };
    expect(
      getTypeColumns({ ...base, operatorCurve: csmIcs, defCurve: csmDef }),
    ).toMatchObject({
      baseCurve: csmDef,
      baseCurrent: false,
      baseOwnTitle: false,
      holdsTarget: false,
    });
    expect(
      getTypeColumns({ ...base, operatorCurve: csmDef, defCurve: csmDef }),
    ).toMatchObject({ baseCurrent: true, holdsTarget: false });
  });

  it('0x02: 0x02 operator holds the target despite equal curveId', () => {
    expect(
      getTypeColumns({
        type: OPERATOR_TYPE.CSM2_DEF,
        operatorCurve: csm2Def,
        typeCurve: csm2Def,
        defCurve: csmDef,
      }),
    ).toMatchObject({ baseCurrent: false, holdsTarget: true });
  });
});
