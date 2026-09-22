import { test } from '../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { expect } from '@playwright/test';
import { Tags } from 'tests/shared/consts/common.const';
import { generateAddress } from 'tests/shared/helpers/accountData';
import {
  PAGE_WAIT_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
} from 'tests/shared/consts/timeouts';

const CURRENT_ADDRESS = generateAddress(true);
const ANOTHER_ADDRESS = generateAddress(true);

test.describe(
  ...suite({
    epic: EPIC.roles,
    feature: 'Rewards claimer',
    story: 'Transaction',
    tag: [Tags.forked],
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ useFork, csmSDK }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
      snapshotId = await csmSDK.evmSnapshot();
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    test('Should set the new address when Enter pressed', async ({
      widgetService,
      forkActionService,
    }) => {
      const { claimerPage, txModal } = widgetService.settingsPage;

      await test.step('Set initial claimer address via contract', async () => {
        await claimerPage.open();
        const noId = await widgetService.extractNodeOperatorId();
        await forkActionService.setRewardsClaimer(noId, CURRENT_ADDRESS);
      });

      await test.step('Reopen page to load fresh form with updated claimer', async () => {
        await claimerPage.open();
        await expect(claimerPage.unsetButton).toBeVisible({
          timeout: STAGE_WAIT_TIMEOUT,
        });
      });

      await test.step('Type another address and press Enter', async () => {
        await claimerPage.addressInput.fill(ANOTHER_ADDRESS);
        // The submit button leaves the disabled state once validation settles
        await expect(claimerPage.submitButton).toBeEnabled({
          timeout: PAGE_WAIT_TIMEOUT,
        });
        await claimerPage.addressInput.press('Enter');
      });

      await test.step('Setting flow starts instead of unsetting', async () => {
        await expect(
          widgetService.page.getByText(
            'You are setting Rewards claimer address',
          ),
        ).toBeVisible({ timeout: STAGE_WAIT_TIMEOUT });
        await expect(
          widgetService.page.getByText('You are unsetting Rewards claimer'),
        ).not.toBeVisible();
      });

      await test.step('Confirm transaction and check the new address is set', async () => {
        await widgetService.walletPage.confirmTx();
        await expect(txModal.title).toHaveText(
          'Rewards Claimer Address has been set',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
        await txModal.closeModal();
        await expect(claimerPage.currentClaimerTitle).toContainText(
          ANOTHER_ADDRESS,
          { timeout: STAGE_WAIT_TIMEOUT },
        );
      });
    });
  },
);
