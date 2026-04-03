/* eslint-disable no-empty-pattern */
import { test } from '../test.fixture';
import { expect, Locator } from '@playwright/test';
import { CreateOperatorStep2Page } from '../../pages/tabs/createNodeOperator';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { mnemonicToAccount } from 'viem/accounts';

const VALID_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';

type AddressField = {
  label: string;
  hintText: string;
  tooltipContent: string[];
  getInput: (step2: CreateOperatorStep2Page) => Locator;
  getContainer: (step2: CreateOperatorStep2Page) => Locator;
  getError: (step2: CreateOperatorStep2Page) => Locator;
  getConnectedButton: (step2: CreateOperatorStep2Page) => Locator;
  getTooltipIcon: (step2: CreateOperatorStep2Page) => Locator;
};

const addressFields: AddressField[] = [
  {
    label: 'Manager Address',
    hintText:
      'Has the ultimate control over the Node Operator. Must be a multisig',
    tooltipContent: [
      'Adding new keys',
      'Removing existing keys',
      'Adding extra bond amount',
      'Claiming bond and rewards to the Rewards Address',
      'Covering locked bond',
      'Proposing a new Manager Address',
      'Changing Rewards Address',
      'Set up rewards splits',
      'Change name and description',
    ],
    getInput: (s) => s.managerAddressInput,
    getContainer: (s) => s.managerAddressContainer,
    getError: (s) => s.managerAddressError,
    getConnectedButton: (s) => s.managerAddressConnectedButton,
    getTooltipIcon: (s) => s.managerAddressTooltipIcon,
  },
  {
    label: 'Rewards Address',
    hintText:
      'Used for receiving rewards. Must be a multisig or smart contract address',
    tooltipContent: [
      'Claiming bond and rewards',
      'Adding extra bond amount',
      'Proposing a new Rewards Address',
    ],
    getInput: (s) => s.rewardAddressInput,
    getContainer: (s) => s.rewardAddressContainer,
    getError: (s) => s.rewardAddressError,
    getConnectedButton: (s) => s.rewardAddressConnectedButton,
    getTooltipIcon: (s) => s.rewardAddressTooltipIcon,
  },
];

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

test.describe('Operator without keys. Step 2.', () => {
  let step2: CreateOperatorStep2Page;
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.page.goto('/');
    // @todo: should be used after fix bug
    // await widgetService.createNodeOperatorPage.open();
    step2 = widgetService.createNodeOperatorPage.step2;
    await widgetService.createNodeOperatorPage.step1.fillForm(
      OPERATOR_TYPE.CM_PTO,
    );
  });

  test('Should display correct all texts', async ({}) => {
    await expect(step2.stepTrackText).toHaveText('Step 2 of 4');
    await expect(step2.stepTitle).toHaveText('Specify addresses');
    await expect(step2.stepDescription).toHaveText(
      'Manager Address will have the ultimate control over the Node Operator, while Rewards Address is only used to receive rewards.',
    );
    await expect(step2.form).toContainText(
      'Rewards Address cannot reset the Manager Address',
    );
    await expect(step2.form).toContainText(
      'Manager Address can change the Rewards Address',
    );
    await expect(step2.form).toContainText(
      'warning: Setting addresses for the Node Operator is at your own risk. If you specify an incorrect or incompatible address, you may permanently lose access to your Node Operator, bond, and potential rewards.',
    );
  });

  test('Manager Address: Should display Owner badge', async ({}) => {
    await expect(step2.managerAddressOwnerChip).toBeVisible();
    await expect(step2.managerAddressOwnerChip).toHaveText('Owner');
  });

  test('Should navigate back to step 1 on Back button click', async ({
    widgetService,
  }) => {
    await step2.backButton.click();

    await expect(
      widgetService.createNodeOperatorPage.step1.stepTrackText,
    ).toHaveText('Step 1 of 4');
  });

  addressFields.forEach(
    ({
      label,
      hintText,
      tooltipContent,
      getInput,
      getContainer,
      getError,
      getConnectedButton,
      getTooltipIcon,
    }) => {
      test(`${label}: Should display input with correct label`, async ({}) => {
        await expect(getInput(step2)).toBeVisible();
        await expect(getContainer(step2).locator('label')).toContainText(label);
      });

      test(`${label}: Should display hint text`, async ({}) => {
        await expect(step2.form).toContainText(hintText);
      });

      test(`${label}: Should show tooltip content on hover`, async ({}) => {
        const tooltipText = await step2.hoverElement(getTooltipIcon(step2));

        for (const item of tooltipContent) {
          expect(tooltipText).toContain(item);
        }

        await test.step('Tooltip should hide after unhover', async () => {
          await step2.closeTooltip();
          const content = await step2.getHoveredContent();
          await expect(content).toBeHidden();
        });
      });

      test(`${label}: Should show validation error for invalid address`, async ({}) => {
        await test.step('Fill with invalid value and blur', async () => {
          await getInput(step2).fill('invalid-address');
          await getInput(step2).blur();
        });

        await expect(getError(step2)).toHaveText('Specify valid Address');
      });

      test(`${label}: Should show validation error after clearing a touched input`, async ({}) => {
        await test.step('Fill then clear the input', async () => {
          await getInput(step2).fill('0x123');
          await getInput(step2).clear();
          await getInput(step2).blur();
        });

        await expect(getError(step2)).toHaveText('Specify valid Address');
      });

      test(`${label}: Should not show validation error for valid address`, async ({}) => {
        await getInput(step2).fill(VALID_ADDRESS);
        await getInput(step2).blur();

        await expect(getError(step2)).toBeHidden();
      });

      test(`${label}: Should fill input with connected wallet address on button click`, async ({
        secretPhrase,
      }) => {
        const currentAddress = mnemonicToAccount(secretPhrase).address;

        await test.step('Click Connected address button', async () => {
          await getConnectedButton(step2).click();
        });

        await expect(getInput(step2)).toHaveValue(currentAddress);
        await expect(getError(step2)).toBeHidden();
      });

      test(`Should be disabled when only ${label} is filled`, async () => {
        await getInput(step2).fill(VALID_ADDRESS);
        await getInput(step2).blur();

        await expect(step2.continueButton).toBeDisabled();
      });
    },
  );

  test('Should enable Continue button when both addresses are valid', async ({}) => {
    await test.step('Fill both address fields', async () => {
      await step2.managerAddressInput.fill(VALID_ADDRESS);
      await step2.rewardAddressInput.fill(VALID_ADDRESS);
      await step2.rewardAddressInput.blur();
    });

    await expect(step2.continueButton).toBeEnabled();
  });
});
