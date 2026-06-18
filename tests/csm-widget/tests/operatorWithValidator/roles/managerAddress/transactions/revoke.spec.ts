import { expect } from '@playwright/test';
import { test } from '../../../../test.fixture';
import { LOW_TIMEOUT, STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { qase } from 'playwright-qase-reporter/playwright';
import { generateAddress } from 'tests/shared/helpers/accountData';
import { Tags } from 'tests/shared/consts/common.const';
import { trimAddress } from '@lidofinance/address';
import { mnemonicToAccount } from 'viem/accounts';

test.describe('Roles. Manager Address. Transactions. Revoke Manager role changes', () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.settingsPage.managerAddressPage.open();
    const managerAddressPage = widgetService.settingsPage.managerAddressPage;
    const accountForRolesChanged = generateAddress();

    await managerAddressPage.proposeNewAddress(accountForRolesChanged);
    await widgetService.page.waitForTimeout(LOW_TIMEOUT);
  });

  test.afterAll(async ({ widgetService }) => {
    await test.step('Revoke proposal role', async () => {
      // @todo: need to add cancel all tx before.
      await widgetService.settingsPage.managerAddressPage.open();
      await widgetService.page.waitForTimeout(1000);
      await widgetService.settingsPage.managerAddressPage.revokePendingRole();
    });
  });

  test(
    qase(226, 'Should display tx modal after revoke Manager role changes'),
    async ({ widgetService, secretPhrase }) => {
      const managerAddressPage = widgetService.settingsPage.managerAddressPage;
      const currentAddress = mnemonicToAccount(secretPhrase).address;

      await test.step('Revoke pending manager address role', async () => {
        await managerAddressPage.revokeButton.click();

        await managerAddressPage.page.waitForSelector(
          `text=You are canceling request for manager address change`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );

        await test.step('Verify transaction modal', async () => {
          const { txModal } = widgetService.settingsPage;

          await expect(txModal.description).toContainText('Address stays');

          await expect(txModal.description).toContainText(
            trimAddress(currentAddress, 6),
          );
          await expect(txModal.footerHint).toHaveText(
            'Confirm this transaction in your wallet',
          );
        });

        await widgetService.walletPage.cancelTx();
      });
    },
  );

  test(
    qase(208, 'Should success complete transacrion revoke Manager role change'),
    { tag: [Tags.performTX] },
    async ({ widgetService, secretPhrase }) => {
      const managerAddressPage = widgetService.settingsPage.managerAddressPage;
      const currentAddress = mnemonicToAccount(secretPhrase).address;

      await managerAddressPage.revokeButton.click();

      await managerAddressPage.page.waitForSelector(
        `text=You are canceling request for manager address change`,
        { timeout: STAGE_WAIT_TIMEOUT },
      );

      await test.step('Verify confirm transaction', async () => {
        await widgetService.walletPage.confirmTx();

        await managerAddressPage.page.waitForSelector(
          `text=Proposed request for manager address has been canceled`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );

        const { txModal } = widgetService.settingsPage;

        await expect(txModal.description).toContainText('Address stays');
        await expect(txModal.description).toContainText(
          trimAddress(currentAddress, 6),
        );
        await expect(txModal.footerHint).toContainText('View on Etherscan');
      });
    },
  );
});
