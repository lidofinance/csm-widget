import { BrowserService } from '@lidofinance/browser-service';
import { test as base } from '@playwright/test';
import { widgetFullConfig } from 'tests/config';
import { WidgetService } from 'tests/pages/widget.service';

export const REFUSE_CF_BLOCK_COOKIE = [
  {
    name: process.env.REFUSE_CF_BLOCK_NAME || '',
    value: process.env.REFUSE_CF_BLOCK_VALUE || '',
    path: '/',
    domain: '.testnet.fi', // @TODO: must to changing to hoodi
  },
];

type Fixtures = object;

export const test = base.extend<
  Fixtures,
  {
    browserWithWallet: BrowserService;
    widgetService: WidgetService;
  }
>({
  page: async ({ page }, use) => {
    if (process.env.REFUSE_CF_BLOCK_NAME && process.env.REFUSE_CF_BLOCK_VALUE) {
      await page.context().addCookies(REFUSE_CF_BLOCK_COOKIE);
    }
    await use(page);
  },
  browserWithWallet: [
    // eslint-disable-next-line
    async ({}, use) => {
      const browserService = new BrowserService({
        networkConfig: widgetFullConfig.standConfig.networkConfig,
        walletConfig: widgetFullConfig.walletConfig,
        nodeConfig: { rpcUrlToMock: '**/api/rpc?chainId=1' },
        enableBrowserContext: true,
      });
      await browserService.initWalletSetup();

      await use(browserService);
      // Teardown will be call only when all tests done or when test failed.
      await browserService.teardown();
    },
    { scope: 'worker' },
  ],
  widgetService: [
    async ({ browserWithWallet }, use) => {
      await use(
        new WidgetService(
          await browserWithWallet.getBrowserContextPage(),
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
