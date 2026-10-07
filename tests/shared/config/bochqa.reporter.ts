import { Logger } from '@nestjs/common';
import type {
  FullConfig,
  FullResult,
  Reporter,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

export type BochqaReporterOptions = {
  appId: number;
  launchName?: string;
};

const UPLOAD_CLIENT = 'bochqa-reporter@1.0.0';
const QASE_ID = /\s*\(Qase ID: ([\d,]+)\)/;

const env = process.env;
const logger = new Logger('BochqaReporter');

/**
 * Uploads the launch and every test attempt to ClickHouse (bochqa.launches,
 * bochqa.tests) over the HTTP interface. Does nothing without BOCHQA_URL and
 * never fails the run — an upload error is only logged.
 */
export default class BochqaReporter implements Reporter {
  private readonly rows: Record<string, unknown>[] = [];
  private framework = 'playwright';

  constructor(private options: BochqaReporterOptions) {}

  onBegin(config: FullConfig) {
    this.framework = `playwright@${config.version}`;
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // suite() puts epic → feature → story into QaseSuite annotations
    const levels = test.annotations
      .filter((annotation) => annotation.type === 'QaseSuite')
      .map((annotation) => annotation.description ?? '');

    this.rows.push({
      test_case_id: Number(test.title.match(QASE_ID)?.[1].split(',')[0] ?? 0),
      test_case_name: test.title.replace(QASE_ID, ''),
      history_id: test.id,
      retry: result.retry,
      job_name: env.JOB_CUSTOM_NAME || env.GITHUB_JOB || '',
      framework: this.framework,
      status: toStatus(result.status),
      started_at: result.startTime.toISOString(),
      finished_at: new Date(
        result.startTime.getTime() + result.duration,
      ).toISOString(),
      duration: result.duration,
      epic: levels[0] ?? '',
      feature: levels.length === 3 ? levels[1] : '',
      story: levels.length > 1 ? levels[levels.length - 1] : '',
      tags: test.tags,
    });
  }

  async onEnd(result: FullResult) {
    if (!env.BOCHQA_URL) {
      if (env.CI) logger.log('BOCHQA_URL is not set, skip upload');
      return;
    }

    // the Qase reporter puts its run id into the environment once it is created
    const common = {
      launch_id: Number(
        env.QASE_TESTOPS_RUN_ID || env.GITHUB_RUN_ID || Date.now(),
      ),
      app_id: this.options.appId,
      pipeline_id: Number(env.GITHUB_RUN_ID || 0),
      pipeline_source: env.GITHUB_EVENT_NAME || 'local',
      branch: env.GITHUB_HEAD_REF || env.GITHUB_REF_NAME || '',
      commit_sha: env.GITHUB_SHA || '',
      environment: env.STAND_TYPE || '',
      upload_client: UPLOAD_CLIENT,
    };

    const launch = {
      ...common,
      launch_name: this.options.launchName ?? '',
      app_version: env.APP_VERSION || '',
      created_at: result.startTime.toISOString(),
      duration: Math.round(result.duration),
      status: result.status,
      tags: env.TEST_TAGS ? env.TEST_TAGS.split(',') : [],
    };

    const tests = this.rows.map((row) => ({
      ...common,
      ...row,
      // the workflow passes job.check_run_id, GitHub has no env var for it
      job_id: Number(env.GH_JOB_ID || 0),
    }));

    const withoutQaseId = this.rows.filter((row) => !row.test_case_id).length;
    if (withoutQaseId) {
      logger.warn(
        `${withoutQaseId} test results have no Qase ID, test_case_id = 0`,
      );
    }

    logger.log(
      `uploading launch ${launch.launch_id} (app ${launch.app_id}, ` +
        `${launch.environment || 'no env'}, ${launch.status}) with ` +
        `${tests.length} test results`,
    );

    const startedAt = Date.now();
    try {
      await insert('bochqa.launches', [launch]);
      await insert('bochqa.tests', tests);
      logger.log(`uploaded in ${Date.now() - startedAt} ms`);
    } catch (error) {
      logger.error(`upload failed: ${error}`);
    }
  }

  printsToStdio() {
    return false;
  }
}

const toStatus = (status: TestResult['status']) => {
  if (status === 'passed' || status === 'skipped') return status;
  if (status === 'interrupted') return 'broken';
  return 'failed';
};

const insert = async (table: string, rows: Record<string, unknown>[]) => {
  if (rows.length === 0) return;

  const url = new URL(env.BOCHQA_URL as string);
  url.searchParams.set('query', `INSERT INTO ${table} FORMAT JSONEachRow`);
  // dates go as ISO UTC strings, ClickHouse converts them to the column timezone
  url.searchParams.set('date_time_input_format', 'best_effort');

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-ClickHouse-User': env.BOCHQA_USER || 'default',
      'X-ClickHouse-Key': env.BOCHQA_PASSWORD || '',
    },
    body: rows.map((row) => JSON.stringify(row)).join('\n'),
  });

  if (!response.ok) {
    throw new Error(`${table}: ${response.status} ${await response.text()}`);
  }
};
