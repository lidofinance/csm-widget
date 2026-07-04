/* eslint-disable no-console */
// Refreshes the vendored Surveys API OpenAPI spec consumed by `yarn survey:codegen`.
// Pulls the live spec (NestJS `/api-json`) and writes it to the spec file.
//
//   SURVEYS_OPENAPI_URL  override the source URL (default: local backend)
//
// Usage: `yarn survey:openapi:pull` (→ `node scripts/pull-survey-openapi.mjs`).
import { mkdir, rename, unlink, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

const DEFAULT_URL = 'http://localhost:3003/api-json';
const OUTPUT = 'modules/surveys-sdk/openapi/survey-api.json';
const TIMEOUT_MS = 10_000;

const fail = (message, hint) => {
  console.error(`✖ ${message}`);
  if (hint) console.error(`  ${hint}`);
  process.exit(1);
};

const main = async () => {
  const url = process.env.SURVEYS_OPENAPI_URL || DEFAULT_URL;
  const outPath = resolve(OUTPUT);
  const tmpPath = `${outPath}.tmp`;

  console.info(`Pulling survey OpenAPI spec from ${url}`);

  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (error) {
    const reason = error.name === 'TimeoutError' ? `no response within ${TIMEOUT_MS}ms` : error.message;
    fail(`Could not reach ${url} (${reason})`, 'Is the surveys backend running? Set SURVEYS_OPENAPI_URL to override.');
  }

  if (!response.ok) {
    fail(`Request failed: ${response.status} ${response.statusText}`);
  }

  let spec;
  try {
    spec = await response.json();
  } catch (error) {
    fail(`Response is not valid JSON: ${error.message}`);
  }

  // Sanity-check that we actually fetched an OpenAPI document and not, say, an
  // HTML error page served with a 200 — every OpenAPI doc advertises its version.
  if (!spec || typeof spec.openapi !== 'string') {
    fail('Response does not look like an OpenAPI document (missing "openapi" field)');
  }

  // Pretty-print (2-space, matching .editorconfig) with a trailing newline so the
  // committed spec yields reviewable diffs instead of one 60KB line.
  const json = `${JSON.stringify(spec, null, 2)}\n`;

  await mkdir(dirname(outPath), { recursive: true });
  // Atomic write: stage to a temp file, then rename into place so a failed write
  // can never leave a truncated spec behind.
  try {
    await writeFile(tmpPath, json, 'utf-8');
    await rename(tmpPath, outPath);
  } catch (error) {
    await unlink(tmpPath).catch(() => {});
    fail(`Failed to write ${OUTPUT}: ${error.message}`);
  }

  console.info(`✔ Saved OpenAPI ${spec.openapi} spec → ${relative(process.cwd(), outPath)}`);
  console.info('  Next: run `yarn survey:codegen` to regenerate the SDK.');
};

main().catch((error) => fail(`Unexpected error: ${error.message}`));
