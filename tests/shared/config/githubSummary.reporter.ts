import { appendFileSync } from 'fs';

import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

export interface GithubSummaryReporterOptions {
  qaseProjectName?: string;
}

const QASE_APP_URL = 'https://app.qase.io';

/**
 * Appends the test run results to the GitHub Actions job summary.
 *
 * Results are counted as tests finish. The Qase run link is added when the
 * project code is passed and the Qase reporter has created a run — it puts the
 * run id into the environment. Does nothing outside GitHub Actions.
 */
export default class GithubSummaryReporter implements Reporter {
  private readonly runInfo = {
    passed: 0,
    failed: 0,
    flaky: 0,
    skipped: 0,
  };

  constructor(private options: GithubSummaryReporterOptions = {}) {}

  onTestEnd(test: TestCase, result: TestResult) {
    switch (result.status) {
      case 'passed':
        if (result.retry > 0) this.runInfo.flaky++;
        else this.runInfo.passed++;
        break;
      case 'failed':
      case 'timedOut':
      case 'interrupted':
        if (result.retry === test.retries) this.runInfo.failed++;
        break;
      case 'skipped':
        this.runInfo.skipped++;
        break;
    }
  }

  onEnd(): void {
    const summaryFile = process.env.GITHUB_STEP_SUMMARY;
    if (!summaryFile) return;

    const lines = [...this.getResultLines(), ...this.getQaseRunLine()];

    appendFileSync(
      summaryFile,
      `\n📊 Test run results\n${lines.join('\n')}\n`,
      'utf8',
    );
  }

  private getResultLines(): string[] {
    const lines = [
      { icon: '✅', title: 'passed', count: this.runInfo.passed },
      { icon: '🛑', title: 'failed', count: this.runInfo.failed },
      { icon: '⚠️', title: 'flaky', count: this.runInfo.flaky },
      { icon: '⏭️', title: 'skipped', count: this.runInfo.skipped },
    ]
      .filter(({ count }) => count > 0)
      .map(({ icon, title, count }) => `- ${icon} ${count} ${title}`);

    return lines.length > 0 ? lines : ['- ❗ No tests were run'];
  }

  private getQaseRunLine(): string[] {
    const runId = process.env.QASE_TESTOPS_RUN_ID;
    if (!runId || !this.options.qaseProjectName) return [];

    const runUrl = `${QASE_APP_URL}/run/${this.options.qaseProjectName}/dashboard/${runId}`;
    return [`- 🔗 Qase test run: ${runUrl}`];
  }
}
