import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags, TokenSymbol } from 'tests/shared/consts/common.const';
import { OFAC_MODAL_TEXT } from 'tests/shared/consts/texts.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { KeysGeneratorService } from 'tests/shared/services/keysGenerator.service';
import { TxModal } from 'tests/cm-widget/pages/elements/common/element.txProgressModal';
import { test } from '../../test.fixture';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  'Operator with validator. Keys. Address blacklist validation',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;
    let txModal: TxModal;

    test.beforeAll(
      async ({ useFork, cmSDK, forkActionService, widgetService }) => {
        test.skip(!useFork, 'Test suite runs only on forked network');

        snapshotId = await cmSDK.evmSnapshot();
        txModal = new TxModal(widgetService.page);

        await test.step('Set up: add a non-deposited key to remove', async () => {
          await widgetService.keysPage.submitPage.open();
          const noId = await widgetService.extractNodeOperatorId();
          await forkActionService.addKeys(noId, 1);
        });

        await test.step('Mock blacklisted wallet address', async () => {
          await widgetService.mockValidationAddressRequest();
        });
      },
    );

    test.afterAll(async ({ cmSDK, widgetService }) => {
      await widgetService.page.unrouteAll();
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test(
      qase(455, 'Should show access denied modal when keys are submitted'),
      async ({ widgetService }) => {
        const { submitPage } = widgetService.keysPage;

        await test.step('Open the submit keys page', async () => {
          await submitPage.open();
        });

        await test.step('Fill valid keys and submit', async () => {
          const keys = await new KeysGeneratorService({
            isCM: true,
          }).generateKeys();
          await submitPage.submitKeys(keys, TokenSymbol.ETH);
        });

        await test.step('Access denied modal is shown', async () => {
          await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
        });
      },
    );

    test(
      qase(456, 'Should show access denied modal when keys are removed'),
      async ({ widgetService }) => {
        const { removePage } = widgetService.keysPage;

        await test.step('Open the remove keys page', async () => {
          await removePage.open();
        });

        await test.step('Select a key and remove', async () => {
          await removePage.keyCheckbox.first().click();
          await expect(removePage.removeKeysButton).toBeEnabled({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await removePage.removeKeysButton.click();
        });

        await test.step('Access denied modal is shown', async () => {
          await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
        });
      },
    );
  },
);
