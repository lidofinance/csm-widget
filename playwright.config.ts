import type { PlaywrightTestConfig } from '@playwright/test';
import { widgetFullConfig } from 'tests/csm-widget/config';
import { getReportConfig } from 'tests/csm-widget/config/report.config';
import { storageState } from 'tests/csm-widget/config/storageState';
import { prepareGrep } from 'tests/shared/helpers/tests';

// TODO: move it pls
export const httpCredentials =
  process.env.PREVIEW_STAND_LOGIN && process.env.PREVIEW_STAND_PASSWORD
    ? {
        username: process.env.PREVIEW_STAND_LOGIN,
        password: process.env.PREVIEW_STAND_PASSWORD,
      }
    : undefined;

const config: PlaywrightTestConfig = {
  testDir: './tests/csm-widget/tests',
  timeout: 180 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: getReportConfig(),
  use: {
    storageState,
    headless: false,
    actionTimeout: 15000,
    screenshot: { fullPage: true, mode: 'only-on-failure' },
    baseURL: widgetFullConfig.standConfig.standUrl,
    trace: 'on-first-retry',
    permissions: ['clipboard-read'],
    contextOptions: {
      reducedMotion: 'reduce',
    },
    httpCredentials: httpCredentials,
  },
  projects: [
    {
      name: 'widget',
      testDir: './tests/csm-widget/tests',
      grep: prepareGrep(process.env.TEST_TAGS),
      use: {
        // @ts-expect-error because pw doesnt have custom types
        useFork: process.env.USE_FORK === 'true',
      },
    },
  ],
  globalSetup: './tests/csm-widget/config/globalSetup.ts',
  globalTeardown: './tests/csm-widget/config/globalTeardown.ts',
};

export default config;
