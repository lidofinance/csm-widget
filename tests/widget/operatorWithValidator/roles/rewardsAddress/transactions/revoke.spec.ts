import { expect } from '@playwright/test';
import { test } from '../../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import {
  LOW_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
  WALLET_PAGE_TIMEOUT_WAITER,
} from 'tests/consts/timeouts';
import { generateAddress } from 'tests/helpers/accountData';
import { Tags } from 'tests/consts/common.const';
import { mnemonicToAccount } from 'viem/accounts';
import { trimAddress } from '@lidofinance/address';

test.describe('Roles. Rewards Address. Transactions. Revoke role changes', () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.rolesPage.rewardsAddressPage.open();
    const accountForRolesChanged = generateAddress();
    const rewardsAddressPage = widgetService.rolesPage.rewardsAddressPage;
    await rewardsAddressPage.proposeNewAddress(accountForRolesChanged);
    await widgetService.page.waitForTimeout(LOW_TIMEOUT);
  });

  test.afterAll(async ({ widgetService }) => {
    await test.step('Revoke proposal role', async () => {
      // @todo: need to add cancel all tx before.
      await widgetService.rolesPage.rewardsAddressPage.open();
      await widgetService.page.waitForTimeout(LOW_TIMEOUT);
      await widgetService.rolesPage.rewardsAddressPage.revokePendingRole();
    });
  });

  test(
    qase(231, 'Should display tx modal after revoke Reward role changes'),
    async ({ widgetService, secretPhrase }) => {
      const rewardsAddressPage = widgetService.rolesPage.rewardsAddressPage;
      const currentAddress = mnemonicToAccount(secretPhrase).address;

      await test.step('Revoke pending rewards address role', async () => {
        const [txPage] = await Promise.all([
          rewardsAddressPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
          rewardsAddressPage.revokeButton.click(),
        ]);

        await rewardsAddressPage.page.waitForSelector(
          `text=You are revoking request for rewards address change`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );

        await test.step('Verify transaction modal', async () => {
          const { txModal } = widgetService.rolesPage;

          await expect(txModal.description).toContainText('Address stays');

          await expect(txModal.description).toContainText(
            trimAddress(currentAddress, 6),
          );
          await expect(txModal.footerHint).toHaveText(
            'Confirm this transaction in your wallet',
          );
        });
        await widgetService.walletPage.cancelTx(txPage);
      });
    },
  );

  test(
    qase(156, 'Should success complete revoke Reward role changes'),
    { tag: [Tags.smoke, Tags.performTX] },
    async ({ widgetService, secretPhrase }) => {
      const rewardsAddressPage = widgetService.rolesPage.rewardsAddressPage;
      const currentAddress = mnemonicToAccount(secretPhrase).address;

      const [txPage] = await Promise.all([
        rewardsAddressPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
        rewardsAddressPage.revokeButton.click(),
      ]);

      await rewardsAddressPage.page.waitForSelector(
        `text=You are revoking request for rewards address change`,
        { timeout: STAGE_WAIT_TIMEOUT },
      );

      await test.step('Verify confirm transaction', async () => {
        await widgetService.walletPage.confirmTx(txPage);

        await rewardsAddressPage.page.waitForSelector(
          `text=Proposed request for rewards address has been revoked`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );

        const { txModal } = widgetService.rolesPage;
        await expect(txModal.description).toContainText('Address stays');
        await expect(txModal.description).toContainText(
          trimAddress(currentAddress, 6),
        );
        await expect(txModal.footerHint).toContainText('View on Etherscan');
      });
    },
  );
});
