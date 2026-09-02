import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';

import {
  CreateOperatorRulesInput,
  getCreatableTypes,
} from './create-operator-rules';

const ICS_CURVE = 2n;
const IDVTC_CURVE = 3n;

const base: CreateOperatorRulesInput = {
  isAccountActive: true,
  deployedModules: [MODULE_NAME.CSM, MODULE_NAME.CSM_02],
  pausedModules: {},
  operatorModules: [],
  activeOperatorCurveId: undefined,
  icsEligible: false,
  idvtcEligible: false,
  icsCurveId: ICS_CURVE,
  idvtcCurveId: IDVTC_CURVE,
};

const input = (patch: Partial<CreateOperatorRulesInput>) => ({
  ...base,
  ...patch,
});

describe('getCreatableTypes', () => {
  it('offers DEF and 0x02 to a wallet with no operators', () => {
    expect(getCreatableTypes(base)).toEqual([
      OPERATOR_TYPE.CSM_DEF,
      OPERATOR_TYPE.CSM2_DEF,
    ]);
  });

  it('offers nothing when the wallet is not connected', () => {
    expect(getCreatableTypes(input({ isAccountActive: false }))).toEqual([]);
  });

  it('drops types of modules that are not deployed', () => {
    expect(
      getCreatableTypes(input({ deployedModules: [MODULE_NAME.CSM] })),
    ).toEqual([OPERATOR_TYPE.CSM_DEF]);
  });

  it('drops types of paused modules independently', () => {
    expect(
      getCreatableTypes(input({ pausedModules: { [MODULE_NAME.CSM]: true } })),
    ).toEqual([OPERATOR_TYPE.CSM2_DEF]);
  });

  it('drops 0x02 when CSM_02 is paused', () => {
    expect(
      getCreatableTypes(
        input({ pausedModules: { [MODULE_NAME.CSM_02]: true } }),
      ),
    ).toEqual([OPERATOR_TYPE.CSM_DEF]);
  });

  it('blocks DEF once any CSM operator exists', () => {
    expect(
      getCreatableTypes(input({ operatorModules: [MODULE_NAME.CSM] })),
    ).toEqual([OPERATOR_TYPE.CSM2_DEF]);
  });

  it('blocks 0x02 once a CSM_02 operator exists', () => {
    expect(
      getCreatableTypes(input({ operatorModules: [MODULE_NAME.CSM_02] })),
    ).toEqual([OPERATOR_TYPE.CSM_DEF]);
  });

  it('offers ICS to an eligible wallet with no CSM operator', () => {
    expect(getCreatableTypes(input({ icsEligible: true }))).toEqual([
      OPERATOR_TYPE.CSM_DEF,
      OPERATOR_TYPE.CSM_ICS,
      OPERATOR_TYPE.CSM2_DEF,
    ]);
  });

  it('offers ICS to a wallet whose active operator is IDVTC', () => {
    expect(
      getCreatableTypes(
        input({
          icsEligible: true,
          operatorModules: [MODULE_NAME.CSM],
          activeOperatorCurveId: IDVTC_CURVE,
        }),
      ),
    ).toEqual([OPERATOR_TYPE.CSM_ICS, OPERATOR_TYPE.CSM2_DEF]);
  });

  it('withholds ICS from a wallet whose active operator is DEF', () => {
    expect(
      getCreatableTypes(
        input({
          icsEligible: true,
          operatorModules: [MODULE_NAME.CSM],
          activeOperatorCurveId: 1n,
        }),
      ),
    ).toEqual([OPERATOR_TYPE.CSM2_DEF]);
  });

  it('offers IDVTC to a wallet whose active operator is ICS', () => {
    expect(
      getCreatableTypes(
        input({
          idvtcEligible: true,
          operatorModules: [MODULE_NAME.CSM],
          activeOperatorCurveId: ICS_CURVE,
        }),
      ),
    ).toEqual([OPERATOR_TYPE.CSM_IDVTC, OPERATOR_TYPE.CSM2_DEF]);
  });

  it('withholds ICS when its curve id has not loaded', () => {
    expect(
      getCreatableTypes(input({ icsEligible: true, icsCurveId: undefined })),
    ).toEqual([OPERATOR_TYPE.CSM_DEF, OPERATOR_TYPE.CSM2_DEF]);
  });

  it('withholds IDVTC when the ICS curve id has not loaded', () => {
    expect(
      getCreatableTypes(
        input({
          idvtcEligible: true,
          operatorModules: [MODULE_NAME.CSM],
          activeOperatorCurveId: ICS_CURVE,
          icsCurveId: undefined,
        }),
      ),
    ).toEqual([OPERATOR_TYPE.CSM2_DEF]);
  });

  // Q: can I create DEF if I already have only IDVTC? No — DEF requires no
  // existing CSM operator, and the ICS<->IDVTC pair is not paired with DEF.
  it('cannot create DEF once the only CSM operator is IDVTC', () => {
    expect(
      getCreatableTypes(
        input({
          operatorModules: [MODULE_NAME.CSM],
          activeOperatorCurveId: IDVTC_CURVE,
        }),
      ),
    ).toEqual([OPERATOR_TYPE.CSM2_DEF]);
  });
});
