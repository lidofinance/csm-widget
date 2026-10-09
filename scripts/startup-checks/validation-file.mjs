import { promises as fs } from 'fs';

const VALIDATION_FILE_TIMEOUT_MS = 10_000;

const isValidValidationFile = (data) => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'addresses' in data &&
    Array.isArray(data.addresses) &&
    data.addresses.every((addr) => typeof addr === 'string')
  );
};

const checkValidationFile = async (filePath) => {
  try {
    console.info(`[checkValidationFile] Checking validation file: ${filePath}`);

    // Check if file exists and is readable
    const stats = await fs.stat(filePath);
    if (!stats.isFile()) {
      throw new Error(`Path exists but is not a file: ${filePath}`);
    }

    // Read file content
    const raw = await fs.readFile(filePath, 'utf8');

    // Handle empty files (valid case)
    if (raw.trim() === '') {
      console.info(
        '[checkValidationFile] Empty validation file - treating as valid with no addresses',
      );
      return { success: true, addresses: [] };
    }

    // Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (parseError) {
      throw new Error(`Invalid JSON format: ${parseError.message}`);
    }

    // Validate structure
    if (!isValidValidationFile(parsed)) {
      console.error(
        '[checkValidationFile] Invalid validation file format. Expected: { addresses: string[] }',
      );
      throw new Error(
        'Invalid validation file format. Expected: { addresses: string[] }',
      );
    }

    console.info(
      `[checkValidationFile] Validation file is valid with ${parsed.addresses.length} addresses`,
    );
    return { success: true, addresses: parsed.addresses };
  } catch (error) {
    console.error(
      `[checkValidationFile] Validation file check failed: ${error.message}`,
    );
    return { success: false, error: error.message };
  }
};

export const startupCheckValidationFile = async () => {
  console.info(
    '[startupCheckValidationFile] Starting validation file checks...',
  );

  const filePath = process.env.VALIDATION_FILE_PATH;
  if (!filePath?.trim()) {
    console.info(
      '[startupCheckValidationFile] No VALIDATION_FILE_PATH specified - skipping validation file check',
    );
    return { success: true, skipped: true };
  }

  let timer;
  const timeout = new Promise((_resolve, reject) => {
    timer = setTimeout(() => {
      reject(
        new Error(
          `[startupCheckValidationFile] Validation file check timed out after ${VALIDATION_FILE_TIMEOUT_MS}ms`,
        ),
      );
    }, VALIDATION_FILE_TIMEOUT_MS);
    timer.unref();
  });
  const result = await Promise.race([
    checkValidationFile(filePath),
    timeout,
  ]).finally(() => clearTimeout(timer));
  if (!result.success) {
    throw new Error(
      `[startupCheckValidationFile] Validation file check failed: ${result.error}`,
    );
  }
  return result;
};
