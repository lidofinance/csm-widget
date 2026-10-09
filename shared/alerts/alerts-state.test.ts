import { removeAlert, upsertAlert } from './alerts-state';

jest.mock('uuid', () => ({ v4: () => 'uuid-default' }));

const A = () => null;
const B = () => null;
const C = () => null;

const prev = [
  { component: A, props: { n: 1 }, session: 's-a' },
  { component: B, props: { n: 2 }, session: 's-b' },
  { component: C, props: { n: 3 }, session: 's-c' },
];

describe('upsertAlert', () => {
  it('updates props, preserves session and keeps others in order', () => {
    const next = upsertAlert(prev, B, { n: 20 });
    expect(next.map((a) => a.component)).toEqual([A, B, C]);
    expect(next[0]).toBe(prev[0]);
    expect(next[2]).toBe(prev[2]);
    expect(next[1]).toEqual({
      component: B,
      props: { n: 20 },
      session: 's-b',
    });
    expect(prev[1].props).toEqual({ n: 2 });
  });

  it('returns the same reference when props are unchanged', () => {
    expect(upsertAlert(prev, B, prev[1].props)).toBe(prev);
  });

  it('appends a new alert with a fresh session', () => {
    const D = () => null;
    const next = upsertAlert(prev, D, { n: 4 });
    expect(next).toHaveLength(4);
    expect(next[3]).toEqual({
      component: D,
      props: { n: 4 },
      session: 'uuid-default',
    });
  });
});

describe('removeAlert', () => {
  it('removes the matching alert and keeps the others in order', () => {
    const next = removeAlert(prev, B);
    expect(next.map((a) => a.component)).toEqual([A, C]);
    expect(next[0]).toBe(prev[0]);
    expect(next[1]).toBe(prev[2]);
    expect(prev).toHaveLength(3);
  });

  it('returns the same reference when the component is absent', () => {
    const D = () => null;
    expect(removeAlert(prev, D)).toBe(prev);
    expect(removeAlert(prev, undefined)).toBe(prev);
  });
});
