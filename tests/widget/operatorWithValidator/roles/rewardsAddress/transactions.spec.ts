import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { trimAddress } from '@lidofinance/address';
import {
  STAGE_WAIT_TIMEOUT,
  WALLET_PAGE_TIMEOUT_WAITER,
} from 'tests/consts/timeouts';
import { generateAddress } from 'tests/helpers/accountData';
import { Tags } from 'tests/consts/common.const';

test.describe(
  'Roles. Rewards Address. Transactions.',
  { tag: [Tags.performTX] },
  () => {
    test.beforeEach(async ({ widgetService }) => {
      await widgetService.rolesPage.rewardsAddressPage.open();
    });

    test(
      qase(74, 'Propose a new Rewards Address with valid input'),
      { tag: [Tags.smoke] },
      async ({ widgetService }) => {
        const rewardsAddressPage = widgetService.rolesPage.rewardsAddressPage;
        const rolesPage = widgetService.rolesPage;
        const accountForRolesChanged = generateAddress();

        await test.step('Propose a new rewards address', async () => {
          await rewardsAddressPage.addressInput.fill(accountForRolesChanged);
          await rewardsAddressPage.addressValidIcon.waitFor({
            state: 'visible',
          });
          await rewardsAddressPage.proposeButton.click();

          await test.step('Wait for modal continue button to be visible', async () => {
            await rolesPage.modalRoot.modal.waitFor({
              state: 'visible',
            });

            await expect(rolesPage.modalRoot.headings).toContainText(
              'All rewards will be claimable to the proposed address',
            );

            await expect(rolesPage.modalRoot.paragraphs.first()).toContainText(
              'After changing the Rewards Address, all rewards and excess bond accumulated on the bond balance can be claimed to the new Rewards address. In the event of validator withdrawal, the whole bond is also returned to the new address.',
            );

            await expect(rolesPage.modalRoot.continueButton).toBeVisible();
            await expect(rolesPage.modalRoot.paragraphs.nth(1)).toContainText(
              'The change doesn’t apply immediately. To complete the address change, the owner of the new address must confirm the change',
            );
          });

          const [txPage] = await Promise.all([
            rewardsAddressPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
            rolesPage.modalRoot.continueButton.click(),
          ]);

          await test.step('Continue proposal', async () => {
            await rewardsAddressPage.page.waitForSelector(
              `text=You are proposing rewards address change`,
              { timeout: STAGE_WAIT_TIMEOUT },
            );

            await test.step('Verify transaction modal', async () => {
              const { txModal } = widgetService.rolesPage;

              await expect(txModal.description).toContainText(
                'Proposed address',
              );

              await expect(txModal.description).toContainText(
                trimAddress(accountForRolesChanged, 6),
              );
              await expect(txModal.footerHint).toHaveText(
                'Confirm this transaction in your wallet',
              );
            });
          });

          await test.step('Verify confirm transaction', async () => {
            await rewardsAddressPage.walletPage.confirmTx(txPage);

            await rewardsAddressPage.page.waitForSelector(
              `text=New rewards address has been proposed`,
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
      qase(209, 'Repropose a new Rewards Address'),
      async ({ widgetService }) => {
        const rewardsAddressPage = widgetService.rolesPage.rewardsAddressPage;
        const accountForRolesChanged = generateAddress();
        const accountForSecondRolesChanged = generateAddress();

        await rewardsAddressPage.proposeNewAddress(accountForRolesChanged);

        const rolesPage = widgetService.rolesPage;

        await test.step('Repropose a new rewards address', async () => {
          await rewardsAddressPage.addressInput.fill(
            accountForSecondRolesChanged,
          );
          await rewardsAddressPage.addressValidIcon.waitFor({
            state: 'visible',
          });
          await rewardsAddressPage.proposeButton.click();

          await test.step('Wait for modal continue button to be visible', async () => {
            await rolesPage.modalRoot.modal.waitFor({
              state: 'visible',
            });

            await expect(rolesPage.modalRoot.headings).toContainText(
              'All rewards will be claimable to the proposed address',
            );

            await expect(rolesPage.modalRoot.paragraphs.first()).toContainText(
              'After changing the Rewards Address, all rewards and excess bond accumulated on the bond balance can be claimed to the new Rewards address. In the event of validator withdrawal, the whole bond is also returned to the new address.',
            );

            await expect(rolesPage.modalRoot.continueButton).toBeVisible();
            await expect(rolesPage.modalRoot.paragraphs.nth(1)).toContainText(
              'The change doesn’t apply immediately. To complete the address change, the owner of the new address must confirm the change',
            );
          });

          await rolesPage.modalRoot.continueButton.click();

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
            rewardsAddressPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
            rolesPage.modalRoot.continueButton.click(),
          ]);

          await test.step('Continue proposal', async () => {
            await rewardsAddressPage.page.waitForSelector(
              `text=You are proposing rewards address change`,
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

          await test.step('Verify confirm transaction', async () => {
            await rewardsAddressPage.walletPage.confirmTx(txPage);

            await rewardsAddressPage.page.waitForSelector(
              `text=New rewards address has been proposed`,
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

          const { txModal } = widgetService.rolesPage;

          await txModal.closeModal();
        });
      },
    );

    test(qase(156, 'Revoke Reward role change'), async ({ widgetService }) => {
      const rewardsAddressPage = widgetService.rolesPage.rewardsAddressPage;
      const accountForRolesChanged = generateAddress();

      await rewardsAddressPage.proposeNewAddress(accountForRolesChanged);

      await test.step('Revoke pending rewards address role', async () => {
        await test.step('Do revoke', async () => {
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

            await rewardsAddressPage.page.waitForSelector(
              `text=Proposed request for rewards address has been revoked`,
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
        await widgetService.rolesPage.rewardsAddressPage.open();
        await widgetService.page.waitForTimeout(1000);
        await widgetService.rolesPage.rewardsAddressPage.revokePendingRole();
      });
    });
  },
);
