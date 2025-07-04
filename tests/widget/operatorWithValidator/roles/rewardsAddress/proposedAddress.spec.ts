import { trimAddress } from '@lidofinance/address';
import { test } from '../../../test.fixture';
import { expect } from '@playwright/test';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mnemonicToAccount } from 'viem/accounts';
import { PAGE_WAIT_TIMEOUT } from 'tests/consts/timeouts';
import { generateAddress } from 'tests/helpers/accountData';
import { qase } from 'playwright-qase-reporter/playwright';

test.describe('Roles. Rewards Address. Verify UI With Proposed Address', () => {
  let proposedAddress: string;

  test.beforeAll(async ({ widgetService }) => {
    await widgetService.rolesPage.rewardsAddressPage.open();
    proposedAddress = generateAddress();
    await widgetService.rolesPage.rewardsAddressPage.proposeNewAddress(
      proposedAddress,
    );
  });

  test.afterAll(async ({ widgetService }) => {
    await widgetService.rolesPage.rewardsAddressPage.open();
    await widgetService.page.waitForTimeout(1000);
    await widgetService.rolesPage.rewardsAddressPage.revokePendingRole();
  });

  test(
    qase(213, 'Verify UI elements in the "Rewards Address" tab'),
    async ({ widgetService, secretPhrase }) => {
      const rewardsAddressPage = widgetService.rolesPage.rewardsAddressPage;
      const address = mnemonicToAccount(secretPhrase).address;

      await test.step('Verify the "Current rewards address" field', async () => {
        await expect(rewardsAddressPage.currentTitledAddress).toBeVisible();
        await expect(rewardsAddressPage.currentTitledAddress).toContainText(
          'Current rewards address',
        );

        await expect(rewardsAddressPage.currentAddress).toContainText(
          trimAddress(address, 6),
        );
      });

      await test.step('Verify that proposal address is visible', async () => {
        await expect(rewardsAddressPage.proposedAddress).toBeVisible();
        await expect(rewardsAddressPage.pendingTitledAddress).toContainText(
          'Pending change',
        );

        await expect(
          rewardsAddressPage.proposedAddress.locator('> p').nth(0),
        ).toContainText('Action required');
        await expect(
          rewardsAddressPage.proposedAddress.locator('> p').nth(1),
        ).toContainText('Connect to CSM UI with the proposed address');
        await expect(
          rewardsAddressPage.proposedAddress.locator('> p').nth(1),
        ).toContainText(
          'Go to Roles tab → Inbox requests to confirm the change',
        );
      });

      await test.step('Verify input', async () => {
        await expect(rewardsAddressPage.addressInput).toBeVisible();
        await expect(rewardsAddressPage.addressInput).toHaveAttribute(
          'placeholder',
          'Ethereum address',
        );
        await expect(rewardsAddressPage.inputLabel).toContainText(
          'New rewards address',
        );
      });

      await test.step('Verify button', async () => {
        await expect(rewardsAddressPage.proposeButton).toBeVisible();
        await expect(rewardsAddressPage.proposeButton).toContainText(
          'Propose a new rewards address',
        );
      });

      await test.step('Verify explanatory note below the button', async () => {
        await expect(rewardsAddressPage.note).toBeVisible();
        await expect(rewardsAddressPage.note).toContainText(
          'To complete the address change, the owner of the new address must confirm the change',
        );
      });
    },
  );

  test(
    qase(214, 'Should open etherscan for current rewards address'),
    async ({ widgetService, widgetConfig, secretPhrase }) => {
      const rewardsAddressPage = widgetService.rolesPage.rewardsAddressPage;

      await test.step('Verify erherscan for current address', async () => {
        const [etherscanPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          rewardsAddressPage.currentAddressEtherscanLink.click(),
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
          rewardsAddressPage.pendingAddressEtherscanLink.click(),
        ]);
        expect(etherscanPageForPending.url().toLowerCase()).toContain(
          `${widgetConfig.standConfig.networkConfig.scan}address/${proposedAddress.toLowerCase()}`,
        );
      });
    },
  );

  test(
    qase(215, 'Propose a new Rewards Address with invalid input'),
    async ({ widgetService }) => {
      const rewardsAddressPage = widgetService.rolesPage.rewardsAddressPage;

      await rewardsAddressPage.addressInput.fill(`${generateAddress()}1`);

      const expectedTooltipError = 'Specify a valid address';
      await expect(rewardsAddressPage.validationInputTooltip).toContainText(
        expectedTooltipError,
      );
      await expect(rewardsAddressPage.proposeButton).toBeDisabled();
    },
  );

  test(
    qase(216, 'Propose a new Rewards Address with same address'),
    async ({ widgetService, secretPhrase }) => {
      const rewardsAddressPage = widgetService.rolesPage.rewardsAddressPage;

      await rewardsAddressPage.addressInput.fill(
        mnemonicToAccount(secretPhrase).address,
      );

      const expectedTooltipError = 'Should not be same as current address';
      await expect(rewardsAddressPage.validationInputTooltip).toContainText(
        expectedTooltipError,
      );
      await expect(rewardsAddressPage.proposeButton).toBeDisabled();
    },
  );
});
