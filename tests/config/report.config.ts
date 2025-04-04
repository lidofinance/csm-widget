import { ReporterDescription } from '@playwright/test';
import { widgetFullConfig } from '.';

export const getReportConfig: () => ReporterDescription[] = function () {
  const reporterConfig: ReporterDescription[] = [
    reporters.htmlReporter,
    reporters.consoleReporter,
  ];
  if (process.env.CI) {
    reporterConfig.push(
      reporters.githubReporter,
      reporters.qaseReporter,
      reporters.discordReport,
    );
  }
  return reporterConfig;
};

export const getTestRunName = () => {
  return (
    `${
      process.env.GH_EVENT_NAME === 'schedule' ? 'Schedule Run' : 'Auto Run'
    } ` +
    `[s:@${process.env.TEST_SUITE || 'ALL'}] ` +
    `[t:${process.env.TEST_TAGS || '-'}] ` +
    `[b:${getBranchName()}]` +
    `[w:${process.env.WALLET_NAME || 'metamask'}]`
  );
};

export const getBranchName = () => {
  const branchName =
    process.env.GITHUB_HEAD_REF ||
    process.env.TEST_BRANCH ||
    process.env.GH_BRANCH_REF_NAME ||
    'none';

  return branchName.replace('/', '-');
};

export const getTestRunDescription = () => {
  return (
    `Github run link: ${process.env.GH_ACTION_URL}\n` +
    `Stand url: ${widgetFullConfig.standConfig.standUrl}\n` +
    `Env: ${process.env.STAND_TYPE}`
  );
};

const reporters: {
  htmlReporter: ReporterDescription;
  consoleReporter: ReporterDescription;
  githubReporter: ReporterDescription;
  discordReport: ReporterDescription;
  qaseReporter: ReporterDescription;
} = {
  htmlReporter: ['html', { open: 'never' }],
  consoleReporter: ['list', { printSteps: !process.env.CI }],
  githubReporter: ['github'],
  discordReport: [
    '@lidofinance/discord-reporter',
    {
      enabled: process.env.DISCORD_REPORT_ENABLED,
    },
  ],
  qaseReporter: [
    'playwright-qase-reporter',
    {
      debug: false,
      environment: process.env.STAND_TYPE,
      mode: 'testops', // value 'testops' enables Qase reporter, 'off' disables
      testops: {
        api: {
          token: process.env.QASE_API_TOKEN,
        },
        project: process.env.QASE_PROJECT_ID,
        uploadAttachments: true,
        run: {
          complete: true,
          title: getTestRunName(),
          description: getTestRunDescription(),
        },
        batch: {
          size: 10,
        },
      },
    },
  ],
};
