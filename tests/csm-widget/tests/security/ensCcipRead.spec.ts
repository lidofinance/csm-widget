import { test } from '../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { expect } from '@playwright/test';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { generateAddress } from 'tests/shared/helpers/accountData';
import { mainnet } from 'viem/chains';
import {
  CCIP_GATEWAY,
  MAINNET_RPC,
  mockOffchainEns,
} from 'tests/shared/helpers/mockEns';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

// Emulated offchain records, like cb.id or *.base.eth names. The rewards
// address input is just an address input at hand: the setting is app-wide
const OFFCHAIN_NAME = 'ccipreadtest.eth';
const OFFCHAIN_NAMED_ADDRESS = generateAddress(true);
// The mainnet client falls back to it when the proxy fails
const PUBLIC_MAINNET_RPC = mainnet.rpcUrls.default.http[0];

test.describe(
  ...suite({
    epic: EPIC.security,
    feature: 'Web',
    story: 'ENS',
  }),
  () => {
    let gatewayRequest: Promise<unknown>;

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.settingsPage.rewardsAddressPage.open();
      // with CCIP-Read on, the gateway is called within a second
      gatewayRequest = widgetService.page.waitForRequest(`${CCIP_GATEWAY}**`, {
        timeout: 5_000,
      });
      // a test that fails before awaiting it must not leave it unhandled
      gatewayRequest.catch(() => undefined);
    });

    test.afterEach(async ({ widgetService }) => {
      await widgetService.page.unrouteAll();
    });

    test('Should not resolve an offchain ENS name', async ({
      widgetService,
    }) => {
      const page = widgetService.settingsPage.rewardsAddressPage;
      await mockOffchainEns(widgetService.page, OFFCHAIN_NAME);

      await page.addressInput.fill(OFFCHAIN_NAME);

      await test.step('CCIP gateway is not requested', async () => {
        await expect(gatewayRequest).rejects.toThrow();
      });

      await test.step('Validation error is shown', async () => {
        await expect(page.validationInputTooltip).toContainText(
          'Specify a valid address or ENS name',
        );
      });
    });

    test('Should not show the offchain name of an address', async ({
      widgetService,
    }) => {
      const page = widgetService.settingsPage.rewardsAddressPage;
      await mockOffchainEns(widgetService.page, OFFCHAIN_NAMED_ADDRESS);

      await page.addressInput.fill(OFFCHAIN_NAMED_ADDRESS);

      await test.step('CCIP gateway is not requested', async () => {
        await expect(gatewayRequest).rejects.toThrow();
      });

      await test.step('Address is shown without a name', async () => {
        await expect(page.inputLabel).not.toContainText('.eth');
      });
    });

    test('Should not resolve an offchain ENS name through the public RPC', async ({
      widgetService,
    }) => {
      const page = widgetService.settingsPage.rewardsAddressPage;
      await widgetService.page.route(MAINNET_RPC, (route) =>
        route.fulfill({ status: 500, json: 'Internal Server Error' }),
      );
      await mockOffchainEns(
        widgetService.page,
        OFFCHAIN_NAME,
        PUBLIC_MAINNET_RPC,
      );

      const publicRpcRequest =
        widgetService.page.waitForRequest(PUBLIC_MAINNET_RPC);

      await page.addressInput.fill(OFFCHAIN_NAME);

      await test.step('Lookup falls back to the public RPC', async () => {
        await publicRpcRequest;
      });

      await test.step('CCIP gateway is not requested', async () => {
        await expect(gatewayRequest).rejects.toThrow();
      });

      await test.step('Validation error is shown', async () => {
        await expect(page.validationInputTooltip).toContainText(
          'Specify a valid address or ENS name',
        );
      });
    });
  },
);
