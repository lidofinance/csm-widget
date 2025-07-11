import { expect } from '@playwright/test';
import { test } from '../../../../test.fixture';
import { trimAddress } from '@lidofinance/address';
import {
  LOW_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
  WALLET_PAGE_TIMEOUT_WAITER,
} from 'tests/consts/timeouts';
import { qase } from 'playwright-qase-reporter/playwright';
import { generateAddress } from 'tests/helpers/accountData';
import { Tags } from 'tests/consts/common.const';

test.describe('Roles. Manager Address. Transactions. Revoke Manager role changes', () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.rolesPage.managerAddressPage.open();
    const managerAddressPage = widgetService.rolesPage.managerAddressPage;
    const accountForRolesChanged = generateAddress();

    await managerAddressPage.proposeNewAddress(accountForRolesChanged);
    await widgetService.page.waitForTimeout(LOW_TIMEOUT);
  });

  test.afterAll(async ({ widgetService }) => {
    await test.step('Revoke proposal role', async () => {
      // @todo: need to add cancel all tx before.
      await widgetService.rolesPage.managerAddressPage.open();
      await widgetService.page.waitForTimeout(1000);
      await widgetService.rolesPage.managerAddressPage.revokePendingRole();
    });
  });

  test(
    qase(226, 'Should display tx modal after revoke Manager role changes'),
    async ({ widgetService }) => {
      const managerAddressPage = widgetService.rolesPage.managerAddressPage;

      await test.step('Revoke pending manager address role', async () => {
        const [txPage] = await Promise.all([
          managerAddressPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
          managerAddressPage.revokeButton.click(),
        ]);

        await managerAddressPage.page.waitForSelector(
          `text=You are revoking request for manager address change`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );

        await test.step('Verify transaction modal', async () => {
          const { txModal } = widgetService.rolesPage;

          await expect(txModal.description).toContainText('Address stays');

          await expect(txModal.description).toContainText(
            trimAddress(
              '0x0000000000000000000000000000000000000000000000000000000000000000',
              6,
            ),
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
    qase(208, 'Should success complete transacrion revoke Manager role change'),
    { tag: [Tags.performTX] },
    async ({ widgetService }) => {
      const managerAddressPage = widgetService.rolesPage.managerAddressPage;

      const [txPage] = await Promise.all([
        managerAddressPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
        managerAddressPage.revokeButton.click(),
      ]);

      await managerAddressPage.page.waitForSelector(
        `text=You are revoking request for manager address change`,
        { timeout: STAGE_WAIT_TIMEOUT },
      );

      await test.step('Verify confirm transaction', async () => {
        await widgetService.walletPage.confirmTx(txPage);

        await managerAddressPage.page.waitForSelector(
          `text=Proposed request for manager address has been revoked`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );

        const { txModal } = widgetService.rolesPage;
        await expect(txModal.description).toContainText('Address stays');

        await expect(txModal.description).toContainText(
          trimAddress(
            '0x0000000000000000000000000000000000000000000000000000000000000000',
            6,
          ),
        );

        await expect(txModal.footerHint).toContainText('View on Etherscan');
      });
    },
  );
});
