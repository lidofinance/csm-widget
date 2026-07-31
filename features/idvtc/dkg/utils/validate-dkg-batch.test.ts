import type { FileUploadItemDto } from 'modules/surveys-sdk/generated';
import { validationMessage } from 'shared/hook-form/validation/messages';
import {
  dkgBatchBytes,
  formatMegabytes,
  formatMegabytesFloor,
  MAX_TOTAL_BYTES,
  validateDkgBatch,
} from './validate-dkg-batch';

const fileOfBytes = (
  name: string,
  contentByteLength: number,
): FileUploadItemDto => ({
  name,
  content: { blob: 'y'.repeat(Math.max(0, contentByteLength)) },
});

const tooLargeMessage = validationMessage.dkgBatchTooLarge(
  formatMegabytesFloor(MAX_TOTAL_BYTES),
);

describe('validateDkgBatch', () => {
  it('passes for an empty list', () => {
    expect(dkgBatchBytes([])).toBe(2); // "[]"
    expect(validateDkgBatch([])).toBeUndefined();
  });

  it('passes for a batch comfortably under the cap', () => {
    const files = [fileOfBytes('a.json', 100), fileOfBytes('b.json', 100)];
    expect(dkgBatchBytes(files)).toBeLessThan(MAX_TOTAL_BYTES);
    expect(validateDkgBatch(files)).toBeUndefined();
  });

  it('returns the error copy for a batch over the cap', () => {
    const files = [fileOfBytes('a.json', MAX_TOTAL_BYTES)];
    expect(dkgBatchBytes(files)).toBeGreaterThan(MAX_TOTAL_BYTES);
    expect(validateDkgBatch(files)).toBe(tooLargeMessage);
  });

  it('passes exactly at MAX_TOTAL_BYTES and fails one byte over', () => {
    // Binary-search the padding so JSON.stringify([...]) lands exactly at the cap.
    const build = (padding: number): FileUploadItemDto[] => [
      { name: 'a.json', content: { blob: 'y'.repeat(Math.max(0, padding)) } },
    ];

    let lo = 0;
    let hi = MAX_TOTAL_BYTES;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (dkgBatchBytes(build(mid)) <= MAX_TOTAL_BYTES) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }

    const atCap = build(lo);
    expect(dkgBatchBytes(atCap)).toBeLessThanOrEqual(MAX_TOTAL_BYTES);
    expect(dkgBatchBytes(build(lo + 1))).toBe(MAX_TOTAL_BYTES + 1);
    expect(validateDkgBatch(atCap)).toBeUndefined();
    expect(validateDkgBatch(build(lo + 1))).toBe(tooLargeMessage);
  });

  it('counts long file names toward the total', () => {
    const shortName = [{ name: 'a.json', content: {} }];
    const longName = [{ name: 'a'.repeat(10_000) + '.json', content: {} }];
    expect(dkgBatchBytes(longName)).toBeGreaterThan(
      dkgBatchBytes(shortName) + 9_000,
    );
  });

  it('formatMegabytes rounds up', () => {
    expect(formatMegabytes(MAX_TOTAL_BYTES)).toBe('4.2 MB');
    expect(formatMegabytes(4.15 * 1024 * 1024)).not.toBe('4.1 MB');
  });

  it('formatMegabytesFloor rounds down', () => {
    expect(formatMegabytesFloor(MAX_TOTAL_BYTES)).toBe('4.1 MB');
    expect(formatMegabytesFloor(4.19 * 1024 * 1024)).toBe('4.1 MB');
  });
});
