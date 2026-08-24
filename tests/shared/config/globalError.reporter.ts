import type { Suite, TestError } from '@playwright/test/reporter';
import { SENSITIVE_ENV_KEYS } from './report.config';

const secrets = SENSITIVE_ENV_KEYS.map((key) => process.env[key]).filter(
  (value): value is string => !!value && value.length > 3,
);

const scrub = (text: string) =>
  secrets.reduce((acc, secret) => acc.split(secret).join('***'), text);

/**
 * Prints global errors (globalSetup, globalTeardown, config load) that happen
 * before `onBegin`.
 *
 * Playwright defers `onError` of v1 reporters until `onBegin` (ReporterV2Wrapper),
 * and global setup runs before the "report begin" task — so a failing globalSetup
 * interrupts the run and its error never reaches the reporters wrapped by
 * secret-guard-reporter. The run just exits with code 1 and no message.
 *
 * This reporter declares itself as v2, so `onError` arrives immediately. Values of
 * SENSITIVE_ENV_KEYS are redacted before printing.
 */
export default class GlobalErrorReporter {
  private didBegin = false;

  version() {
    return 'v2' as const;
  }

  onBegin(_suite: Suite) {
    this.didBegin = true;
  }

  onError(error: TestError) {
    // after onBegin the wrapped reporters print errors themselves
    if (this.didBegin) return;

    const details =
      error.stack || error.message || error.value || String(error);
    console.error(`\n[globalError] ${scrub(details)}\n`);
  }

  printsToStdio() {
    return true;
  }
}
