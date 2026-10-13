import { appendFileSync } from 'fs';
import path from 'path';

import { Reporter, TestCase, TestResult } from '@playwright/test/reporter';

export interface GithubSummaryReporterOptions {
  qaseProjectName?: string;
}

const QASE_APP_URL = 'https://app.qase.io';
// `qase(id, title)` appends this to the test title
const QASE_ID_MARK = '(Qase ID:';

/**
 * Appends the test run results to the GitHub Actions job summary.
 *
 * Results are counted as tests finish. The Qase run link is added when the
 * project code is passed and the Qase reporter has created a run — it puts the
 * run id into the environment. Tests without a Qase ID are listed, so the IDs
 * the Qase reporter created for them can be copied back into the code. Does
 * nothing outside GitHub Actions.
 */
export default class GithubSummaryReporter implements Reporter {
  private readonly runInfo = {
    passed: 0,
    failed: 0,
    xFail: 0,
    flaky: 0,
    skipped: 0,
  };
  // keyed by test id: a retried test ends more than once
  private readonly testsWithoutQaseId = new Map<string, string>();

  constructor(private options: GithubSummaryReporterOptions = {}) {}

  onTestEnd(test: TestCase, result: TestResult) {
    if (!test.title.includes(QASE_ID_MARK)) {
      this.testsWithoutQaseId.set(test.id, formatTest(test));
    }

    switch (result.status) {
      case 'passed':
        if (result.retry > 0) this.runInfo.flaky++;
        else this.runInfo.passed++;
        break;
      case 'failed':
      case 'timedOut':
      case 'interrupted':
        if (test.outcome() === 'expected') {
          this.runInfo.xFail++;
          break;
        }
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

    const lines = [
      ...this.getResultLines(),
      ...this.getQaseRunLine(),
      ...this.getWithoutQaseIdLines(),
    ];

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
      { icon: '🚩', title: 'xfail', count: this.runInfo.xFail },
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

  private getWithoutQaseIdLines(): string[] {
    if (this.testsWithoutQaseId.size === 0) return [];

    return [
      `\n🆕 Tests without Qase ID (${this.testsWithoutQaseId.size})`,
      ...[...this.testsWithoutQaseId.values()].map((test) => `- ${test}`),
    ];
  }
}

const formatTest = (test: TestCase) => {
  const suitePath = test.annotations
    .filter(({ type }) => type === 'QaseSuite')
    .map(({ description }) => description);
  const location = `${path.relative(process.cwd(), test.location.file)}:${test.location.line}`;

  return `${[...suitePath, test.title].join(' / ')} (\`${location}\`)`;
};
