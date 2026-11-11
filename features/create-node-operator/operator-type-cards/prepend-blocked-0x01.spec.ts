import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts/urls';
import { prependBlocked0x01, VisibleType } from './prepend-blocked-0x01';

const ics: VisibleType = {
  key: OPERATOR_TYPE.CSM_ICS,
  type: OPERATOR_TYPE.CSM_ICS,
  href: PATH.TYPE_ICS_APPLY,
  label: 'Learn more',
  matomoEvent: 'x' as VisibleType['matomoEvent'],
  primary: false,
};

describe('prependBlocked0x01', () => {
  it('prepends a disabled 0x01 card when blocked', () => {
    const result = prependBlocked0x01([ics], true);
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe(OPERATOR_TYPE.CSM_DEF);
    expect(result[0].disabledReason).toBeTruthy();
    expect(result[1]).toBe(ics);
  });

  it('returns the same array when not blocked', () => {
    const types = [ics];
    expect(prependBlocked0x01(types, false)).toBe(types);
  });

  it('leaves an existing 0x01 card untouched', () => {
    const def: VisibleType = { ...ics, type: OPERATOR_TYPE.CSM_DEF };
    const types = [def, ics];
    expect(prependBlocked0x01(types, true)).toBe(types);
  });
});
