import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { test } from '../../../test.fixture';

const VALID_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const INVALID_ADDRESS = '0xinvalid';

test.describe('Settings. Rewards claimer.', () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.settingsPage.claimerPage.open();
  });

  test(
    qase(199, 'Should display form structure correctly'),
    async ({ widgetService }) => {
      const { claimerPage } = widgetService.settingsPage;

      await test.step('"Back" button is visible', async () => {
        await expect(claimerPage.backButton).toBeVisible();
      });

      await test.step('"Rewards claimer" section title is visible', async () => {
        await expect(claimerPage.currentClaimerSection).toBeVisible();
        await expect(claimerPage.currentClaimerSection).toHaveText(
          'Rewards claimer',
        );
      });

      await test.step('"Current Rewards claimer" row is visible with "not set" value', async () => {
        await expect(claimerPage.currentClaimerTitle).toBeVisible();
        await expect(claimerPage.currentClaimerTitle).toContainText(
          'Current Rewards claimer',
        );
        await expect(claimerPage.currentClaimerTitle).toContainText('not set');
      });

      await test.step('"Specify a new Rewards claimer address" title is visible', async () => {
        await expect(claimerPage.addressInputTitle).toBeVisible();
        await expect(claimerPage.addressInputTitle).toHaveText(
          'Specify a new Rewards claimer address',
        );
      });

      await test.step('Address input is visible with correct placeholder', async () => {
        await expect(claimerPage.addressInput).toBeVisible();
        await expect(claimerPage.addressInputContainer).toContainText(
          'New Rewards claimer address',
        );
      });

      await test.step('Submit button is visible with correct text', async () => {
        await expect(claimerPage.submitButton).toBeVisible();
        await expect(claimerPage.submitButton).toHaveText(
          'Set new Rewards claimer address',
        );
      });
    },
  );

  test(
    qase(207, 'Should navigate back to Settings on "Back" button click'),
    async ({ widgetService }) => {
      const { claimerPage } = widgetService.settingsPage;

      await claimerPage.backButton.click();
      await expect(widgetService.page).toHaveURL(/\/settings/);
      await expect(
        widgetService.page.getByTestId('pageSwitcher'),
      ).toBeVisible();
    },
  );

  test(
    qase(200, 'Should disable Submit button when form is clean'),
    async ({ widgetService }) => {
      const { claimerPage } = widgetService.settingsPage;

      await expect(claimerPage.submitButton).toBeDisabled();
    },
  );

  test(
    qase(201, 'Should show validation error for invalid address'),
    async ({ widgetService }) => {
      const { claimerPage } = widgetService.settingsPage;

      await test.step('Fill invalid address and blur', async () => {
        await claimerPage.addressInput.fill(INVALID_ADDRESS);
        await claimerPage.addressInput.blur();
      });

      await test.step('Validation error is shown', async () => {
        await expect(claimerPage.addressInputError).toBeVisible();
        await expect(claimerPage.addressInputError).toHaveText(
          'Specify a valid address',
        );
      });

      await test.step('Submit button is disabled', async () => {
        await expect(claimerPage.submitButton).toBeDisabled();
      });
    },
  );

  test(
    qase(202, 'Should enable Submit button for valid address'),
    async ({ widgetService }) => {
      const { claimerPage } = widgetService.settingsPage;

      await test.step('Fill valid address', async () => {
        await claimerPage.addressInput.fill(VALID_ADDRESS);
        await claimerPage.addressInput.blur();
      });

      await test.step('No validation error is shown', async () => {
        await expect(claimerPage.addressInputError).not.toBeVisible();
      });

      await test.step('Submit button is enabled', async () => {
        await expect(claimerPage.submitButton).toBeEnabled();
      });
    },
  );
});
