/* eslint-disable no-empty-pattern */
import { BrowserService } from '@lidofinance/browser-service';
import { test as base } from '@playwright/test';
import { widgetFullConfig } from '../config';
import { IConfig } from '../config/configs/base.config';
import { REFUSE_CF_BLOCK_COOKIE } from '../../shared/config/storageState';
import { LidoSDKClient } from 'tests/csm-widget/services/csmSDK.client';
import { SdkService } from 'tests/shared/services/ethereumSDK.client';
import { WidgetService } from 'tests/csm-widget/services/widget.service';
import { mnemonicToAccount } from 'viem/accounts';
import { FORK_WARM_UP_TIMEOUT } from 'tests/shared/consts/timeouts';
import ForkActionsService from 'tests/shared/services/forkActions.service';
import { warmUpForkedNode } from 'tests/shared/helpers/warmUpFork';
import { HttpMockerService } from 'tests/shared/services/httpMocker.service';
import { EvmNodeService } from 'tests/shared/services/evmNode.service';

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
  httpMockerService: HttpMockerService;
  evmNode: EvmNodeService;
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
      const forkRpcURL = `http://${widgetFullConfig.standConfig.nodeConfig.host}:${widgetFullConfig.standConfig.nodeConfig.port}`;
      const svc = new ForkActionsService({ module: 'csm', rpcUrl: forkRpcURL });
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
          headless: true,
          reducedMotion: 'reduce',
          cookies: REFUSE_CF_BLOCK_COOKIE,
        },
      });

      await browserService.initWalletSetup(useFork);

      if (useFork && process.env.CL_MOCK_URL) {
        // Mirrors the EL rpcUrlToMock proxy that BrowserService installs
        // internally (RpcProxyService.mockRoute): same clUrlToMock config
        // seam (Task 1), same context-level route, but a URL redirect
        // instead of a JSON-RPC proxy since the CL mock is a plain REST API.
        const { clUrlToMock } = widgetFullConfig.standConfig.mockConfig;
        await browserService
          .getBrowserContextPage()
          .context()
          .route(new RegExp(clUrlToMock.join('|')), async (route) => {
            const url = new URL(route.request().url());
            // strip "/api/cl/{chainId}" — the cl-mock serves the beacon
            // endpoints directly (no chainId segment), see pages/api/cl/[[...method]].ts
            const target = `${process.env.CL_MOCK_URL}${url.pathname.replace(/^\/api\/cl\/[^/]+/, '')}${url.search}`;
            await route.continue({ url: target });
          });
      }

      if (useFork && process.env.IPFS_API_URL) {
        // Seeds the saved-user-config localStorage entry (config/user-config,
        // key STORAGE_USER_CONFIG = "lido-user-config") so the widget's IPFS
        // gateway resolution (CoreSDK.getIpfsUrls, wired in
        // modules/web3/web3-provider/lido-sdk.tsx) prefers the local
        // ipfs-mock over the public gateways during fork runs. Registered
        // before the first navigation so it applies to the widget's document.
        await browserService
          .getBrowserContextPage()
          .context()
          .addInitScript((gatewayUrl) => {
            const key = 'lido-user-config';
            let current: Record<string, unknown> = {};
            try {
              current = JSON.parse(window.localStorage.getItem(key) || '{}');
            } catch {
              current = {};
            }
            window.localStorage.setItem(
              key,
              JSON.stringify({ ...current, ipfsGateways: [gatewayUrl] }),
            );
          }, `${process.env.IPFS_API_URL}/ipfs/`);
      }

      if (
        useFork &&
        secretPhrase !== widgetFullConfig.accountConfig.SECRET_PHRASE
      ) {
        const targetAddress = mnemonicToAccount(secretPhrase).address;
        await browserService
          .getWalletPage()
          .changeWalletAccountByAddress?.(targetAddress);
      }

      if (useFork) {
        // Operator didn't exist during the initial warmup — re-run so
        // operator-specific calls (getBondBalance, getStethPoolData, etc.)
        // are pre-cached in Anvil before the browser starts.
        await warmUpForkedNode(csmSDK, secretPhrase);
      }

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
  evmNode: [
    async ({ useFork }, use) => {
      const forkRpcURL = `http://${widgetFullConfig.standConfig.nodeConfig.host}:${widgetFullConfig.standConfig.nodeConfig.port}`;
      const rpcUrl = useFork
        ? forkRpcURL
        : widgetFullConfig.standConfig.networkConfig.rpcUrl;

      await use(new EvmNodeService(rpcUrl));
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
