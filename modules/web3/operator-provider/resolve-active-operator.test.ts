import type { NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { resolveActiveOperator } from './resolve-active-operator';

const makeOperator = (id: bigint) =>
  ({ nodeOperatorId: id }) as NodeOperatorShortInfo;

const opA = makeOperator(1n);
const opB = makeOperator(2n);
const opC = makeOperator(3n);

describe('resolveActiveOperator', () => {
  it('returns no operator and no prompt when list is undefined', () => {
    expect(resolveActiveOperator(undefined, undefined, undefined)).toEqual({
      operator: undefined,
      needsSelection: false,
    });
  });

  it('returns no operator and no prompt when list is empty', () => {
    expect(resolveActiveOperator([], undefined, undefined)).toEqual({
      operator: undefined,
      needsSelection: false,
    });
  });

  it('auto-resolves the single operator', () => {
    expect(resolveActiveOperator([opA], undefined, undefined)).toEqual({
      operator: opA,
      needsSelection: false,
    });
  });

  it('requires selection when several operators and no cache', () => {
    expect(resolveActiveOperator([opA, opB], undefined, undefined)).toEqual({
      operator: undefined,
      needsSelection: true,
    });
  });

  it('resolves the cached id when present in the list', () => {
    expect(
      resolveActiveOperator([opA, opB], opB.nodeOperatorId, undefined),
    ).toEqual({
      operator: opB,
      needsSelection: false,
    });
  });

  it('requires selection when the cached id is absent from the list', () => {
    expect(
      resolveActiveOperator([opA, opB], opC.nodeOperatorId, undefined),
    ).toEqual({
      operator: undefined,
      needsSelection: true,
    });
  });

  it('prefers an active operator still present in the list over the cached id, re-read from the fresh list', () => {
    const freshA = makeOperator(1n);
    const result = resolveActiveOperator(
      [freshA, opB],
      opB.nodeOperatorId,
      opA,
    );
    expect(result).toEqual({ operator: freshA, needsSelection: false });
    expect(result.operator).toBe(freshA);
  });

  it('falls through to the cache when the active operator is no longer in the list', () => {
    expect(resolveActiveOperator([opB, opC], opC.nodeOperatorId, opA)).toEqual({
      operator: opC,
      needsSelection: false,
    });
  });

  it('falls through to prompting when the active operator is no longer in the list and no cache matches', () => {
    expect(resolveActiveOperator([opB, opC], undefined, opA)).toEqual({
      operator: undefined,
      needsSelection: true,
    });
  });
});
