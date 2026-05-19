/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { test } from '../../test.fixture';
import { mnemonicToAccount } from 'viem/accounts';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';

test.describe('Dashboard. Roles.', () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.dashboardPage.open();
  });

  test(
    qase(127, 'Should correct display reward address information'),
    async ({ widgetService, widgetConfig, secretPhrase }) => {
      const rewardAddressRow =
        widgetService.dashboardPage.rolesSection.rewardAddressRow;
      const currentAddress = mnemonicToAccount(secretPhrase).address;

      await test.step('Check reward address information', async () => {
        await expect(rewardAddressRow.locator('p')).toContainText(
          'Rewards Address',
        );
        await expect(rewardAddressRow.getByTestId('youChip')).toBeVisible();
        await expect(
          rewardAddressRow.getByTestId('ownerChip'),
        ).not.toBeVisible();
        await expect(
          rewardAddressRow.getByTestId('addressContainer'),
        ).toContainText(currentAddress);
      });

      await test.step('Check reward address etherscan link', async () => {
        const [etherscanPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          rewardAddressRow.getByTestId('etherscanLink').click(),
        ]);
        expect(etherscanPage.url()).toContain(
          `${widgetConfig.standConfig.networkConfig.scan}address/${currentAddress}`,
        );
      });
    },
  );

  test(
    qase(128, 'Should correct display manager address information'),
    async ({ widgetService, widgetConfig, secretPhrase }) => {
      const managerAddressRow =
        widgetService.dashboardPage.rolesSection.managerAddressRow;
      const currentAddress = mnemonicToAccount(secretPhrase).address;

      await test.step('Check manager address information', async () => {
        await expect(managerAddressRow.locator('p')).toContainText(
          'Manager Address',
        );
        await expect(managerAddressRow.getByTestId('youChip')).toBeVisible();
        await expect(managerAddressRow.getByTestId('ownerChip')).toBeVisible();
        await expect(
          managerAddressRow.getByTestId('addressContainer'),
        ).toContainText(currentAddress);
      });

      await test.step('Check manager address etherscan link', async () => {
        const [etherscanPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          managerAddressRow.getByTestId('etherscanLink').click(),
        ]);
        expect(etherscanPage.url()).toContain(
          `${widgetConfig.standConfig.networkConfig.scan}address/${currentAddress}`,
        );
      });
    },
  );

  test(
    qase(129, 'Should correct display empty rewards claimer'),
    async ({ widgetService }) => {
      const claimerAddressRow =
        widgetService.dashboardPage.rolesSection.claimerAddressRow;
      await test.step('Check reward claimer information', async () => {
        await expect(claimerAddressRow.locator('p')).toContainText(
          'Rewards claimer',
        );
        await expect(
          claimerAddressRow.getByRole('button', { name: 'Set up' }),
        ).toBeVisible();
      });

      await test.step('Check reward address etherscan link', async () => {
        await claimerAddressRow.getByRole('button', { name: 'Set up' }).click();
        await widgetService.page.waitForURL('**/settings/claimer', {
          timeout: PAGE_WAIT_TIMEOUT,
        });
      });
    },
  );

  test(
    qase(130, 'Should correct display empty rewards splitter'),
    async ({ widgetService }) => {
      const feeSplitsRow =
        widgetService.dashboardPage.rolesSection.feeSplitsRow;
      await test.step('Check reward claimer information', async () => {
        await expect(feeSplitsRow.locator('p')).toContainText(
          'Rewards splitter',
        );
        await expect(
          feeSplitsRow.getByRole('button', { name: 'Set up' }),
        ).toBeVisible();
      });

      await test.step('Check reward address etherscan link', async () => {
        await feeSplitsRow.getByRole('button', { name: 'Set up' }).click();
        await widgetService.page.waitForURL('**/settings/splits', {
          timeout: PAGE_WAIT_TIMEOUT,
        });
      });
    },
  );
});
