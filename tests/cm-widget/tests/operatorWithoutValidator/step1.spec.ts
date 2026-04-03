/* eslint-disable no-empty-pattern */
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { test } from '../test.fixture';
import { expect } from '@playwright/test';
import { OPERATOR_TYPE_METADATA } from '../../../shared/consts/operatorTypes.const';
import { CreateOperatorStep1Page } from '../../pages/tabs/createNodeOperator/step1.page';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

test.describe('Operator without keys. Step 1.', async () => {
  let step1: CreateOperatorStep1Page;
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.page.goto('/');
    // @todo: should be used after fix bug
    // await widgetService.createNodeOperatorPage.open();
    step1 = widgetService.createNodeOperatorPage.step1;
  });

  test('Should display correct title and description', async ({}) => {
    await expect(step1.stepTrackText).toHaveText('Step 1 of 4');
    await expect(step1.stepTitle).toHaveText('Select Sub-Node Operator Type');
    await expect(step1.stepDescription).toHaveText(
      'Choose the type you want to create now. You can create additional Sub-Node Operators with other types later',
    );
  });

  Object.values(OPERATOR_TYPE)
    .filter((type) => type.startsWith('CM_'))
    .forEach((type) => {
      test(`Should display correct texts for operator type: ${type}`, async ({}) => {
        const getSelect = step1.getGateInput(type);
        const meta = OPERATOR_TYPE_METADATA[type];

        await test.step(`Should display correct title and description for operator type: ${type}`, async () => {
          await expect(getSelect.title).toHaveText(meta.name);
          await expect(getSelect.description).toHaveText(meta.description);
        });
      });
    });

  test('Should select operator type and show check icon', async ({}) => {
    const getSelect = step1.getGateInput(OPERATOR_TYPE.CM_PTO);
    await getSelect.click();

    await test.step('Should select operator type and show check icon', async () => {
      await expect(getSelect.input).toBeChecked();
      await expect(getSelect.checkIcon).toBeVisible();
      await expect(step1.continueButton).toBeEnabled();
    });
  });

  test('Should continue to the next step after selecting operator type', async ({
    widgetService,
  }) => {
    const getSelect = step1.getGateInput(OPERATOR_TYPE.CM_PTO);
    await getSelect.click();
    await step1.continueButton.click();

    await test.step('Should open the next step', async () => {
      await expect(
        widgetService.createNodeOperatorPage.createdOperatorForm,
      ).toContainText('Specify addresses');
    });
  });
});
