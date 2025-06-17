import { BrowserService } from '@lidofinance/browser-service';
import { test as base } from '@playwright/test';
import { widgetFullConfig } from 'tests/config';
import { REFUSE_CF_BLOCK_COOKIE } from 'tests/config/storageState';
import { WidgetService } from 'tests/services/widget.service';

type WorkerFixtures = {
  secretPhrase: string;
  browserWithWallet: BrowserService;
  widgetService: WidgetService;
};

export const test = base.extend<object, WorkerFixtures>({
  secretPhrase: [
    // eslint-disable-next-line no-empty-pattern
    async ({}, use) => {
      await use(widgetFullConfig.accountConfig.SECRET_PHRASE);
    },
    { scope: 'worker' },
  ],
  browserWithWallet: [
    async ({ secretPhrase }, use) => {
      const browserService = new BrowserService({
        networkConfig: widgetFullConfig.standConfig.networkConfig,
        accountConfig: {
          ...widgetFullConfig.accountConfig,
          SECRET_PHRASE: secretPhrase,
        },
        walletConfig: widgetFullConfig.walletConfig,
        nodeConfig: { rpcUrlToMock: '**/api/rpc?chainId=1' },
        browserOptions: {
          cookies: REFUSE_CF_BLOCK_COOKIE,
        },
      });

      await browserService.initWalletSetup();

      await use(browserService);

      await browserService.teardown();
    },
    { scope: 'worker' },
  ],
  widgetService: [
    async ({ browserWithWallet }, use) => {
      await use(
        new WidgetService(
          browserWithWallet.getBrowserContextPage(),
          browserWithWallet.getWalletPage(),
        ),
      );
    },
    { scope: 'worker' },
  ],
});

/**
 * Skip a specific test before run. Playwright will not run the test with call `skipIf` if condition will be true.
 *
 * To skip a test use:
 * - `test(title, {tag: ['@tag'], ...skipIf()}, callback)`
 *
 * Example:
 *
 * ```ts
 *  test(
 *    'Title of test',
 *    {
 *      tag: ['@tag'],
 *      ...skipIf(
 *        WIDGET_CONFIG.STAND_CONFIG.chainId !== 1,
 *        "Holesky and others doesn't support ENS",
 *      ),
 *    },
 *    async () => {
 *      console.log();
 *    },
 *  );
 *```
 *
 * @param condition - Test is marked as "skipped" when the condition is `true`.
 * @param message  - Message that will be reflected in a test.
 * @returns
 */
export const skipIf = (condition: boolean, message: string) => {
  return condition
    ? {
        annotation: {
          type: 'skip',
          description: message,
        },
      }
    : {};
};
