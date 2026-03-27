import { expect } from '@playwright/test';
import { test } from '../../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import {
  LOW_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
} from '../../../../../../shared/consts/timeouts';
import { generateAddress } from '../../../../../../shared/helpers/accountData';
import { Tags } from '../../../../../../shared/consts/common.const';
import { mnemonicToAccount } from 'viem/accounts';
import { trimAddress } from '@lidofinance/address';

test.describe('Roles. Rewards Address. Transactions. Revoke role changes', () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.settingsPage.rewardsAddressPage.open();
    const accountForRolesChanged = generateAddress();
    const rewardsAddressPage = widgetService.settingsPage.rewardsAddressPage;
    await rewardsAddressPage.proposeNewAddress(accountForRolesChanged);
    await widgetService.page.waitForTimeout(LOW_TIMEOUT);
  });

  test.afterAll(async ({ widgetService }) => {
    await test.step('Revoke proposal role', async () => {
      // @todo: need to add cancel all tx before.
      await widgetService.settingsPage.rewardsAddressPage.open();
      await widgetService.page.waitForTimeout(LOW_TIMEOUT);
      await widgetService.settingsPage.rewardsAddressPage.revokePendingRole();
    });
  });

  test(
    qase(231, 'Should display tx modal after revoke Reward role changes'),
    async ({ widgetService, secretPhrase }) => {
      const rewardsAddressPage = widgetService.settingsPage.rewardsAddressPage;
      const currentAddress = mnemonicToAccount(secretPhrase).address;

      await test.step('Revoke pending rewards address role', async () => {
        await rewardsAddressPage.revokeButton.click();

        await rewardsAddressPage.page.waitForSelector(
          `text=You are canceling request for rewards address change`,
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
    qase(156, 'Should success complete revoke Reward role changes'),
    { tag: [Tags.smoke, Tags.performTX] },
    async ({ widgetService, secretPhrase }) => {
      const rewardsAddressPage = widgetService.settingsPage.rewardsAddressPage;
      const currentAddress = mnemonicToAccount(secretPhrase).address;

      await rewardsAddressPage.revokeButton.click();

      await rewardsAddressPage.page.waitForSelector(
        `text=You are canceling request for rewards address change`,
        { timeout: STAGE_WAIT_TIMEOUT },
      );

      await test.step('Verify confirm transaction', async () => {
        await widgetService.walletPage.confirmTx();

        await rewardsAddressPage.page.waitForSelector(
          `text=Proposed request for rewards address has been canceled`,
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
