import type { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { resolveActiveOperator } from './resolve-active-operator';
import type { CachedOperatorRef, ModuleNodeOperator } from './types';

const CSM = 'CSM' as MODULE_NAME;
const CSM_02 = 'CSM_02' as MODULE_NAME;

const makeOperator = (id: bigint, module: MODULE_NAME = CSM) =>
  ({ nodeOperatorId: id, module }) as ModuleNodeOperator;

const refOf = (operator: ModuleNodeOperator): CachedOperatorRef => ({
  id: operator.nodeOperatorId,
  module: operator.module,
});

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

  it('resolves the cached ref when present in the list', () => {
    expect(resolveActiveOperator([opA, opB], refOf(opB), undefined)).toEqual({
      operator: opB,
      needsSelection: false,
    });
  });

  it('requires selection when the cached ref is absent from the list', () => {
    expect(resolveActiveOperator([opA, opB], refOf(opC), undefined)).toEqual({
      operator: undefined,
      needsSelection: true,
    });
  });

  it('prefers an active operator still present in the list over the cached ref, re-read from the fresh list', () => {
    const freshA = makeOperator(1n);
    const result = resolveActiveOperator([freshA, opB], refOf(opB), opA);
    expect(result).toEqual({ operator: freshA, needsSelection: false });
    expect(result.operator).toBe(freshA);
  });

  it('falls through to the cache when the active operator is no longer in the list', () => {
    expect(resolveActiveOperator([opB, opC], refOf(opC), opA)).toEqual({
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

  describe('across modules', () => {
    const csm1 = makeOperator(1n, CSM);
    const csm02_1 = makeOperator(1n, CSM_02);

    it('distinguishes the same id in different modules when resolving the cache', () => {
      expect(
        resolveActiveOperator([csm1, csm02_1], refOf(csm02_1), undefined),
      ).toEqual({ operator: csm02_1, needsSelection: false });
    });

    it('requires selection when the same id exists in both modules and no cache', () => {
      expect(
        resolveActiveOperator([csm1, csm02_1], undefined, undefined),
      ).toEqual({ operator: undefined, needsSelection: true });
    });

    it('does not match an active operator from another module', () => {
      expect(resolveActiveOperator([csm1], undefined, csm02_1)).toEqual({
        operator: csm1,
        needsSelection: false,
      });
    });
  });
});
