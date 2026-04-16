import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { test } from '../../test.fixture';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';

test.describe('Settings. Meta data.', () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.settingsPage.metadataPage.open();
  });

  test(
    qase(
      180,
      'Should display form with correct section title and input labels',
    ),
    async ({ widgetService }) => {
      const { metadataPage } = widgetService.settingsPage;

      await test.step('Section title is visible', async () => {
        await expect(metadataPage.formTitle).toBeVisible();
      });

      await test.step('Name input is visible with correct label', async () => {
        await expect(metadataPage.nameInput).toBeVisible();
        await expect(metadataPage.nameInputContainer).toContainText('Name');
      });

      await test.step('Description input is visible with correct label', async () => {
        await expect(metadataPage.descriptionInput).toBeVisible();
        await expect(metadataPage.descriptionInputContainer).toContainText(
          'Description',
        );
      });

      await test.step('Save button is visible and enabled on initial load', async () => {
        await expect(metadataPage.saveButton).toBeVisible();
        await expect(metadataPage.saveButton).toBeEnabled();
      });
    },
  );

  test(
    qase(
      181,
      'Should prefill inputs with current operator metadata from chain',
    ),
    async ({ widgetService, cmSDK }) => {
      const { metadataPage } = widgetService.settingsPage;

      const nodeOperatorId = await widgetService.extractNodeOperatorId();
      const { name, description } =
        await cmSDK.getOperatorMetadata(nodeOperatorId);

      await test.step('Name input is prefilled with chain value', async () => {
        await expect(metadataPage.nameInput).toHaveValue(name);
      });

      await test.step('Description input is prefilled with chain value', async () => {
        await expect(metadataPage.descriptionInput).toHaveValue(description);
      });
    },
  );

  test(
    qase(183, 'Should show validation error when Name is cleared'),
    async ({ widgetService }) => {
      const { metadataPage } = widgetService.settingsPage;

      await test.step('Clear Name input', async () => {
        await metadataPage.nameInput.clear();
      });

      await test.step('Validation error is shown for Name', async () => {
        await expect(metadataPage.nameInputError).toBeVisible();
        await expect(metadataPage.nameInputError).toHaveText(
          'Is too short, minimum is 1',
        );
      });

      await test.step('Save button is disabled', async () => {
        await expect(metadataPage.saveButton).toBeDisabled();
      });
    },
  );

  test(
    qase(187, 'Should show validation error when Name exceeds 64 characters'),
    async ({ widgetService }) => {
      const { metadataPage } = widgetService.settingsPage;

      await test.step('Fill Name with 65 characters', async () => {
        await metadataPage.nameInput.fill('a'.repeat(65));
        await metadataPage.nameInput.blur();
      });

      await test.step('Validation error is shown for Name', async () => {
        await expect(metadataPage.nameInputError).toBeVisible();
        await expect(metadataPage.nameInputError).toHaveText(
          'Is too long, maximum is 64',
        );
      });

      await test.step('Save button is disabled', async () => {
        await expect(metadataPage.saveButton).toBeDisabled();
      });
    },
  );

  test(
    qase(
      188,
      'Should show validation error when Description exceeds 1024 characters',
    ),
    async ({ widgetService }) => {
      const { metadataPage } = widgetService.settingsPage;

      await test.step('Fill Description with 1025 characters', async () => {
        await metadataPage.descriptionInput.fill('a'.repeat(1025));
        await metadataPage.descriptionInput.blur();
      });

      await test.step('Validation error is shown for Description', async () => {
        await expect(metadataPage.descriptionInputError).toBeVisible();
        await expect(metadataPage.descriptionInputError).toHaveText(
          'Is too long, maximum is 1024',
        );
      });

      await test.step('Save button is disabled', async () => {
        await expect(metadataPage.saveButton).toBeDisabled();
      });
    },
  );

  test(
    qase(184, 'Should show validation error when Description is cleared'),
    async ({ widgetService }) => {
      const { metadataPage } = widgetService.settingsPage;

      await test.step('Clear Description input', async () => {
        await metadataPage.descriptionInput.clear();
      });

      await test.step('Validation error is shown for Description', async () => {
        await expect(metadataPage.descriptionInputError).toBeVisible();
        await expect(metadataPage.descriptionInputError).toHaveText(
          'Is too short, minimum is 1',
        );
      });

      await test.step('Save button is disabled', async () => {
        await expect(metadataPage.saveButton).toBeDisabled();
      });
    },
  );

  test(
    qase(
      186,
      'Should update metadata on the page and dashboard after transaction',
    ),
    async ({ widgetService }) => {
      const { metadataPage } = widgetService.settingsPage;
      const { txModal } = widgetService.settingsPage;

      const nodeOperatorId = await widgetService.extractNodeOperatorId();

      const uid = crypto.randomUUID().slice(0, 8);
      const newName = `Test ${uid} !@#$`;
      const newDescription = `Desc ${uid} 123`;

      await test.step('Fill new name and description, then submit', async () => {
        await metadataPage.nameInput.fill(newName);
        await metadataPage.descriptionInput.fill(newDescription);
        await expect(metadataPage.saveButton).toBeEnabled();
        await metadataPage.saveButton.click();
      });

      await test.step('Confirm transaction in wallet', async () => {
        await widgetService.page.waitForSelector(
          'text=You are updating metadata',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
        await widgetService.walletPage.confirmTx();
      });

      await test.step('Success modal shows correct message', async () => {
        await expect(txModal.title).toHaveText('Metadata has been updated', {
          timeout: STAGE_WAIT_TIMEOUT,
        });
        await txModal.closeModal();
        await expect(txModal.modal).not.toBeVisible();
      });

      await test.step('Name is updated on metadata page', async () => {
        await expect(metadataPage.nameInput).toHaveValue(newName);
      });

      await test.step('Description is updated on metadata page', async () => {
        await expect(metadataPage.descriptionInput).toHaveValue(newDescription);
      });

      await test.step('Operator name is updated on dashboard', async () => {
        await widgetService.dashboardPage.open();
        await expect(widgetService.dashboardPage.operatorName).toHaveText(
          newName,
        );
      });

      await test.step('Operator name is updated in Switch Node Operator modal', async () => {
        await widgetService.page.getByTestId('nodeOperatorHeader').click();

        const modal = widgetService.page.getByRole('dialog');
        const currentRow = modal.getByTestId('switchModalOperatorRow').filter({
          has: widgetService.page
            .getByTestId('descriptorId')
            .filter({ hasText: `#${nodeOperatorId}` }),
        });

        await expect(
          currentRow.getByTestId('switchModalOperatorName'),
        ).toHaveText(newName);

        await widgetService.settingsPage.closeModalWindow();
      });
    },
  );
});
