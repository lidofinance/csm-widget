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
import { warmUpForkedNode } from 'tests/helpers/warmUpFork';

type WorkerFixtures = {
  // fixture-options
  secretPhrase: string;
  useFork: boolean;

  autoConnectWallet: boolean;
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
      // You can set the parameter either in playwright.config.ts
      // or directly in the test itself.
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
  autoConnectWallet: [
    async ({}, use) => {
      await use(true);
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
    async ({ secretPhrase, useFork, csmSDK }, use) => {
      const forkRpcURL = `http://${widgetFullConfig.standConfig.nodeConfig.host}:${widgetFullConfig.standConfig.nodeConfig.port}`;
      const rpcUrl = useFork
        ? forkRpcURL
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
          ...widgetFullConfig.standConfig.nodeConfig,
          useExternalFork: true,
          warmUpCallback: warmUpForkedNode.bind(null, csmSDK, secretPhrase),
        },
        browserOptions: {
          reducedMotion: 'reduce',
          cookies: REFUSE_CF_BLOCK_COOKIE,
        },
      });

      await browserService.initWalletSetup(useFork);

      await use(browserService);

      // We abort this request because we need to reduce the request count to the Elliptic api
      await browserService
        .getBrowserContextPage()
        .context()
        .route(new RegExp('.*/api/validation\\?.*'), async (route) => {
          await route.abort();
        });

      await browserService.teardown();
    },
    { scope: 'worker', timeout: FORK_WARM_UP_TIMEOUT },
  ],
  widgetService: [
    async ({ browserWithWallet, autoConnectWallet }, use) => {
      const ws = new WidgetService(
        browserWithWallet.getBrowserContextPage(),
        browserWithWallet.getWalletPage(),
      );
      if (autoConnectWallet) await ws.connectWallet();
      await use(ws);
    },
    { scope: 'worker' },
  ],
  csmSDK: [
    async ({ useFork }, use) => {
      const forkRpcURL = `http://${widgetFullConfig.standConfig.nodeConfig.host}:${widgetFullConfig.standConfig.nodeConfig.port}`;
      const rpcUrl = useFork
        ? forkRpcURL
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
