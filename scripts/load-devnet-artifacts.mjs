import fs from 'fs';
import path from 'path';

/**
 * @typedef {{ module: string | null, artifacts: Record<string, unknown> }} DevnetArtifactsEntry
 */

/**
 * Parses `[MODULE=]path,[MODULE=]path` and reads each deploy-artifact JSON.
 * Unreadable entries are skipped with a warning; null when unset or nothing loaded.
 * @param {string | undefined} envValue
 * @returns {DevnetArtifactsEntry[] | null}
 */
export const loadDevnetArtifacts = (envValue) => {
  const result = [];

  for (const raw of (envValue ?? '').split(',')) {
    const entry = raw.trim();
    if (!entry) continue;

    const separator = entry.indexOf('=');
    const moduleName = separator > 0 ? entry.slice(0, separator).trim() : null;
    const filePath = path.resolve(
      separator > 0 ? entry.slice(separator + 1).trim() : entry,
    );

    try {
      const artifacts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      result.push({ module: moduleName, artifacts });
    } catch (e) {
      console.warn(`Failed to load devnet addresses from ${filePath}:`, e.message);
    }
  }

  return result.length > 0 ? result : null;
};
