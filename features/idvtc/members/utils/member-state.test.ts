import type { RotationRequestDto } from 'modules/surveys-sdk/generated';
import { collectTakenAddresses, deriveMemberCardState } from './member-state';

const X = '0xeee0000000000000000000000000000000000005';
const Y = '0xfff0000000000000000000000000000000000006';

const req = (over: Partial<RotationRequestDto> = {}): RotationRequestDto => ({
  id: 1,
  nodeOperatorId: '17',
  submitterAddress: '0x0',
  slots: [{}, {}, {}, {}],
  status: 'REVIEW',
  superseded: false,
  comments: { slots: [null, null, null, null] },
  createdAt: '2026-07-19T00:00:00Z',
  updatedAt: '2026-07-19T00:00:00Z',
  ...over,
});

describe('deriveMemberCardState', () => {
  it('is idle without a request', () => {
    expect(deriveMemberCardState(0, null, null)).toEqual({ kind: 'idle' });
  });

  it('is idle when the slot has no proposal', () => {
    const r = req({ slots: [{ newAddress: X }, {}, {}, {}] });
    expect(deriveMemberCardState(1, r, null)).toEqual({ kind: 'idle' });
  });

  it('editing wins over any request state', () => {
    const r = req({ slots: [{ newAddress: X }, {}, {}, {}] });
    expect(deriveMemberCardState(0, r, 0)).toEqual({ kind: 'editing' });
  });

  it('is pending for a proposed slot under REVIEW', () => {
    const r = req({ slots: [{}, { newAddress: X }, {}, {}] });
    expect(deriveMemberCardState(1, r, null)).toEqual({
      kind: 'pending',
      proposed: { newAddress: X },
    });
  });

  it('is rejected with slot comment and request reason', () => {
    const r = req({
      status: 'REJECTED',
      slots: [{}, { newAddress: X }, {}, {}],
      comments: { reason: 'bad batch', slots: [null, 'wrong sig', null, null] },
    });
    expect(deriveMemberCardState(1, r, null)).toEqual({
      kind: 'rejected',
      proposed: { newAddress: X },
      comment: 'wrong sig',
      reason: 'bad batch',
    });
  });
});

describe('collectTakenAddresses', () => {
  const active = ['0xa1', '0xa2'];

  it('returns actives only when there is no request', () => {
    expect(collectTakenAddresses(active, null, 0)).toEqual(active);
  });

  it('adds other slots’ REVIEW proposals, excluding the given slot', () => {
    const r = req({ slots: [{ newAddress: X }, { newAddress: Y }, {}, {}] });
    expect(collectTakenAddresses(active, r, 0)).toEqual([...active, Y]);
  });

  it('ignores proposals of a REJECTED request (not a merge base)', () => {
    const r = req({
      status: 'REJECTED',
      slots: [{ newAddress: X }, {}, {}, {}],
    });
    expect(collectTakenAddresses(active, r, 3)).toEqual(active);
  });
});
