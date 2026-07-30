import type { Reporter, TestError } from '@playwright/test/reporter';
import {
  collectSensitiveValues,
  scrubString,
} from '@lidofinance/secret-guard-reporter/dist/src/scrub.js';

import { SENSITIVE_ENV_KEYS } from './report.config';

class FatalErrorReporter implements Reporter {
  private readonly secrets = collectSensitiveValues(SENSITIVE_ENV_KEYS);

  onError(error: TestError) {
    const text = error.stack || error.message || String(error);
    console.error('[fatal]', scrubString(text, this.secrets));
  }
}
export default FatalErrorReporter;
