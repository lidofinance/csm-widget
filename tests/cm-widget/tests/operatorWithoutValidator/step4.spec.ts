/* eslint-disable no-empty-pattern */
import { test } from '../test.fixture';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { CreateOperatorStep4Page } from '../../pages/tabs/createNodeOperator';

const VALID_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const OPERATOR_NAME = 'Test Operator';
const OPERATOR_DESCRIPTION = 'Test description';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

test.describe('Operator without keys. Step 4.', () => {
  let step4: CreateOperatorStep4Page;

  test.beforeEach(async ({ widgetService }) => {
    await widgetService.page.goto('/');
    step4 = widgetService.createNodeOperatorPage.step4;
    await widgetService.createNodeOperatorPage.step1.fillForm(
      OPERATOR_TYPE.CM_PTO,
    );
    await widgetService.createNodeOperatorPage.step2.fillForm(
      VALID_ADDRESS,
      VALID_ADDRESS,
    );
    await widgetService.createNodeOperatorPage.step3.fillForm(
      OPERATOR_NAME,
      OPERATOR_DESCRIPTION,
    );
  });

  test(qase(77, 'Should display correct texts'), async ({}) => {
    await test.step('Check step track text', async () => {
      await expect(
        step4.stepTrackText,
        'Step track should display "Step 4 of 4"',
      ).toHaveText('Step 4 of 4');
    });

    await test.step('Check step title', async () => {
      await expect(
        step4.stepTitle,
        'Step title should display "Confirm Node Operator creation"',
      ).toHaveText('Confirm Node Operator creation');
    });
  });

  test(
    qase(78, 'Should navigate back to step 3 on Back button click'),
    async ({ widgetService }) => {
      await test.step('Click "Back" button', async () => {
        await step4.backButton.click();
      });

      await test.step('Check step 3 is displayed', async () => {
        await expect(
          widgetService.createNodeOperatorPage.step3.stepTrackText,
          'Step track should display "Step 3 of 4" after going back',
        ).toHaveText('Step 3 of 4');
      });
    },
  );

  test(qase(79, 'Summary: Should display operator type'), async ({}) => {
    await test.step('Check operator type row is visible', async () => {
      await expect(
        step4.summaryOperatorType,
        'Summary should display operator type row',
      ).toBeVisible();
    });

    await test.step('Check operator type value', async () => {
      await expect(
        step4.summaryOperatorType,
        'Summary should display "Professional Trusted Operator"',
      ).toContainText('Professional Trusted Operator');
    });
  });

  test(qase(80, 'Summary: Should display name and description'), async ({}) => {
    await test.step('Check name row is visible', async () => {
      await expect(
        step4.summaryName,
        'Summary should display name row',
      ).toBeVisible();
    });

    await test.step('Check name value', async () => {
      await expect(
        step4.summaryName,
        `Summary should display name "${OPERATOR_NAME}"`,
      ).toContainText(OPERATOR_NAME);
    });

    await test.step('Check description row is visible', async () => {
      await expect(
        step4.summaryDescription,
        'Summary should display description row',
      ).toBeVisible();
    });

    await test.step('Check description value', async () => {
      await expect(
        step4.summaryDescription,
        `Summary should display description "${OPERATOR_DESCRIPTION}"`,
      ).toContainText(OPERATOR_DESCRIPTION);
    });
  });

  test(
    qase(81, 'Summary: Should display manager and rewards addresses'),
    async ({}) => {
      await test.step('Check manager address row is visible', async () => {
        await expect(
          step4.summaryManagerAddress,
          'Summary should display manager address row',
        ).toBeVisible();
      });

      await test.step('Check manager address value', async () => {
        await expect(
          step4.summaryManagerAddress,
          `Summary should display manager address "${VALID_ADDRESS}"`,
        ).toContainText(VALID_ADDRESS);
      });

      await test.step('Check rewards address row is visible', async () => {
        await expect(
          step4.summaryRewardsAddress,
          'Summary should display rewards address row',
        ).toBeVisible();
      });

      await test.step('Check rewards address value', async () => {
        await expect(
          step4.summaryRewardsAddress,
          `Summary should display rewards address "${VALID_ADDRESS}"`,
        ).toContainText(VALID_ADDRESS);
      });
    },
  );

  test.skip(
    qase(82, 'Summary: Should display correct reward and bond parameters'),
    async ({}) => {
      // Verify "Node Operator reward:" row shows correct percentage (e.g. "4% for all keys")
      // Verify "Bond:" row shows correct ETH values per key intervals (e.g. "11.0 ETH for first key", "0.1 ETH for next 16 keys", "0.7 ETH for subsequent keys")
      // Values depend on the selected gate/curve and are fetched from chain — need testId on summaryReward and summaryBond rows
    },
  );

  test(qase(83, 'Should display "Create Node Operator" button'), async ({}) => {
    await test.step('Check "Create Node Operator" button is visible', async () => {
      await expect(
        step4.createButton,
        '"Create Node Operator" button should be visible',
      ).toBeVisible();
    });
  });
});
