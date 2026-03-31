/* eslint-disable no-empty-pattern */
import fs from 'fs';
import { BrowserService } from '@lidofinance/browser-service';
import { test as base } from '@playwright/test';
import { widgetFullConfig } from '../config';
import { IConfig } from '../config/configs/base.config';
import { REFUSE_CF_BLOCK_COOKIE } from '../../shared/config/storageState';
import { SdkService } from 'tests/shared/services/ethereumSDK.client';
import { WidgetService } from '../services/widget.service';
import { mnemonicToAccount } from 'viem/accounts';
import { FORK_WARM_UP_TIMEOUT } from 'tests/shared/consts/timeouts';
import ForkActionsService from 'tests/shared/services/forkActions.service';
import { warmUpForkedNode } from 'tests/shared/helpers/warmUpFork';
import { HttpMockerService } from 'tests/shared/services/httpMocker.service';
import { LidoSDKClient } from '../services/cmSDK.client';
import path from 'path';

type WorkerFixtures = {
  // fixture-options
  secretPhrase: string;
  useFork: boolean;

  autoConnectWallet: boolean;
  browserWithWallet: BrowserService;
  widgetService: WidgetService;
  cmSDK: LidoSDKClient;
  ethereumSDK: SdkService;
  forkActionService: ForkActionsService;
  httpMockerService: HttpMockerService;
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
    async ({ secretPhrase, useFork, cmSDK }, use) => {
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
          warmUpCallback: warmUpForkedNode.bind(null, cmSDK, secretPhrase),
        },
        browserOptions: {
          // headless: true,
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
  cmSDK: [
    async ({ useFork }, use) => {
      const forkRpcURL = `http://${widgetFullConfig.standConfig.nodeConfig.host}:${widgetFullConfig.standConfig.nodeConfig.port}`;
      const rpcUrl = useFork
        ? forkRpcURL
        : widgetFullConfig.standConfig.networkConfig.rpcUrl;

      // Load devnet contract addresses from JSON file if specified
      let devnetAddresses = null;
      if (process.env.DEVNET_ADDRESSES_FILE_PATH) {
        try {
          const filePath = path.resolve(process.env.DEVNET_ADDRESSES_FILE_PATH);
          devnetAddresses = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (e) {
          if (e instanceof Error) {
            console.warn('Failed to load devnet addresses:', e.message);
          } else {
            console.warn('Failed to load devnet addresses:', e);
          }
        }
      }

      await use(new LidoSDKClient([rpcUrl], devnetAddresses));
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
  httpMockerService: [
    async ({ widgetService }, use) => {
      await use(
        new HttpMockerService(
          widgetService.page,
          // @ts-expect-error may be null
          widgetFullConfig.standConfig.mockConfig,
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
