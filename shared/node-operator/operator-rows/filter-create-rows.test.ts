import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { filterCreateRows } from './filter-create-rows';

const rows = {
  canCreateCm: true,
  cmTypes: ['Curated'],
  csmTypes: ['Permissionless'],
  hasRows: true,
};

describe('filterCreateRows', () => {
  it('keeps only CM rows for CM', () => {
    expect(filterCreateRows(rows, [MODULE_NAME.CM])).toEqual({
      canCreateCm: true,
      cmTypes: ['Curated'],
      csmTypes: [],
      hasRows: true,
    });
  });

  it.each([[MODULE_NAME.CSM], [MODULE_NAME.CSM_02]])(
    'keeps only CSM rows for %s',
    (module) => {
      expect(filterCreateRows(rows, [module])).toEqual({
        canCreateCm: false,
        cmTypes: [],
        csmTypes: ['Permissionless'],
        hasRows: true,
      });
    },
  );

  it('has no rows when the filtered module cannot be created', () => {
    const result = filterCreateRows(
      { ...rows, canCreateCm: false, cmTypes: [], hasRows: true },
      [MODULE_NAME.CM],
    );
    expect(result.hasRows).toBe(false);
  });
});
