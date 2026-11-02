import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { MODULE_METADATA } from 'consts/module';
import { OPERATOR_TYPE_METADATA } from 'consts/operator-type-metadata';
import { getTypeTagline } from './type-taglines';

describe('getTypeTagline', () => {
  it.each([
    [OPERATOR_TYPE.CSM_DEF, 'The simplest way to start validating in CSM'],
    [OPERATOR_TYPE.CSM_ICS, 'Get verified and unlock better parameters'],
    [
      OPERATOR_TYPE.CSM_IDVTC,
      'Join a verified cluster with 3 other solo stakers',
    ],
    [
      OPERATOR_TYPE.CSM2_DEF,
      'Validate up to 2,048 ETH per key for enhanced economics',
    ],
  ])('uses the Figma tagline for %s', (type, tagline) => {
    expect(getTypeTagline(type)).toBe(tagline);
  });

  it('falls back to the type description', () => {
    expect(getTypeTagline(OPERATOR_TYPE.CSM_LEA)).toBe(
      OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_LEA].description,
    );
  });

  it('describes the Curated Module without a type', () => {
    expect(getTypeTagline()).toBe(MODULE_METADATA[MODULE_NAME.CM].description);
  });
});
