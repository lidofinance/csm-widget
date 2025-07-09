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

test.describe(
  'Roles. Manager Address. Transactions. Reproposed Address',
  { tag: [Tags.performTX] },
  () => {
    test.beforeEach(async ({ widgetService }) => {
      await widgetService.rolesPage.managerAddressPage.open();
      const accountForRolesChanged = generateAddress();
      const managerAddressPage = widgetService.rolesPage.managerAddressPage;
      await managerAddressPage.proposeNewAddress(accountForRolesChanged);
      await widgetService.page.waitForTimeout(LOW_TIMEOUT);
    });

    test.afterEach(async ({ widgetService }) => {
      await test.step('Revoke proposal role', async () => {
        // @todo: need to add cancel all tx before.
        await widgetService.rolesPage.managerAddressPage.open();
        await widgetService.page.waitForTimeout(1000);
        await widgetService.rolesPage.managerAddressPage.revokePendingRole();
      });
    });

    test(
      qase(224, 'Should display warning modal after click to repropose button'),
      async ({ widgetService }) => {
        const managerAddressPage = widgetService.rolesPage.managerAddressPage;
        const accountForSecondRolesChanged = generateAddress();

        const rolesPage = widgetService.rolesPage;

        await managerAddressPage.addressInput.fill(
          accountForSecondRolesChanged,
        );
        await managerAddressPage.addressValidIcon.waitFor({
          state: 'visible',
        });
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
      },
    );

    test(
      qase(
        225,
        'Should display tx modal after approve warning after repropose button',
      ),
      async ({ widgetService }) => {
        const managerAddressPage = widgetService.rolesPage.managerAddressPage;
        const accountForSecondRolesChanged = generateAddress();

        const rolesPage = widgetService.rolesPage;

        await test.step('Repropose a new manager address', async () => {
          await managerAddressPage.addressInput.fill(
            accountForSecondRolesChanged,
          );
          await managerAddressPage.addressValidIcon.waitFor({
            state: 'visible',
          });
          await managerAddressPage.proposeButton.click();
          await rolesPage.modalRoot.modal.waitFor({
            state: 'visible',
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

              await expect(txModal.description).toContainText(
                'Proposed address',
              );

              await expect(txModal.description).toContainText(
                trimAddress(accountForSecondRolesChanged, 6),
              );
              await expect(txModal.footerHint).toHaveText(
                'Confirm this transaction in your wallet',
              );
            });
          });
          await managerAddressPage.walletPage.cancelTx(txPage);
        });
      },
    );

    test(
      qase(207, 'Repropose a new Manager Address'),
      async ({ widgetService }) => {
        const managerAddressPage = widgetService.rolesPage.managerAddressPage;
        const accountForSecondRolesChanged = generateAddress();

        const rolesPage = widgetService.rolesPage;

        await managerAddressPage.addressInput.fill(
          accountForSecondRolesChanged,
        );
        await managerAddressPage.addressValidIcon.waitFor({
          state: 'visible',
        });
        await managerAddressPage.proposeButton.click();
        await rolesPage.modalRoot.modal.waitFor({
          state: 'visible',
        });

        const [txPage] = await Promise.all([
          managerAddressPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
          rolesPage.modalRoot.continueButton.click(),
        ]);

        await managerAddressPage.page.waitForSelector(
          `text=You are proposing manager address change`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );
        await managerAddressPage.walletPage.confirmTx(txPage);

        await test.step('Verify confirm transaction', async () => {
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
        });
      },
    );
  },
);
