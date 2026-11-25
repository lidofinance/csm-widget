import {
  acknowledge,
  closeToast,
  nextAckExpiry,
  reconcile,
  selectToastQueue,
  selectVisible,
  sliceToasts,
} from './notifications-state';
import type { Alert, AlertType, Reports, Severity } from './types';

const OP = 'CSM-1';
const OTHER = 'CSM-12';
const sev = (t: AlertType): Severity =>
  ['normalize-queue', 'claim-ics', 'claim-idvtc'].includes(t)
    ? 'normal'
    : 'important';
const noSuppress = () => undefined;

const visibleOf = (reports: Reports, stored = {}, now = 0) =>
  selectVisible(reports, stored, now, sev);

const lockedReports: Reports = {
  [OP]: { 'locked-bond': { state: 'active', props: {} } },
};

describe('reconcile', () => {
  it('adds firstSeenAt once and keeps the same reference after', () => {
    const first = reconcile({}, OP, { 'locked-bond': { state: 'active' } }, 10);
    expect(first).toEqual({ 'CSM-1:locked-bond': { firstSeenAt: 10 } });
    const second = reconcile(
      first,
      OP,
      { 'locked-bond': { state: 'active' } },
      20,
    );
    expect(second).toBe(first);
  });

  it('deletes on inactive and creates a new entry on re-occurrence', () => {
    const a = reconcile({}, OP, { 'locked-bond': { state: 'active' } }, 10);
    const b = reconcile(a, OP, { 'locked-bond': { state: 'inactive' } }, 20);
    expect(b).toEqual({});
    const c = reconcile(b, OP, { 'locked-bond': { state: 'active' } }, 30);
    expect(c['CSM-1:locked-bond'].firstSeenAt).toBe(30);
  });

  it('keeps entries and reference on unknown', () => {
    const a = reconcile({}, OP, { 'locked-bond': { state: 'active' } }, 10);
    const b = reconcile(a, OP, { 'locked-bond': { state: 'unknown' } }, 20);
    expect(b).toBe(a);
  });

  it('never touches other operators', () => {
    const stored = {
      'CSM-12:locked-bond': { firstSeenAt: 1 },
      'CSM-1:locked-bond': { firstSeenAt: 1 },
    };
    const next = reconcile(
      stored,
      'CSM-1',
      { 'locked-bond': { state: 'inactive' } },
      5,
    );
    expect(next).toEqual({ [`${OTHER}:locked-bond`]: { firstSeenAt: 1 } });
  });

  it('rolls over strike instances', () => {
    const stored = { 'CSM-1:key-strike:100': { firstSeenAt: 1 } };
    const next = reconcile(
      stored,
      OP,
      { 'key-strike': { state: 'active', instanceKey: '200' } },
      5,
    );
    expect(Object.keys(next)).toEqual(['CSM-1:key-strike:200']);
  });
});

describe('selectVisible', () => {
  it('hides operators without a report but keeps their stored entries', () => {
    const stored = { 'CSM-12:locked-bond': { firstSeenAt: 1 } };
    expect(visibleOf(lockedReports, stored)).toEqual([]);
    expect(stored).toEqual({ 'CSM-12:locked-bond': { firstSeenAt: 1 } });
  });

  it('shows unknown with stored entry and props, hides the rest', () => {
    const stored = { 'CSM-1:locked-bond': { firstSeenAt: 1 } };
    const shown = (r: Reports) => visibleOf(r, stored);
    expect(
      shown({ [OP]: { 'locked-bond': { state: 'unknown', props: {} } } }),
    ).toHaveLength(1);
    expect(
      shown({ [OP]: { 'exit-requested': { state: 'unknown', props: {} } } }),
    ).toHaveLength(0);
    expect(
      shown({ [OP]: { 'locked-bond': { state: 'unknown' } } }),
    ).toHaveLength(0);
  });

  it('hides acknowledged alerts until ackedUntil', () => {
    const stored = {
      'CSM-1:locked-bond': { firstSeenAt: 1, ackedUntil: 100 },
    };
    expect(visibleOf(lockedReports, stored, 99)).toHaveLength(0);
    expect(visibleOf(lockedReports, stored, 100)).toHaveLength(1);
  });

  it('sorts important first, then newest first', () => {
    const reports: Reports = {
      [OP]: {
        'normalize-queue': { state: 'active', props: {} },
        'locked-bond': { state: 'active', props: {} },
        'exit-requested': { state: 'active', props: {} },
        'claim-idvtc': { state: 'active', props: {} },
      },
    };
    const stored = {
      'CSM-1:normalize-queue': { firstSeenAt: 5 },
      'CSM-1:locked-bond': { firstSeenAt: 1 },
      'CSM-1:exit-requested': { firstSeenAt: 2 },
      'CSM-1:claim-idvtc': { firstSeenAt: 9 },
    };
    expect(visibleOf(reports, stored).map((a) => a.type)).toEqual([
      'exit-requested',
      'locked-bond',
      'claim-idvtc',
      'normalize-queue',
    ]);
  });
});

