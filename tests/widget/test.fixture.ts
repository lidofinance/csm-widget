/* eslint-disable no-empty-pattern */
import { BrowserService } from '@lidofinance/browser-service';
import { test as base } from '@playwright/test';
import { widgetFullConfig } from 'tests/config';
import { IConfig } from 'tests/config/configs/base.config';
import { REFUSE_CF_BLOCK_COOKIE } from 'tests/config/storageState';
import { LidoSDKClient } from 'tests/services/csmSDK.client';
import { SdkService } from 'tests/services/ethereumSDK.client';
import { WidgetService } from 'tests/services/widget.service';
import { mnemonicToAccount } from 'viem/accounts';
import { FORK_WARM_UP_TIMEOUT } from 'tests/consts/timeouts';
import ForkActionsService from 'tests/services/forkActions.service';

type WorkerFixtures = {
  // fixture-options
  secretPhrase: string;
  useFork: boolean;

  browserWithWallet: BrowserService;
  widgetService: WidgetService;
  csmSDK: LidoSDKClient;
  ethereumSDK: SdkService;
  forkActionService: ForkActionsService;
};

export const test = base.extend<{ widgetConfig: IConfig }, WorkerFixtures>({
  // fixture-options
  useFork: [
    async ({}, use) => {
      await use(false);
    },
    { scope: 'worker', option: true },
  ],
  forkActionService: [
    async ({}, use) => {
      const svc = new ForkActionsService({
        cwd: process.env.JUST_DIR || './community-staking-module',
      });
      await use(svc);
    },
    { scope: 'worker' },
  ],
  secretPhrase: [
    async ({}, use) => {
      await use(widgetFullConfig.accountConfig.SECRET_PHRASE);
    },
    { scope: 'worker' },
  ],
  widgetConfig: async ({}, use) => {
    await use(widgetFullConfig);
  },

  // fixture-methods
  browserWithWallet: [
    async ({ secretPhrase, useFork }, use) => {
      const rpcUrl = useFork
        ? 'http://127.0.0.1:8545'
        : widgetFullConfig.standConfig.networkConfig.rpcUrl;

      const browserService = new BrowserService({
        networkConfig: {
          ...widgetFullConfig.standConfig.networkConfig,
          rpcUrl,
        },
        accountConfig: {
          ...widgetFullConfig.accountConfig,
          SECRET_PHRASE: secretPhrase,
        },
        walletConfig: widgetFullConfig.walletConfig,
        nodeConfig: {
          rpcUrlToMock: `**/api/rpc?chainId=${widgetFullConfig.standConfig.networkConfig.chainId}`,
          rpcUrl: widgetFullConfig.standConfig.networkConfig.rpcUrl,
          useExternalFork: true,
        },
        browserOptions: {
          reducedMotion: 'reduce',
          cookies: REFUSE_CF_BLOCK_COOKIE,
        },
      });

      await browserService.initWalletSetup(useFork);

      await use(browserService);

      await browserService.teardown();
    },
    { scope: 'worker', timeout: FORK_WARM_UP_TIMEOUT },
  ],
  widgetService: [
    async ({ browserWithWallet }, use) => {
      const ws = new WidgetService(
        browserWithWallet.getBrowserContextPage(),
        browserWithWallet.getWalletPage(),
      );
      await ws.connectWallet();
      await use(ws);
    },
    { scope: 'worker' },
  ],
  csmSDK: [
    async ({ useFork }, use) => {
      const rpcUrl = useFork
        ? 'http://127.0.0.1:8545'
        : widgetFullConfig.standConfig.networkConfig.rpcUrl;

      await use(new LidoSDKClient([rpcUrl]));
    },
    { scope: 'worker' },
  ],
  ethereumSDK: [
    async ({ secretPhrase }, use) => {
      await use(
        new SdkService(
          mnemonicToAccount(secretPhrase),
          widgetFullConfig.standConfig.networkConfig,
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
