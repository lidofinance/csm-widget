/* eslint-disable no-empty-pattern */
import { test } from '../test.fixture';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { CreateOperatorStep3Page } from '../../pages/tabs/createNodeOperator';

const VALID_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

test.describe('Operator without keys. Step 3.', () => {
  let step3: CreateOperatorStep3Page;

  test.beforeEach(async ({ widgetService }) => {
    await widgetService.page.goto('/');
    step3 = widgetService.createNodeOperatorPage.step3;
    await widgetService.createNodeOperatorPage.step1.fillForm(
      OPERATOR_TYPE.CM_PTO,
    );
    await widgetService.createNodeOperatorPage.step2.fillForm(
      VALID_ADDRESS,
      VALID_ADDRESS,
    );
  });

  test(qase(49, 'Should display correct texts'), async ({}) => {
    await test.step('Check step track text', async () => {
      await expect(
        step3.stepTrackText,
        'Step track should display "Step 3 of 4"',
      ).toHaveText('Step 3 of 4');
    });

    await test.step('Check step title', async () => {
      await expect(
        step3.stepTitle,
        'Step title should display "Set Node Operator name and description"',
      ).toHaveText('Set Node Operator name and description');
    });

    await test.step('Check name hint text', async () => {
      await expect(
        step3.form,
        'Form should display name hint text',
      ).toContainText(
        'This name will be publicly visible on-chain. Your operator type will be added automatically (e.g., <NodeOperatorName>_ExtraEffort).',
      );
    });

    await test.step('Check description hint text', async () => {
      await expect(
        step3.form,
        'Form should display description hint text',
      ).toContainText(
        'A short public blurb about your operator. Great for visibility and marketing.',
      );
    });
  });

  test(
    qase(50, 'Should navigate back to step 2 on Back button click'),
    async ({ widgetService }) => {
      await test.step('Click "Back" button', async () => {
        await step3.backButton.click();
      });

      await test.step('Check step 2 is displayed', async () => {
        await expect(
          widgetService.createNodeOperatorPage.step2.stepTrackText,
          'Step track should display "Step 2 of 4" after going back',
        ).toHaveText('Step 2 of 4');
      });
    },
  );

  test(qase(61, 'Name: Should display input'), async ({}) => {
    await test.step('Check "Name" input is visible', async () => {
      await expect(
        step3.nameInput,
        '"Name" input should be visible',
      ).toBeVisible();
    });
  });

  test(qase(62, 'Name: Should display hint text'), async ({}) => {
    await test.step('Check "Name" hint text', async () => {
      await expect(
        step3.form,
        'Form should display name hint text',
      ).toContainText(
        'This name will be publicly visible on-chain. Your operator type will be added automatically (e.g., <NodeOperatorName>_ExtraEffort).',
      );
    });
  });

  test('Name: Should show required error for empty field', async ({}) => {
    await test.step('Focus and blur name input without filling', async () => {
      await step3.nameInput.focus();
      await step3.nameInput.blur();
    });

    await test.step('Check required validation error is displayed', async () => {
      await expect(
        step3.nameError,
        '"Name" should show "Operator name is required" error when empty',
      ).toHaveText('Operator name is required');
    });
  });

  test(
    qase(67, 'Name: Should show error when value exceeds max length of 64'),
    async ({}) => {
      await test.step('Fill name with a string longer than 64 characters', async () => {
        await step3.nameInput.fill('a'.repeat(65));
        await step3.nameInput.blur();
      });

      await test.step('Check max length validation error is displayed', async () => {
        await expect(
          step3.nameError,
          '"Name" should show "Is too long, maximum is 64" error',
        ).toHaveText('Is too long, maximum is 64');
      });
    },
  );

  test(qase(63, 'Name: Should not show error for valid value'), async ({}) => {
    await test.step('Fill name with valid value and blur', async () => {
      await step3.nameInput.fill('Valid name');
      await step3.nameInput.blur();
    });

    await test.step('Check no validation error is displayed', async () => {
      await expect(
        step3.nameError,
        '"Name" should not show error for valid value',
      ).toBeHidden();
    });
  });

  test(qase(64, 'Description: Should display input'), async ({}) => {
    await test.step('Check "Description" input is visible', async () => {
      await expect(
        step3.descriptionInput,
        '"Description" input should be visible',
      ).toBeVisible();
    });
  });

  test(qase(65, 'Description: Should display hint text'), async ({}) => {
    await test.step('Check "Description" hint text', async () => {
      await expect(
        step3.form,
        'Form should display description hint text',
      ).toContainText(
        'A short public blurb about your operator. Great for visibility and marketing.',
      );
    });
  });

  test('Description: Should show required error for empty field', async ({}) => {
    await test.step('Focus and blur description input without filling', async () => {
      await step3.descriptionInput.focus();
      await step3.descriptionInput.blur();
    });

    await test.step('Check required validation error is displayed', async () => {
      await expect(
        step3.descriptionError,
        '"Description" should show "Description is required" error when empty',
      ).toHaveText('Description is required');
    });
  });

  test(
    qase(
      68,
      'Description: Should show error when value exceeds max length of 1024',
    ),
    async ({}) => {
      await test.step('Fill description with a string longer than 1024 characters', async () => {
        await step3.descriptionInput.fill('a'.repeat(1025));
        await step3.descriptionInput.blur();
      });

      await test.step('Check max length validation error is displayed', async () => {
        await expect(
          step3.descriptionError,
          '"Description" should show "Is too long, maximum is 1024" error',
        ).toHaveText('Is too long, maximum is 1024');
      });
    },
  );

  test(
    qase(66, 'Description: Should not show error for valid value'),
    async ({}) => {
      await test.step('Fill description with valid value and blur', async () => {
        await step3.descriptionInput.fill('Valid description');
        await step3.descriptionInput.blur();
      });

      await test.step('Check no validation error is displayed', async () => {
        await expect(
          step3.descriptionError,
          '"Description" should not show error for valid value',
        ).toBeHidden();
      });
    },
  );

  test(qase(54, 'Should be disabled when only Name is filled'), async ({}) => {
    await test.step('Fill only "Name" and blur', async () => {
      await step3.nameInput.fill('Valid name');
      await step3.nameInput.blur();
    });

    await test.step('Check "Continue" button is disabled', async () => {
      await expect(
        step3.continueButton,
        '"Continue" button should be disabled when only name is filled',
      ).toBeDisabled();
    });
  });

  test(
    qase(58, 'Should be disabled when only Description is filled'),
    async ({}) => {
      await test.step('Fill only "Description" and blur', async () => {
        await step3.descriptionInput.fill('Valid description');
        await step3.descriptionInput.blur();
      });

      await test.step('Check "Continue" button is disabled', async () => {
        await expect(
          step3.continueButton,
          '"Continue" button should be disabled when only description is filled',
        ).toBeDisabled();
      });
    },
  );

  test(
    qase(59, 'Should enable Continue button when both fields are valid'),
    async ({}) => {
      await test.step('Fill both name and description fields', async () => {
        await step3.nameInput.fill('Valid name');
        await step3.descriptionInput.fill('Valid description');
        await step3.descriptionInput.blur();
      });

      await test.step('Check "Continue" button is enabled', async () => {
        await expect(
          step3.continueButton,
          '"Continue" button should be enabled when both fields are valid',
        ).toBeEnabled();
      });
    },
  );
});
