import type { Reporter, Suite, TestRun } from '@playwright/test/reporter';
import { widgetFullConfig } from 'tests/cm-widget/config';

export default class EnvironmentSkipper implements Reporter {
  async preprocess({
    suite,
    testRun,
  }: {
    suite: Suite;
    testRun: TestRun;
  }): Promise<void> {
    for (const test of suite.allTests()) {
      const standType = widgetFullConfig.standConfig.standType;
      const tags = test.tags.map((tag) => tag.replace('@', '').toLowerCase());

      if (tags.includes(`no${standType.toLowerCase()}`)) {
        testRun.skip(test, `Skipped on ${standType} stand`);
      }
    }
  }
}
