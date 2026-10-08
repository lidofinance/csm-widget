import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { Tags } from 'tests/shared/consts/common.const';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { TxModal } from 'tests/csm-widget/pages/elements/common/element.txProgressModal';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { qase } from 'playwright-qase-reporter/playwright';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.keys,
    feature: 'Remove keys',
    story: 'Transaction',
  }),
  () => {
    let snapshotId: string;
    let pubkey: string;

    test.beforeAll(async ({ csmSDK, forkActionService, widgetService }) => {
      snapshotId = await csmSDK.evmSnapshot();

      await test.step('Set up: add a non-deposited key to remove', async () => {
        await widgetService.keysPage.submitPage.open();
        const noId = await widgetService.extractNodeOperatorId();
        await forkActionService.addKeys(noId, 1);
        // the added key is appended to the end of the operator's key list
        pubkey = (await csmSDK.getAllKeys(BigInt(noId))).at(-1) as string;
      });
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    test(
      qase(574, 'Should remove 1 key'),
      { tag: [Tags.smoke] },
      async ({ widgetService }) => {
        const { removePage } = widgetService.keysPage;
        const txModal = new TxModal(widgetService.page);

        const keyCheckbox = removePage.getCheckboxByAddress(pubkey.slice(2));

        await removePage.open();

        await test.step('Select 1 key and remove', async () => {
          await keyCheckbox.click();
          await expect(removePage.numberOfKeysToRemoveValue).toContainText('1');
          await removePage.removeKeysButton.click();
          await widgetService.walletPage.confirmTx();
        });

        await test.step('Success modal is shown', async () => {
          await expect(txModal.title).toContainText('1 key has been removed', {
            timeout: STAGE_WAIT_TIMEOUT,
          });
          await expect(txModal.etherscanLink).toHaveAttribute(
            'href',
            /\/tx\/0x[0-9a-fA-F]+$/,
          );
        });

        await test.step('Key is gone from the remove list', async () => {
          await txModal.closeModal();
          await expect(keyCheckbox).toBeHidden();
        });
      },
    );
  },
);
