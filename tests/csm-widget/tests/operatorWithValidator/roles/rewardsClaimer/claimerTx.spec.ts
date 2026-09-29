import { test } from '../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { expect } from '@playwright/test';
import { generateAddress } from 'tests/shared/helpers/accountData';
import {
  PAGE_WAIT_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
} from 'tests/shared/consts/timeouts';
import { qase } from 'playwright-qase-reporter/playwright';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';

const CURRENT_ADDRESS = generateAddress(true);
const ANOTHER_ADDRESS = generateAddress(true);

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.roles,
    feature: 'Rewards claimer',
    story: 'Transaction',
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ csmSDK }) => {
      snapshotId = await csmSDK.evmSnapshot();
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    test(
      qase(562, 'Should set the new address when Enter pressed'),
      async ({ widgetService, forkActionService }) => {
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
      },
    );
  },
);
