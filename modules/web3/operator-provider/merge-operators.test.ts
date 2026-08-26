import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { appendModuleOperator, mergeOperators } from './merge-operators';

const op = (id: bigint) => ({ nodeOperatorId: id }) as any;

describe('mergeOperators', () => {
  it('tags each operator with its module and preserves group order', () => {
    const result = mergeOperators([
      { module: MODULE_NAME.CSM, operators: [op(1n)] },
      { module: MODULE_NAME.CSM_02, operators: [op(2n)] },
    ]);
    expect(result).toEqual([
      { nodeOperatorId: 1n, module: MODULE_NAME.CSM },
      { nodeOperatorId: 2n, module: MODULE_NAME.CSM_02 },
    ]);
  });

  it('keeps same numeric id from different modules as distinct entries', () => {
    const result = mergeOperators([
      { module: MODULE_NAME.CSM, operators: [op(5n)] },
      { module: MODULE_NAME.CSM_02, operators: [op(5n)] },
    ]);
    expect(result).toHaveLength(2);
    expect(result.map((o) => o.module)).toEqual([
      MODULE_NAME.CSM,
      MODULE_NAME.CSM_02,
    ]);
  });
});

describe('appendModuleOperator', () => {
  it('appends when no entry matches both id and module', () => {
    const list = [{ ...op(1n), module: MODULE_NAME.CSM }];
    const result = appendModuleOperator(list, {
      ...op(2n),
      module: MODULE_NAME.CSM,
    });
    expect(result).toEqual([
      { ...op(1n), module: MODULE_NAME.CSM },
      { ...op(2n), module: MODULE_NAME.CSM },
    ]);
  });

  it('replaces in place when both id and module match', () => {
    const list = [
      { ...op(1n), module: MODULE_NAME.CSM },
      { ...op(2n), module: MODULE_NAME.CSM },
    ];
    const updated = { ...op(2n), module: MODULE_NAME.CSM, extra: true };
    const result = appendModuleOperator(list, updated);
    expect(result).toHaveLength(2);
    expect(result[1]).toEqual(updated);
  });

  it('keeps same numeric id from a different module as a separate entry', () => {
    const list = [{ ...op(1n), module: MODULE_NAME.CSM }];
    const result = appendModuleOperator(list, {
      ...op(1n),
      module: MODULE_NAME.CSM_02,
    });
    expect(result).toHaveLength(2);
    expect(result.map((o) => o.module)).toEqual([
      MODULE_NAME.CSM,
      MODULE_NAME.CSM_02,
    ]);
  });
});
