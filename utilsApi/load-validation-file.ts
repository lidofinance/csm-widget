import Metrics from 'utilsApi/metrics';
import { promises as fs } from 'fs';
import { config } from 'config';
import getConfigNext from 'next/config';
import type { AddressValidationFile } from 'utils';

const { serverRuntimeConfig } = getConfigNext();

const ERROR_BUCKET = {
  STAT_FAILED: 'stat_failed',
  READ_FAILED: 'read_failed',
  INVALID_JSON: 'invalid_json',
  INVALID_FORMAT: 'invalid_format',
} as const;

const EMPTY: AddressValidationFile = { addresses: [] };

type CacheEntry = {
  path: string;
  mtimeMs: number;
  data: AddressValidationFile;
};

let cache: CacheEntry | null = null;

const isValidValidationFile = (
  data: unknown,
): data is AddressValidationFile => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'addresses' in data &&
    Array.isArray((data as { addresses: unknown }).addresses) &&
    (data as { addresses: unknown[] }).addresses.every(
      (addr) => typeof addr === 'string',
    )
  );
};

const getValidationFilePath = (): string | undefined => {
  return (
    process.env.VALIDATION_FILE_PATH ||
    config.validationFilePath ||
    serverRuntimeConfig.validationFilePath
  );
};

const messageOf = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const reportError = (bucket: string, details: string) => {
  console.error(`[loadValidationFile] ${bucket}: ${details}`);
  Metrics.request.validationFileLoadError.labels({ error: bucket }).inc(1);
};

export const loadValidationFile = async (): Promise<AddressValidationFile> => {
  const filePath = getValidationFilePath();

  if (!filePath) {
    console.warn(
      '[loadValidationFile] No validation file path provided in env or config',
    );
    return EMPTY;
  }

  let mtimeMs: number;
  try {
    const stats = await fs.stat(filePath);
    mtimeMs = stats.mtimeMs;
  } catch (error) {
    reportError(ERROR_BUCKET.STAT_FAILED, `${filePath}: ${messageOf(error)}`);
    return EMPTY;
  }

  if (cache && cache.path === filePath && cache.mtimeMs === mtimeMs) {
    return cache.data;
  }

  let raw: string;
  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    reportError(ERROR_BUCKET.READ_FAILED, `${filePath}: ${messageOf(error)}`);
    return EMPTY;
  }

  if (raw.trim() === '') {
    cache = { path: filePath, mtimeMs, data: EMPTY };
    return EMPTY;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    reportError(ERROR_BUCKET.INVALID_JSON, messageOf(error));
    return EMPTY;
  }

  if (!isValidValidationFile(parsed)) {
    reportError(
      ERROR_BUCKET.INVALID_FORMAT,
      'expected { addresses: string[] }',
    );
    return EMPTY;
  }

  console.info(
    `[loadValidationFile] parsed with ${parsed.addresses.length} addresses`,
  );

  cache = { path: filePath, mtimeMs, data: parsed };
  return parsed;
};
