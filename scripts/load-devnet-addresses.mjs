import { readFileSync } from 'fs';
import path from 'path';

/**
 * Reads the devnet addresses JSON; null when unset or unreadable.
 * @param {string | undefined} filePath
 * @returns {Record<string, unknown> | null}
 */
export const loadDevnetAddresses = (filePath) => {
  if (!filePath) return null;
  try {
    return JSON.parse(readFileSync(path.resolve(filePath), 'utf-8'));
  } catch (e) {
    console.warn('Failed to load devnet addresses:', e.message);
    return null;
  }
};
