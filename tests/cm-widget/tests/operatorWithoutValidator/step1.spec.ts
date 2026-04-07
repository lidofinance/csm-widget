/* eslint-disable no-empty-pattern */
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { test } from '../test.fixture';
import { expect } from '@playwright/test';
import { OPERATOR_TYPE_METADATA } from '../../../shared/consts/operatorTypes.const';
import { CreateOperatorStep1Page } from '../../pages/tabs/createNodeOperator/step1.page';
import { qase } from 'playwright-qase-reporter/playwright';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

test.describe('Operator without keys. Step 1.', () => {
  let step1: CreateOperatorStep1Page;
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.page.goto('/');
    // @todo: should be used after fix bug
    // await widgetService.createNodeOperatorPage.open();
    step1 = widgetService.createNodeOperatorPage.step1;
  });

  test(qase(15, 'Should display correct title and description'), async ({}) => {
    await test.step('Check step track text', async () => {
      await expect(
        step1.stepTrackText,
        'Step track should display "Step 1 of 4"',
      ).toHaveText('Step 1 of 4');
    });

    await test.step('Check step title', async () => {
      await expect(
        step1.stepTitle,
        'Step title should display "Select Sub-Node Operator Type"',
      ).toHaveText('Select Sub-Node Operator Type');
    });

    await test.step('Check step description', async () => {
      await expect(
        step1.stepDescription,
        'Step description should display correct hint text',
      ).toHaveText(
        'Choose the type you want to create now. You can create additional Sub-Node Operators with other types later',
      );
    });
  });

  Object.values(OPERATOR_TYPE)
    .filter((type) => type.startsWith('CM_'))
    .forEach((type) => {
      test(
        qase(16, `Should display correct texts for operator type: ${type}`),
        async ({}) => {
          qase.parameters({ operatorType: type });
          const getSelect = step1.getGateInput(type);
          const meta = OPERATOR_TYPE_METADATA[type];

          await test.step(`Check title for operator type "${type}"`, async () => {
            await expect(
              getSelect.title,
              `Operator type title should display "${meta.name}"`,
            ).toHaveText(meta.name);
          });

          await test.step(`Check description for operator type "${type}"`, async () => {
            await expect(
              getSelect.description,
              `Operator type description should display "${meta.description}"`,
            ).toHaveText(meta.description);
          });
        },
      );
    });

  test(
    qase(22, 'Should select operator type and show check icon'),
    async ({}) => {
      const getSelect = step1.getGateInput(OPERATOR_TYPE.CM_PTO);

      await test.step('Click on operator type', async () => {
        await getSelect.click();
      });

      await test.step('Check operator type is selected', async () => {
        await expect(
          getSelect.input,
          'Operator type input should be checked after click',
        ).toBeChecked();

        await expect(
          getSelect.checkIcon,
          'Check icon should be visible after selection',
        ).toBeVisible();

        await expect(
          step1.continueButton,
          '"Continue" button should be enabled after selection',
        ).toBeEnabled();
      });
    },
  );

  test(
    qase(30, 'Should continue to the next step after selecting operator type'),
    async ({ widgetService }) => {
      await test.step('Select operator type and click "Continue"', async () => {
        const getSelect = step1.getGateInput(OPERATOR_TYPE.CM_PTO);
        await getSelect.click();
        await step1.continueButton.click();
      });

      await test.step('Check next step is displayed', async () => {
        await expect(
          widgetService.createNodeOperatorPage.createdOperatorForm,
          'Next step should display "Specify addresses" form',
        ).toContainText('Specify addresses');
      });
    },
  );
});
