import { trimAddress } from '@lidofinance/address';
import { test } from '../../../test.fixture';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mnemonicToAccount } from 'viem/accounts';
import { PAGE_WAIT_TIMEOUT } from 'tests/consts/timeouts';
import { generateAddress } from 'tests/helpers/accountData';

test.describe('Roles. Manager Address. Verify UI Without Proposed Address', () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.rolesPage.managerAddressPage.open();
    await widgetService.rolesPage.managerAddressPage.revokePendingRole();
  });

  test(
    qase(71, 'Verify the addresses field'),
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

      await test.step('Verify that proposal address is hidden', async () => {
        await expect(managerAddressPage.proposedAddress).toBeHidden();
      });
    },
  );

  test(qase(234, 'Verify input appearence'), async ({ widgetService }) => {
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

  test(qase(235, 'Verify button appearence'), async ({ widgetService }) => {
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
    qase(210, 'Should open etherscan for current manager address'),
    async ({ widgetService, widgetConfig, secretPhrase }) => {
      const managerAddressPage = widgetService.rolesPage.managerAddressPage;

      const [etherscanPage] = await Promise.all([
        widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
        managerAddressPage.currentAddressEtherscanLink.click(),
      ]);
      expect(etherscanPage.url().toLowerCase()).toContain(
        `${widgetConfig.standConfig.networkConfig.scan}address/${mnemonicToAccount(secretPhrase).address.toLowerCase()}`,
      );
    },
  );

  test(
    qase(211, 'Propose a new Manager Address with invalid input'),
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
    qase(212, 'Propose a new Manager Address with same address'),
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
});
