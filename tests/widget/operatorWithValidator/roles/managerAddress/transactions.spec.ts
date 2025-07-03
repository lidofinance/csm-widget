import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { trimAddress } from '@lidofinance/address';
import {
  STAGE_WAIT_TIMEOUT,
  WALLET_PAGE_TIMEOUT_WAITER,
} from 'tests/consts/timeouts';
import { qase } from 'playwright-qase-reporter/playwright';
import { generateAddress } from 'tests/helpers/accountData';

test.describe('Roles. Manager Address. Transactions.', () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.rolesPage.managerAddressPage.open();
  });

  test(
    qase(77, 'Propose a new Manager Address with valid input'),
    async ({ widgetService }) => {
      const managerAddressPage = widgetService.rolesPage.managerAddressPage;

      await test.step('Propose a new manager address', async () => {
        const accountForRolesChanged = generateAddress();

        await managerAddressPage.addressInput.fill(accountForRolesChanged);
        await managerAddressPage.addressValidIcon.waitFor({ state: 'visible' });

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

        const { txModal } = widgetService.rolesPage;

        await txModal.closeModal();
      });
    },
  );

  test(
    qase(207, 'Repropose a new Manager Address'),
    async ({ widgetService }) => {
      const managerAddressPage = widgetService.rolesPage.managerAddressPage;
      const accountForRolesChanged = generateAddress();
      const accountForSecondRolesChanged = generateAddress();

      await managerAddressPage.proposeNewAddress(accountForRolesChanged);

      const rolesPage = widgetService.rolesPage;

      await test.step('Repropose a new manager address', async () => {
        await managerAddressPage.addressInput.fill(
          accountForSecondRolesChanged,
        );
        await managerAddressPage.addressValidIcon.waitFor({ state: 'visible' });
        await managerAddressPage.proposeButton.click();

        await test.step('Verify modal for repropose', async () => {
          await rolesPage.modalRoot.modal.waitFor({
            state: 'visible',
          });

          await expect(rolesPage.modalRoot.headings).toContainText(
            'Only most recent proposed address change is valid',
          );

          await expect(rolesPage.modalRoot.paragraphs.first()).toContainText(
            'When you propose a new address for change - the previous change proposal is voided.',
          );

          await expect(rolesPage.modalRoot.continueButton).toBeVisible();
        });

        const [txPage] = await Promise.all([
          managerAddressPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
          rolesPage.modalRoot.continueButton.click(),
        ]);

        await test.step('Continue proposal', async () => {
          await managerAddressPage.page.waitForSelector(
            `text=You are proposing manager address change`,
            { timeout: STAGE_WAIT_TIMEOUT },
          );

          await test.step('Verify transaction modal', async () => {
            const { txModal } = widgetService.rolesPage;

            await expect(txModal.description).toContainText('Proposed address');

            await expect(txModal.description).toContainText(
              trimAddress(accountForSecondRolesChanged, 6),
            );
            await expect(txModal.footerHint).toHaveText(
              'Confirm this transaction in your wallet',
            );
          });
        });

        await test.step('Verify confirm transaction', async () => {
          await managerAddressPage.walletPage.confirmTx(txPage);

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
            trimAddress(accountForSecondRolesChanged, 6),
          );

          await expect(txModal.footerHint).toContainText('View on Etherscan');
          await txModal.closeModal();
        });
      });
    },
  );

  test(qase(208, 'Revoke Manager role change'), async ({ widgetService }) => {
    const managerAddressPage = widgetService.rolesPage.managerAddressPage;
    const accountForRolesChanged = generateAddress();

    await managerAddressPage.proposeNewAddress(accountForRolesChanged);

    await test.step('Revoke pending manager address role', async () => {
      await test.step('Do revoke', async () => {
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
      });
    });
  });

  test.afterEach(async ({ widgetService }) => {
    await test.step('Revoke proposal role', async () => {
      // @todo: need to add cancel all tx before.
      await widgetService.rolesPage.managerAddressPage.open();
      await widgetService.page.waitForTimeout(1000);
      await widgetService.rolesPage.managerAddressPage.revokePendingRole();
    });
  });
});
