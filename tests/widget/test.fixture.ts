/* eslint-disable no-empty-pattern */
import fs from 'fs';
import { BrowserService } from '@lidofinance/browser-service';
import { test as base } from '@playwright/test';
import { widgetFullConfig } from 'tests/config';
import { IConfig } from 'tests/config/configs/base.config';
import { REFUSE_CF_BLOCK_COOKIE } from 'tests/config/storageState';
import { LidoSDKClient } from 'tests/services/csmSDK.client';
import { SdkService } from 'tests/services/ethereumSDK.client';
import { WidgetService } from 'tests/services/widget.service';
import { standardFetcher } from 'utils/standard-fetcher';
import { mnemonicToAccount } from 'viem/accounts';

type WorkerFixtures = {
  // fixture-options
  secretPhrase: string;
  useFork: boolean;

  browserWithWallet: BrowserService;
  widgetService: WidgetService;
  csmSDK: LidoSDKClient;
  ethereumSDK: SdkService;
  warmUpForkedNode: void;
};

const readBlockNumber = () => {
  try {
    const content = fs.readFileSync('.fork_block_number', 'utf8').trim();
    const num = Number(content);
    return Number.isFinite(num) ? num : undefined;
  } catch {
    return;
  }
};

const getBlockNumber = async (rpcUrl: string) => {
  const res = await standardFetcher(rpcUrl, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_blockNumber',
      params: [],
      id: 1,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // @ts-expect-error temp ingnore
  return parseInt(res.result, 16);
};

const warmUpForkedNode = async (
  csmSDK: LidoSDKClient,
  secretPhrase: string,
) => {
  console.info('Warming up forked node...');
  const address = mnemonicToAccount(secretPhrase).address;
  const started = Date.now();
  let lastError: unknown;
  while (Date.now() - started < 600000) {
    // warming up forked node by simple sdk request
    try {
      await csmSDK.getNodeOperatorsByAddress(address);
      await csmSDK.getNodeOperatorsByProposedAddress(address);
      console.info('Forked node is warmed up.');
      return;
    } catch (error) {
      lastError = error;
      // @ts-expect-error temp ingnore
      console.error(`Error message: ${error?.message}`);
    }
  }
  throw new Error(
    `Timeout (=600000ms) while waiting node operators for ${address}. Last error: ${String(
      lastError,
    )}`,
  );
};

export const test = base.extend<{ widgetConfig: IConfig }, WorkerFixtures>({
  // fixture-options
  useFork: [
    async ({}, use) => {
      await use(false);
    },
    { scope: 'worker', option: true },
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
      const currentBlockNumber = readBlockNumber();
      const runOptions = [`--mnemonic=${secretPhrase}`];

      if (currentBlockNumber) {
        runOptions.push(`--fork-block-number=${currentBlockNumber}`);
      }

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
          derivationPath: "m/44'/60'/0'/0",
          runOptions,
        },
        browserOptions: {
          reducedMotion: 'reduce',
          cookies: REFUSE_CF_BLOCK_COOKIE,
        },
      });

      await browserService.initWalletSetup(useFork);
      const blockNumber = await getBlockNumber(rpcUrl);
      fs.writeFileSync('.fork_block_number', String(blockNumber));

      await use(browserService);

      await browserService.teardown();
    },
    { scope: 'worker' },
  ],
  warmUpForkedNode: [
    async ({ browserWithWallet, csmSDK, secretPhrase }, use) => {
      if (browserWithWallet.ethereumNodeService.state) {
        await warmUpForkedNode(csmSDK, secretPhrase);
      }

      await use();
    },
    { scope: 'worker', auto: true },
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
    async ({ browserWithWallet }, use) => {
      const rpcUrls = [];
      if (browserWithWallet.ethereumNodeService.state) {
        rpcUrls.push('http://127.0.0.1:8545');
      } else {
        rpcUrls.push(widgetFullConfig.standConfig.networkConfig.rpcUrl);
      }

      await use(new LidoSDKClient(rpcUrls));
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
