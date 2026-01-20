import { WrappedStats } from 'features/wrapped/data/types';

export type SlideData = Pick<
  WrappedStats,
  | 'totalRewardsETH'
  | 'avgPerformance'
  | 'activeDays'
  | 'proposedBlocksCount'
  | 'uploadedKeysCount'
  | 'queueDays'
  | 'hasICS'
>;

/**
 * Encodes slide data into URL-safe Base64 string
 * Binary layout: 19 bytes
 * - totalRewardsETH: uint64 (8 bytes) - wei amount
 * - avgPerformance: uint16 (2 bytes) - basis points
 * - activeDays: uint16 (2 bytes)
 * - proposedBlocksCount: uint16 (2 bytes)
 * - uploadedKeysCount: uint16 (2 bytes)
 * - queueDays: uint16 (2 bytes)
 * - hasICS: uint8 (1 byte) - 0 or 1
 */
export const encodeSlideData = (data: SlideData): string => {
  const buffer = new ArrayBuffer(19);
  const view = new DataView(buffer);
  let offset = 0;

  // totalRewardsETH as uint64 (wei)
  view.setBigUint64(offset, data.totalRewardsETH, false);
  offset += 8;

  // avgPerformance as uint16 (basis points)
  view.setUint16(offset, Number(data.avgPerformance), false);
  offset += 2;

  // activeDays as uint16
  view.setUint16(offset, data.activeDays, false);
  offset += 2;

  // proposedBlocksCount as uint16
  view.setUint16(offset, data.proposedBlocksCount, false);
  offset += 2;

  // uploadedKeysCount as uint16
  view.setUint16(offset, data.uploadedKeysCount, false);
  offset += 2;

  // queueDays as uint16
  view.setUint16(offset, data.queueDays, false);
  offset += 2;

  // hasICS as uint8 (0 or 1)
  view.setUint8(offset, data.hasICS ? 1 : 0);

  return bufferToBase64Url(buffer);
};

/**
 * Decodes URL-safe Base64 string back to slide data
 * @throws Error if hash is invalid or decoding fails
 */
export const decodeSlideData = (hash: string): SlideData => {
  try {
    const buffer = base64UrlToBuffer(hash);

    if (buffer.byteLength !== 19) {
      throw new Error(
        `Invalid buffer length: expected 19, got ${buffer.byteLength}`,
      );
    }

    const view = new DataView(buffer);
    let offset = 0;

    const totalRewardsETH = view.getBigUint64(offset, false);
    offset += 8;

    const avgPerformance = BigInt(view.getUint16(offset, false));
    offset += 2;

    const activeDays = view.getUint16(offset, false);
    offset += 2;

    const proposedBlocksCount = view.getUint16(offset, false);
    offset += 2;

    const uploadedKeysCount = view.getUint16(offset, false);
    offset += 2;

    const queueDays = view.getUint16(offset, false);
    offset += 2;

    const hasICS = view.getUint8(offset) === 1;

    return {
      totalRewardsETH,
      avgPerformance,
      activeDays,
      proposedBlocksCount,
      uploadedKeysCount,
      queueDays,
      hasICS,
    };
  } catch (error) {
    throw new Error(
      `Failed to decode slide data: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};

/**
 * Converts ArrayBuffer to URL-safe Base64 string (no padding)
 */
const bufferToBase64Url = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * Converts URL-safe Base64 string back to ArrayBuffer
 */
const base64UrlToBuffer = (base64url: string): ArrayBuffer => {
  // Convert URL-safe chars back to standard Base64
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if needed
  while (base64.length % 4) {
    base64 += '=';
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};
