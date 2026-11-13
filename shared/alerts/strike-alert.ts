import { KEY_STATUS, type KeyWithStatus } from '@lidofinance/lido-csm-sdk';

export const selectStruckPubkeys = (
  keys: Pick<KeyWithStatus, 'pubkey' | 'strikes' | 'statuses'>[],
  max = 5,
): string[] =>
  keys
    .filter(
      (key) =>
        key.statuses.includes(KEY_STATUS.WITH_STRIKES) &&
        Number(key.strikes?.[0]) > 0,
    )
    .slice(0, max)
    .map((key) => key.pubkey);

export const getLatestFrameRange = (info: {
  lastReport: number;
  frameDuration: number;
}): { start: number; end: number } => ({
  start: info.lastReport - info.frameDuration,
  end: info.lastReport,
});

export const getStrikeDismissKey = (
  operator: string,
  lastReport: number,
): string => `alert-key-strike-dismissed-${operator}-${lastReport}`;
