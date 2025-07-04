/* eslint-disable no-empty-pattern */
import { BrowserService } from '@lidofinance/browser-service';
import { test as base } from '@playwright/test';
import { widgetFullConfig } from 'tests/config';
import { IConfig } from 'tests/config/configs/base.config';
import { REFUSE_CF_BLOCK_COOKIE } from 'tests/config/storageState';
import {
  contractClients,
  ContractClients,
} from 'tests/services/clients.contract';
import { SdkService } from 'tests/services/sdk.client';
import { WidgetService } from 'tests/services/widget.service';
import { mnemonicToAccount } from 'viem/accounts';

type WorkerFixtures = {
  secretPhrase: string;
  browserWithWallet: BrowserService;
  widgetService: WidgetService;
  contractClients: ContractClients;
  sdkService: SdkService;
};

export const test = base.extend<{ widgetConfig: IConfig }, WorkerFixtures>({
  widgetConfig: async ({}, use) => {
    await use(widgetFullConfig);
  },
  secretPhrase: [
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
          reducedMotion: 'reduce',
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
      const ws = new WidgetService(
        browserWithWallet.getBrowserContextPage(),
        browserWithWallet.getWalletPage(),
      );
      await ws.connectWallet();
      await use(ws);
    },
    { scope: 'worker' },
  ],
  contractClients: [
    async ({}, use) => {
      await use(contractClients);
    },
    { scope: 'worker' },
  ],
  sdkService: [
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
