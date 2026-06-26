import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { mergeOperators } from './merge-operators';

const op = (id: bigint) => ({ nodeOperatorId: id }) as any;

describe('mergeOperators', () => {
  it('tags each operator with its module and concatenates CSM first', () => {
    const result = mergeOperators([op(1n)], [op(2n)]);
    expect(result).toEqual([
      { nodeOperatorId: 1n, module: MODULE_NAME.CSM },
      { nodeOperatorId: 2n, module: MODULE_NAME.CM },
    ]);
  });

  it('keeps same numeric id from different modules as distinct entries', () => {
    const result = mergeOperators([op(5n)], [op(5n)]);
    expect(result).toHaveLength(2);
    expect(result.map((o) => o.module)).toEqual([
      MODULE_NAME.CSM,
      MODULE_NAME.CM,
    ]);
  });
});