describe('acknowledge', () => {
  it('sets ackedUntil on the entry', () => {
    const stored = { 'CSM-1:locked-bond': { firstSeenAt: 1 } };
    const [alert] = visibleOf(lockedReports, stored);
    expect(acknowledge(stored, alert, 50)['CSM-1:locked-bond'].ackedUntil).toBe(
      50,
    );
  });
});

describe('toast queue', () => {
  const normalReports: Reports = {
    [OP]: { 'normalize-queue': { state: 'active', props: {} } },
  };
  const queue = (
    reports: Reports,
    stored: Parameters<typeof selectToastQueue>[1],
    session: Parameters<typeof selectToastQueue>[2] = {},
    route = '/',
    suppressedOf: (t: AlertType) => string[] | undefined = noSuppress,
  ) =>
    selectToastQueue(
      visibleOf(reports, stored),
      stored,
      session,
      route,
      suppressedOf,
    );

  it('closeToast on normal excludes it from the queue but not from visible', () => {
    const stored = { 'CSM-1:normalize-queue': { firstSeenAt: 1 } };
    const [alert] = visibleOf(normalReports, stored);
    const closed = closeToast(stored, {}, alert, 7);
    expect(closed.stored['CSM-1:normalize-queue'].toastClosedAt).toBe(7);
    expect(queue(normalReports, closed.stored)).toEqual([]);
    expect(visibleOf(normalReports, closed.stored)).toHaveLength(1);
  });

  it('closeToast on important is per occurrence', () => {
    const stored = { 'CSM-1:locked-bond': { firstSeenAt: 1 } };
    const [alert] = visibleOf(lockedReports, stored);
    const closed = closeToast(stored, {}, alert, 7);
    expect(closed.sessionClosed).toEqual({ 'CSM-1:locked-bond': 1 });
    expect(queue(lockedReports, stored, closed.sessionClosed)).toEqual([]);

    const reoccurred = { 'CSM-1:locked-bond': { firstSeenAt: 50 } };
    expect(queue(lockedReports, reoccurred, closed.sessionClosed)).toHaveLength(
      1,
    );
  });

  it('suppresses toast on route but keeps it visible', () => {
    const stored = { 'CSM-1:locked-bond': { firstSeenAt: 1 } };
    const suppressed = (t: AlertType) =>
      t === 'locked-bond' ? ['/bond/unlock'] : undefined;
    expect(
      queue(lockedReports, stored, {}, '/bond/unlock', suppressed),
    ).toEqual([]);
    expect(visibleOf(lockedReports, stored)).toHaveLength(1);
    expect(queue(lockedReports, stored, {}, '/', suppressed)).toHaveLength(1);
  });
});

describe('sliceToasts', () => {
  const items = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ id: String(i) }) as Alert);

  it('caps and counts the rest', () => {
    expect(sliceToasts(items(5), 3)).toMatchObject({ more: 2 });
    expect(sliceToasts(items(5), 3).shown).toHaveLength(3);
    expect(sliceToasts(items(5), 1).more).toBe(4);
    expect(sliceToasts(items(2), 3).more).toBe(0);
  });
});

describe('nextAckExpiry', () => {
  it('returns nearest future ackedUntil, ignoring past', () => {
    const stored = {
      a: { firstSeenAt: 1, ackedUntil: 5 },
      b: { firstSeenAt: 1, ackedUntil: 30 },
      c: { firstSeenAt: 1, ackedUntil: 20 },
      d: { firstSeenAt: 1 },
    };
    expect(nextAckExpiry(stored, 10)).toBe(20);
    expect(nextAckExpiry(stored, 30)).toBeUndefined();
  });
});
