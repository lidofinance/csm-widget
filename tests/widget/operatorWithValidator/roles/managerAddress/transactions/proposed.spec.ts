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

test.describe('Roles. Manager Address. Transactions. Proposed Address', () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.rolesPage.managerAddressPage.open();
  });

  test.afterEach(async ({ widgetService }) => {
    await test.step('Revoke proposal role', async () => {
      // @todo: need to add cancel all tx before.
      await widgetService.rolesPage.managerAddressPage.open();
      await widgetService.page.waitForTimeout(1000);
      await widgetService.rolesPage.managerAddressPage.revokePendingRole();
    });
  });

  test('Should display tx modal after approve warning after propose button', async ({
    widgetService,
  }) => {
    const managerAddressPage = widgetService.rolesPage.managerAddressPage;

    const accountForRolesChanged = generateAddress();

    await managerAddressPage.addressInput.fill(accountForRolesChanged);
    await widgetService.page.waitForTimeout(LOW_TIMEOUT);
    await managerAddressPage.addressValidIcon.waitFor({
      state: 'visible',
    });

    const [txPage] = await Promise.all([
      managerAddressPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
      managerAddressPage.proposeButton.click(),
    ]);

    await managerAddressPage.page.waitForSelector(
      `text=You are proposing manager address change`,
      { timeout: STAGE_WAIT_TIMEOUT },
    );

    await test.step('Verify transaction modal', async () => {
      const { txModal } = widgetService.rolesPage;

      await expect(txModal.description).toContainText('Proposed address');

      await expect(txModal.description).toContainText(
        trimAddress(accountForRolesChanged, 6),
      );
      await expect(txModal.footerHint).toHaveText(
        'Confirm this transaction in your wallet',
      );
    });
    await widgetService.walletPage.cancelTx(txPage);
  });

  test(
    qase(77, 'Propose a new Manager Address with valid input'),
    { tag: [Tags.smoke, Tags.performTX] },
    async ({ widgetService }) => {
      const managerAddressPage = widgetService.rolesPage.managerAddressPage;

      await test.step('Propose a new manager address', async () => {
        const accountForRolesChanged = generateAddress();

        await managerAddressPage.addressInput.fill(accountForRolesChanged);
        await widgetService.page.waitForTimeout(LOW_TIMEOUT);
        await managerAddressPage.addressValidIcon.waitFor({
          state: 'visible',
        });

        const [txPage] = await Promise.all([
          managerAddressPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
          managerAddressPage.proposeButton.click(),
        ]);

        await managerAddressPage.page.waitForSelector(
          `text=You are proposing manager address change`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );

        await test.step('Verify confirm transaction', async () => {
          await widgetService.walletPage.confirmTx(txPage);

          await managerAddressPage.page.waitForSelector(
            `text=New manager address has been proposed`,
            { timeout: STAGE_WAIT_TIMEOUT },
          );

          const { txModal } = widgetService.rolesPage;

          await expect(txModal.description).toContainText('What is next:');
          await expect(txModal.description).toContainText(
            'Connect to CSM UI with the proposed address',
          );
          await expect(txModal.description).toContainText(
            'Go to Roles tab → Inbox requests to confirm the change',
          );

          await expect(txModal.description).toContainText(
            trimAddress(accountForRolesChanged, 6),
          );

          await expect(txModal.footerHint).toContainText('View on Etherscan');
        });
      });
    },
  );
});
