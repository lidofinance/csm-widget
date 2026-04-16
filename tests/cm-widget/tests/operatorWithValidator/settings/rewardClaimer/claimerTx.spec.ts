import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/shared/consts/common.const';
import {
  STAGE_WAIT_TIMEOUT,
  PAGE_WAIT_TIMEOUT,
} from 'tests/shared/consts/timeouts';
import { test } from '../../../test.fixture';

const VALID_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

test.describe(
  'Settings. Rewards claimer. Transactions.',
  { tag: [Tags.performTX, Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeEach(async ({ cmSDK, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();
      await widgetService.settingsPage.claimerPage.open();
    });

    test.afterEach(async ({ cmSDK }) => {
      await cmSDK.evmRevert(snapshotId);
    });

    test(
      qase(203, 'Should set Rewards claimer address and show success'),
      async ({ widgetService }) => {
        const { claimerPage, txModal } = widgetService.settingsPage;

        await test.step('Set new Rewards claimer address', async () => {
          await claimerPage.setAddress(VALID_ADDRESS);
        });

        await test.step('Confirm transaction in wallet', async () => {
          await widgetService.page.waitForSelector(
            'text=You are setting Rewards claimer address',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
          await widgetService.walletPage.confirmTx();
        });

        await test.step('Success modal is shown', async () => {
          await expect(txModal.title).toHaveText(
            'Rewards claimer address has been set',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
          await txModal.closeModal();
          await expect(txModal.modal).not.toBeVisible();
        });

        await test.step('New claimer address is shown in current section', async () => {
          await expect(claimerPage.currentClaimerTitle).toContainText(
            VALID_ADDRESS,
            {
              timeout: STAGE_WAIT_TIMEOUT,
            },
          );
        });

        await test.step('Address input is cleared and submit button is disabled', async () => {
          await expect(claimerPage.addressInput).toHaveValue('');
          await expect(claimerPage.submitButton).toBeDisabled();
        });
      },
    );

    test(
      qase(204, 'Should show same address validation error'),
      async ({ widgetService }) => {
        const { claimerPage, txModal } = widgetService.settingsPage;

        await test.step('Set initial claimer address via transaction', async () => {
          await claimerPage.setAddress(VALID_ADDRESS);
          await widgetService.page.waitForSelector(
            'text=You are setting Rewards claimer address',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
          await widgetService.walletPage.confirmTx();
          await expect(txModal.title).toHaveText(
            'Rewards claimer address has been set',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
          await txModal.closeModal();
          await expect(txModal.modal).not.toBeVisible();
        });

        await test.step('Reopen page to load fresh form with updated claimer', async () => {
          await claimerPage.open();
          await expect(claimerPage.unsetButton).toBeVisible({
            timeout: STAGE_WAIT_TIMEOUT,
          });
        });

        await test.step('Try to set the same address again', async () => {
          await claimerPage.addressInput.fill(VALID_ADDRESS);
          await claimerPage.addressInput.blur();
        });

        await test.step('Validation error "Should not be same as current claimer" is shown', async () => {
          await expect(claimerPage.addressInputError).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await expect(claimerPage.addressInputError).toHaveText(
            'Should not be same as current claimer',
          );
        });

        await test.step('Submit button is disabled', async () => {
          await expect(claimerPage.submitButton).toBeDisabled();
        });
      },
    );

    test(
      qase(205, 'Should unset Rewards claimer and show success'),
      async ({ widgetService }) => {
        const { claimerPage, txModal } = widgetService.settingsPage;

        await test.step('Set initial claimer address', async () => {
          await claimerPage.setAddress(VALID_ADDRESS);
          await widgetService.page.waitForSelector(
            'text=You are setting Rewards claimer address',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
          await widgetService.walletPage.confirmTx();
          await expect(txModal.title).toHaveText(
            'Rewards claimer address has been set',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
          await txModal.closeModal();
          await expect(txModal.modal).not.toBeVisible();
        });

        await test.step('"Unset" button is visible after claimer is set', async () => {
          await expect(claimerPage.unsetButton).toBeVisible();
        });

        await test.step('Click "Unset" button and confirm transaction', async () => {
          await claimerPage.unsetButton.click();
          await widgetService.page.waitForSelector(
            'text=You are unsetting Rewards claimer',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
          await widgetService.walletPage.confirmTx();
        });

        await test.step('Success modal shows unset message', async () => {
          await expect(txModal.title).toHaveText(
            'Rewards claimer has been unset',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
          await txModal.closeModal();
          await expect(txModal.modal).not.toBeVisible();
        });

        await test.step('"Current Rewards claimer" shows "not set"', async () => {
          await expect(claimerPage.currentClaimerTitle).toContainText(
            'not set',
            {
              timeout: STAGE_WAIT_TIMEOUT,
            },
          );
        });

        await test.step('"Unset" button is no longer visible', async () => {
          await expect(claimerPage.unsetButton).not.toBeVisible();
        });
      },
    );

    test(
      qase(206, 'Should reflect set Rewards claimer address on dashboard'),
      async ({ widgetService }) => {
        const { claimerPage, txModal } = widgetService.settingsPage;

        await claimerPage.setAddress(VALID_ADDRESS);
        await widgetService.page.waitForSelector(
          'text=You are setting Rewards claimer address',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
        await widgetService.walletPage.confirmTx();
        await expect(txModal.title).toHaveText(
          'Rewards claimer address has been set',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
        await txModal.closeModal();
        await expect(txModal.modal).not.toBeVisible();

        await test.step('Claimer is visible on dashboard roles section', async () => {
          await widgetService.dashboardPage.open();
          const claimerRow =
            widgetService.dashboardPage.rolesSection.claimerAddressRow;
          await expect(claimerRow).toBeVisible();
          await expect(
            claimerRow.getByTestId('addressContainer'),
          ).toContainText(VALID_ADDRESS);
        });
      },
    );
  },
);
