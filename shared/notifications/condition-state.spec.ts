import { toConditionState } from './condition-state';

describe('toConditionState', () => {
  it('is inactive when the gate is false even with pending queries', () => {
    const active = vi.fn(() => true);
    expect(
      toConditionState({
        gate: false,
        queries: [{ isSuccess: false }],
        active,
      }),
    ).toBe('inactive');
    expect(active).not.toHaveBeenCalled();
  });

  it('is unknown while a query is pending', () => {
    expect(
      toConditionState({
        queries: [{ isSuccess: true }, { isSuccess: false }],
        active: () => true,
      }),
    ).toBe('unknown');
  });

  it('is unknown when a query errored', () => {
    expect(
      toConditionState({
        queries: [{ isSuccess: false }],
        active: () => false,
      }),
    ).toBe('unknown');
  });

  it('is active when all succeeded and the condition holds', () => {
    expect(
      toConditionState({ queries: [{ isSuccess: true }], active: () => true }),
    ).toBe('active');
  });

  it('is inactive when all succeeded and the condition does not hold', () => {
    expect(
      toConditionState({ queries: [{ isSuccess: true }], active: () => false }),
    ).toBe('inactive');
  });

  it('does not evaluate active() when a query is not successful', () => {
    const active = vi.fn(() => true);
    toConditionState({ queries: [{ isSuccess: false }], active });
    expect(active).not.toHaveBeenCalled();
  });
});
