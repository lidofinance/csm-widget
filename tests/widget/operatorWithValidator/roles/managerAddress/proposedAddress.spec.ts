import { trimAddress } from '@lidofinance/address';
import { test } from '../../../test.fixture';
import { expect } from '@playwright/test';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mnemonicToAccount } from 'viem/accounts';
import { PAGE_WAIT_TIMEOUT } from 'tests/consts/timeouts';
import { generateAddress } from 'tests/helpers/accountData';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/consts/common.const';

test.describe(
  'Roles. Manager Address. Verify UI With Proposed Address',
  { tag: [Tags.performTX] },
  () => {
    let proposedAddress: string;

    test.beforeAll(async ({ widgetService }) => {
      await widgetService.rolesPage.managerAddressPage.open();
      proposedAddress = generateAddress();
      await widgetService.rolesPage.managerAddressPage.proposeNewAddress(
        proposedAddress,
      );
    });

    test.afterAll(async ({ widgetService }) => {
      await widgetService.rolesPage.managerAddressPage.open();
      await widgetService.page.waitForTimeout(1000);
      await widgetService.rolesPage.managerAddressPage.revokePendingRole();
    });

    test(
      qase(219, 'Verify the addresses field with proposed address'),
      async ({ widgetService, secretPhrase }) => {
        const managerAddressPage = widgetService.rolesPage.managerAddressPage;
        const address = mnemonicToAccount(secretPhrase).address;

        await test.step('Verify the "Current manager address" field', async () => {
          await expect(managerAddressPage.currentTitledAddress).toBeVisible();
          await expect(managerAddressPage.currentTitledAddress).toContainText(
            'Current manager address',
          );

          await expect(managerAddressPage.currentAddress).toContainText(
            trimAddress(address, 6),
          );
        });

        await test.step('Verify that proposal address is visible', async () => {
          await expect(managerAddressPage.proposedAddress).toBeVisible();

          await expect(managerAddressPage.pendingTitledAddress).toContainText(
            'Pending change',
          );

          await expect(
            managerAddressPage.proposedAddress.locator('> p').nth(0),
          ).toContainText('Action required');
          await expect(
            managerAddressPage.proposedAddress.locator('> div').nth(1),
          ).toContainText('Connect to CSM UI with the proposed address');
          await expect(
            managerAddressPage.proposedAddress.locator('> div').nth(1),
          ).toContainText(
            'Go to Roles tab → Inbox requests to confirm the change',
          );
        });
      },
    );

    test(qase(232, 'Verify input appearence'), async ({ widgetService }) => {
      const managerAddressPage = widgetService.rolesPage.managerAddressPage;

      await test.step('Verify input', async () => {
        await expect(managerAddressPage.addressInput).toBeVisible();
        await expect(managerAddressPage.addressInput).toHaveAttribute(
          'placeholder',
          'Ethereum address',
        );
        await expect(managerAddressPage.inputLabel).toContainText(
          'New manager address',
        );
      });
    });

    test(qase(233, 'Verify button appearence'), async ({ widgetService }) => {
      const managerAddressPage = widgetService.rolesPage.managerAddressPage;

      await test.step('Verify button', async () => {
        await expect(managerAddressPage.proposeButton).toBeVisible();
        await expect(managerAddressPage.proposeButton).toContainText(
          'Propose a new manager address',
        );
      });

      await test.step('Verify explanatory note below the button', async () => {
        await expect(managerAddressPage.note).toBeVisible();
        await expect(managerAddressPage.note).toContainText(
          'To complete the address change, the owner of the new address must confirm the change',
        );
      });
    });

    test(
      qase(220, 'Should open etherscan for current manager address'),
      async ({ widgetService, widgetConfig, secretPhrase }) => {
        const managerAddressPage = widgetService.rolesPage.managerAddressPage;

        await test.step('Verify erherscan for current address', async () => {
          const [etherscanPage] = await Promise.all([
            widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
            managerAddressPage.currentAddressEtherscanLink.click(),
          ]);
          expect(etherscanPage.url().toLowerCase()).toContain(
            `${widgetConfig.standConfig.networkConfig.scan}address/${mnemonicToAccount(secretPhrase).address.toLowerCase()}`,
          );
          await etherscanPage.close();
          await widgetService.page.waitForTimeout(5000);
        });

        await test.step('Verify erherscan for pending address', async () => {
          const [etherscanPageForPending] = await Promise.all([
            widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
            managerAddressPage.pendingAddressEtherscanLink.click(),
          ]);
          expect(etherscanPageForPending.url().toLowerCase()).toContain(
            `${widgetConfig.standConfig.networkConfig.scan}address/${proposedAddress.toLowerCase()}`,
          );
        });
      },
    );

    test(
      qase(221, 'Propose a new Manager Address with invalid input'),
      async ({ widgetService }) => {
        const managerAddressPage = widgetService.rolesPage.managerAddressPage;

        await managerAddressPage.addressInput.fill(`${generateAddress()}1`);

        const expectedTooltipError = 'Specify a valid address';
        await expect(managerAddressPage.validationInputTooltip).toContainText(
          expectedTooltipError,
        );
        await expect(managerAddressPage.proposeButton).toBeDisabled();
      },
    );

    test(
      qase(222, 'Propose a new Manager Address with same address'),
      async ({ widgetService, secretPhrase }) => {
        const managerAddressPage = widgetService.rolesPage.managerAddressPage;

        await managerAddressPage.addressInput.fill(
          mnemonicToAccount(secretPhrase).address,
        );

        const expectedTooltipError = 'Should not be same as current address';
        await expect(managerAddressPage.validationInputTooltip).toContainText(
          expectedTooltipError,
        );
        await expect(managerAddressPage.proposeButton).toBeDisabled();
      },
    );
  },
);
