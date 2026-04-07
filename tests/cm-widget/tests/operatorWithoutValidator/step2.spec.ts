/* eslint-disable no-empty-pattern */
import { test } from '../test.fixture';
import { expect, Locator } from '@playwright/test';
import { CreateOperatorStep2Page } from '../../pages/tabs/createNodeOperator';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { mnemonicToAccount } from 'viem/accounts';
import { qase } from 'playwright-qase-reporter/playwright';

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

  test(qase(31, 'Should display correct all texts'), async ({}) => {
    await test.step('Check step track text', async () => {
      await expect(
        step2.stepTrackText,
        'Step track should display "Step 2 of 4"',
      ).toHaveText('Step 2 of 4');
    });

    await test.step('Check step title', async () => {
      await expect(
        step2.stepTitle,
        'Step title should display "Specify addresses"',
      ).toHaveText('Specify addresses');
    });

    await test.step('Check step description', async () => {
      await expect(
        step2.stepDescription,
        'Step description should display correct hint text',
      ).toHaveText(
        'Manager Address will have the ultimate control over the Node Operator, while Rewards Address is only used to receive rewards.',
      );
    });

    await test.step('Check form warning texts', async () => {
      await expect(
        step2.form,
        'Form should display "Rewards Address cannot reset the Manager Address" warning',
      ).toContainText('Rewards Address cannot reset the Manager Address');

      await expect(
        step2.form,
        'Form should display "Manager Address can change the Rewards Address" warning',
      ).toContainText('Manager Address can change the Rewards Address');

      await expect(
        step2.form,
        'Form should display risk warning about setting addresses',
      ).toContainText(
        'warning: Setting addresses for the Node Operator is at your own risk. If you specify an incorrect or incompatible address, you may permanently lose access to your Node Operator, bond, and potential rewards.',
      );
    });
  });

  test(
    qase(32, 'Should display Owner badge for Manager Address'),
    async ({}) => {
      await test.step('Check Owner badge is visible', async () => {
        await expect(
          step2.managerAddressOwnerChip,
          'Manager Address should display "Owner" badge',
        ).toBeVisible();

        await expect(
          step2.managerAddressOwnerChip,
          '"Owner" badge should have correct label',
        ).toHaveText('Owner');
      });
    },
  );

  test(
    qase(33, 'Should navigate back to step 1 on Back button click'),
    async ({ widgetService }) => {
      await test.step('Click "Back" button', async () => {
        await step2.backButton.click();
      });

      await test.step('Check step 1 is displayed', async () => {
        await expect(
          widgetService.createNodeOperatorPage.step1.stepTrackText,
          'Step track should display "Step 1 of 4" after going back',
        ).toHaveText('Step 1 of 4');
      });
    },
  );

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
      test(
        qase(34, `${label}: Should display inputs with correct label`),
        async ({}) => {
          qase.parameters({ label });
          await test.step(`Check "${label}" input is visible`, async () => {
            await expect(
              getInput(step2),
              `"${label}" input should be visible`,
            ).toBeVisible();
          });

          await test.step(`Check "${label}" input label`, async () => {
            await expect(
              getContainer(step2).locator('label'),
              `"${label}" input should have correct label`,
            ).toContainText(label);
          });
        },
      );

      test(qase(35, `${label}: Should display hint text`), async ({}) => {
        qase.parameters({ label });
        await test.step(`Check "${label}" hint text`, async () => {
          await expect(
            step2.form,
            `Form should display "${hintText}" hint for ${label}`,
          ).toContainText(hintText);
        });
      });

      test(
        qase(45, `${label}: Should show tooltip content on hover`),
        async ({}) => {
          qase.parameters({ label });
          await test.step(`Hover over "${label}" tooltip icon`, async () => {
            const tooltipText = await step2.hoverElement(getTooltipIcon(step2));

            for (const item of tooltipContent) {
              expect(tooltipText, `Tooltip should contain "${item}"`).toContain(
                item,
              );
            }
          });

          await test.step('Tooltip should hide after unhover', async () => {
            await step2.closeTooltip();
            await expect(
              await step2.getHoveredContent(),
              'Tooltip should be hidden after unhover',
            ).toBeHidden();
          });
        },
      );

      test(
        qase(47, `${label}: Should show validation error for invalid address`),
        async ({}) => {
          qase.parameters({ label });
          await test.step('Fill with invalid value and blur', async () => {
            await getInput(step2).fill('invalid-address');
            await getInput(step2).blur();
          });

          await test.step('Check validation error is displayed', async () => {
            await expect(
              getError(step2),
              `"${label}" should show "Specify valid Address" error for invalid input`,
            ).toHaveText('Specify valid Address');
          });
        },
      );

      test(
        qase(
          48,
          `${label}: Should show validation error after clearing an input`,
        ),
        async ({}) => {
          qase.parameters({ label });
          await test.step('Fill then clear the input', async () => {
            await getInput(step2).fill('0x123');
            await getInput(step2).clear();
            await getInput(step2).blur();
          });

          await test.step('Check validation error is displayed', async () => {
            await expect(
              getError(step2),
              `"${label}" should show "Specify valid Address" error after clearing`,
            ).toHaveText('Specify valid Address');
          });
        },
      );

      test(
        qase(
          36,
          `${label}: Should not show validation error for valid address`,
        ),
        async ({}) => {
          qase.parameters({ label });
          await test.step('Fill with valid address and blur', async () => {
            await getInput(step2).fill(VALID_ADDRESS);
            await getInput(step2).blur();
          });

          await test.step('Check no validation error is displayed', async () => {
            await expect(
              getError(step2),
              `"${label}" should not show error for valid address`,
            ).toBeHidden();
          });
        },
      );

      test(
        qase(
          37,
          `${label}: Should fill input with connected wallet address on button click`,
        ),
        async ({ secretPhrase }) => {
          qase.parameters({ label });
          const currentAddress = mnemonicToAccount(secretPhrase).address;

          await test.step('Click "Connected address" button', async () => {
            await getConnectedButton(step2).click();
          });

          await test.step('Check input is filled with connected wallet address', async () => {
            await expect(
              getInput(step2),
              `"${label}" input should be filled with connected wallet address`,
            ).toHaveValue(currentAddress);

            await expect(
              getError(step2),
              `"${label}" should not show error for connected wallet address`,
            ).toBeHidden();
          });
        },
      );

      test(
        qase(
          43,
          `Should be disabled button 'Continue' when only ${label} is filled`,
        ),
        async () => {
          qase.parameters({ label });
          await test.step(`Fill only "${label}" and blur`, async () => {
            await getInput(step2).fill(VALID_ADDRESS);
            await getInput(step2).blur();
          });

          await test.step('Check "Continue" button is disabled', async () => {
            await expect(
              step2.continueButton,
              '"Continue" button should be disabled when only one address is filled',
            ).toBeDisabled();
          });
        },
      );
    },
  );

  test(
    qase(44, 'Should enable Continue button when both addresses are valid'),
    async ({}) => {
      await test.step('Fill both address fields', async () => {
        await step2.managerAddressInput.fill(VALID_ADDRESS);
        await step2.rewardAddressInput.fill(VALID_ADDRESS);
        await step2.rewardAddressInput.blur();
      });

      await test.step('Check "Continue" button is enabled', async () => {
        await expect(
          step2.continueButton,
          '"Continue" button should be enabled when both addresses are valid',
        ).toBeEnabled();
      });
    },
  );
});
