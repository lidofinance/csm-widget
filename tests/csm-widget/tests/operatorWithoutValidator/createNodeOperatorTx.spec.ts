import { expect } from '@playwright/test';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { generateMnemonic, mnemonicToAccount } from 'viem/accounts';
import { Tags, TokenSymbol } from 'tests/shared/consts/common.const';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import {
  beaconchainDashboardPattern,
  checkExternalMatomoLink,
  checkInternalMatomoLink,
  escapeRegex,
  fullUrlPattern,
} from 'tests/shared/helpers/matomoLinks';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../test.fixture';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

const CUSTOM_ADDRESS = mnemonicToAccount(secretPhrase, {
  addressIndex: 1,
}).address;

const SUBSCRIBE_EVENTS_DOCS_URL =
  'https://docs.lido.fi/run-on-lido/csm/alerts-and-monitoring/expert-custom-alerts';

test.describe(
  'Create Node Operator. Transaction.',
  { tag: [Tags.forked, Tags.performTX] },
  () => {
    let snapshotId: string;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeAll(async ({ evmNode, secretPhrase }) => {
      await evmNode.setBalance(mnemonicToAccount(secretPhrase).address, 100);
      snapshotId = await evmNode.snapshot();
    });

    test.afterEach(async ({ evmNode }) => {
      if (snapshotId) {
        await evmNode.revert(snapshotId);
        snapshotId = await evmNode.snapshot();
      }
    });

    test.afterAll(async ({ evmNode }) => {
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test('Should send Matomo events on success modal links', async ({
      widgetService,
      widgetConfig,
      keysGeneratorService,
    }) => {
      const { keysPage } = widgetService;
      const { nextStepsBlock } = keysPage;
      const matomoEventService = new MatomoService(
        widgetService.page,
        widgetConfig,
      );
      const beaconchainUrl =
        widgetConfig.standConfig.monitoringConfig.urls.beaconchain;
      const widgetUrl = widgetConfig.standConfig.standUrl.replace(/\/+$/, '');

      await test.step('Create a Node Operator with one key', async () => {
        await keysPage.goto();
        await keysPage.createNodeOperatorForm.submitNewKeys(
          keysGeneratorService.generateKeys(1),
          TokenSymbol.ETH,
        );
        await widgetService.walletPage.confirmTx();
        await expect(keysPage.txModal.title).toContainText(
          'Node Operator has been created',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
      });

      await test.step('All "What is next" links are shown', async () => {
        await expect(nextStepsBlock.block).toBeVisible();
        await expect(nextStepsBlock.keysTabLink).toBeVisible();
        await expect(nextStepsBlock.beaconchainLink).toHaveAttribute(
          'href',
          beaconchainUrl,
        );
        await expect(nextStepsBlock.subscribeEventsLink).toHaveAttribute(
          'href',
          SUBSCRIBE_EVENTS_DOCS_URL,
        );
        await expect(nextStepsBlock.beaconchainDashboardLink).toHaveAttribute(
          'href',
          new RegExp(
            `^${escapeRegex(beaconchainUrl)}/dashboard\\?validators=(0x)?[0-9a-f]{96}$`,
            'i',
          ),
        );
      });

      await checkExternalMatomoLink(widgetService.page, matomoEventService, {
        name: 'beaconcha.in',
        link: nextStepsBlock.beaconchainLink,
        event: 'csm_widget_create_success_beaconchain_link',
        url: fullUrlPattern(beaconchainUrl),
      });

      await checkExternalMatomoLink(widgetService.page, matomoEventService, {
        name: 'CSM events notifications',
        link: nextStepsBlock.subscribeEventsLink,
        event: 'csm_widget_create_success_subscribe_events_link',
        url: fullUrlPattern(SUBSCRIBE_EVENTS_DOCS_URL),
      });

      await checkExternalMatomoLink(widgetService.page, matomoEventService, {
        name: 'beaconcha.in dashboard',
        link: nextStepsBlock.beaconchainDashboardLink,
        event: 'csm_widget_create_success_beaconchain_dashboard_link',
        url: beaconchainDashboardPattern(beaconchainUrl),
      });

      await checkInternalMatomoLink(widgetService.page, matomoEventService, {
        name: 'Keys tab',
        link: nextStepsBlock.keysTabLink,
        event: 'csm_widget_create_success_keys_tab_link',
        url: new RegExp(`^${escapeRegex(widgetUrl)}/keys/view(?:\\?.*)?$`, 'i'),
      });

      await expect(keysPage.txModal.modal).toBeHidden();
    });

    test('Should send Matomo events on success modal links with custom addresses', async ({
      widgetService,
      widgetConfig,
      keysGeneratorService,
    }) => {
      const { keysPage } = widgetService;
      const form = keysPage.createNodeOperatorForm;
      const { nextStepsBlock } = keysPage;
      const matomoEventService = new MatomoService(
        widgetService.page,
        widgetConfig,
      );
      const beaconchainUrl =
        widgetConfig.standConfig.monitoringConfig.urls.beaconchain;

      await test.step('Create a Node Operator with custom addresses', async () => {
        await keysPage.goto();
        await form.getBondTokenElement(TokenSymbol.ETH).click();
        await form.fillKeys(keysGeneratorService.generateKeys(1));

        await form.specifyCustomAdresses.click();
        await form.rewardsAddressInput.fill(CUSTOM_ADDRESS);
        await form.managerAddressInput.fill(CUSTOM_ADDRESS);

        await form.confirmKeysReady.click();
        await form.submitKeysButton.click();

        await expect(form.confirmAddressesModal).toBeVisible();
        await form.confirmAddressesContinueButton.click();

        await widgetService.walletPage.confirmTx();
        await expect(keysPage.txModal.title).toContainText(
          'Node Operator has been created',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
      });

      await test.step('"Keys tab" link is not offered without any role', async () => {
        await expect(nextStepsBlock.block).toBeVisible();
        await expect(nextStepsBlock.keysTabLink).toBeHidden();
      });

      await checkExternalMatomoLink(widgetService.page, matomoEventService, {
        name: 'beaconcha.in',
        link: nextStepsBlock.beaconchainLink,
        event: 'csm_widget_create_success_beaconchain_link',
        url: fullUrlPattern(beaconchainUrl),
      });

      await checkExternalMatomoLink(widgetService.page, matomoEventService, {
        name: 'CSM events notifications',
        link: nextStepsBlock.subscribeEventsLink,
        event: 'csm_widget_create_success_subscribe_events_link',
        url: fullUrlPattern(SUBSCRIBE_EVENTS_DOCS_URL),
      });

      await checkExternalMatomoLink(widgetService.page, matomoEventService, {
        name: 'beaconcha.in dashboard',
        link: nextStepsBlock.beaconchainDashboardLink,
        event: 'csm_widget_create_success_beaconchain_dashboard_link',
        url: beaconchainDashboardPattern(beaconchainUrl),
      });
    });
  },
);
