import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { KeysPage } from 'tests/csm-widget/pages';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.keys,
    feature: 'View keys',
    story: 'Validator statuses',
  }),
  () => {
    let keysPage: KeysPage;
    let pubkey: string;

    test.beforeAll(async ({ widgetService, csmSDK, clMock }) => {
      keysPage = new KeysPage(widgetService.page);
      await keysPage.keysView.open();
      const noId = await widgetService.extractNodeOperatorId();

      // FULL_OPERATOR has its keys deposited; the first one is always among them
      pubkey = await test.step('Read the first deposited key', async () => {
        const keys = await csmSDK.operator.getKeys(BigInt(noId));
        return keys[0];
      });

      await test.step('Mock the key as active on CL', async () => {
        clMock.set(pubkey, 'ACTIVE');
      });

      await keysPage.keysView.open();
      await keysPage.keysView.table.waitFor({ state: 'visible' });
    });

    test.afterAll(async ({ clMock }) => {
      clMock.reset();
    });

    test('Should show "Active" key without comment', async () => {
      const keyRow = keysPage.keysView.rowByStatus('Active');

      await test.step('Wait for the active key row', async () => {
        await expect(keyRow.statusCell).toBeVisible({
          timeout: PAGE_WAIT_TIMEOUT,
        });
      });

      await test.step('Check the row belongs to the mocked key', async () => {
        await expect(keyRow.pubkeyCell).toContainText(pubkey.slice(0, 6));
      });

      await test.step('Check status, strikes and comment', async () => {
        await expect(keyRow.statusCell).toHaveText('Active');
        await expect(keyRow.strikesCountCell).toHaveText(/^0\/\d+$/);
        await expect(keyRow.statusCommentCell).toBeEmpty();
      });
    });
  },
);
