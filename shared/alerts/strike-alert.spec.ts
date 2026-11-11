import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';

import {
  getLatestFrameRange,
  getStrikeDismissKey,
  selectStruckPubkeys,
} from './strike-alert';

const key = (
  pubkey: string,
  strikes: number[] = [],
  statuses: KEY_STATUS[] = [KEY_STATUS.WITH_STRIKES],
) =>
  ({ pubkey, strikes, statuses }) as Parameters<
    typeof selectStruckPubkeys
  >[0][number];

describe('selectStruckPubkeys', () => {
  it('returns [] without strikes', () => {
    expect(selectStruckPubkeys([key('0xa'), key('0xb', [0, 0])])).toEqual([]);
  });

  it('excludes a strike only in an older frame', () => {
    expect(selectStruckPubkeys([key('0xa', [0, 1])])).toEqual([]);
  });

  it('excludes a struck key without the withStrikes status', () => {
    expect(
      selectStruckPubkeys([key('0xa', [1], [KEY_STATUS.EXITING])]),
    ).toEqual([]);
  });

  it('keeps the first 5 in input order', () => {
    const keys = Array.from({ length: 7 }, (_, i) => key(`0x${i}`, [1]));
    expect(selectStruckPubkeys(keys)).toEqual([
      '0x0',
      '0x1',
      '0x2',
      '0x3',
      '0x4',
    ]);
  });
});

describe('getLatestFrameRange', () => {
  it('spans one frame ending at the last report', () => {
    expect(
      getLatestFrameRange({ lastReport: 1000, frameDuration: 300 }),
    ).toEqual({
      start: 700,
      end: 1000,
    });
  });
});

describe('getStrikeDismissKey', () => {
  it('differs per lastReport for one operator', () => {
    expect(getStrikeDismissKey('csm-1', 1)).not.toBe(
      getStrikeDismissKey('csm-1', 2),
    );
  });
});
