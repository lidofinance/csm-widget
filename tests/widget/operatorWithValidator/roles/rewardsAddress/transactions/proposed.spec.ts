import { expect } from '@playwright/test';
import { test } from '../../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { trimAddress } from '@lidofinance/address';
import {
  LOW_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
  WALLET_PAGE_TIMEOUT_WAITER,
} from 'tests/consts/timeouts';
import { generateAddress } from 'tests/helpers/accountData';
import { Tags } from 'tests/consts/common.const';

test.describe('Roles. Rewards Address. Transactions. Proposed Address', () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.rolesPage.rewardsAddressPage.open();
  });

  test.afterEach(async ({ widgetService }) => {
    await test.step('Revoke proposal role', async () => {
      // @todo: need to add cancel all tx before.
      await widgetService.rolesPage.rewardsAddressPage.open();
      await widgetService.page.waitForTimeout(LOW_TIMEOUT);
      await widgetService.rolesPage.rewardsAddressPage.revokePendingRole();
    });
  });

  test('Should display warning modal after click to propose button', async ({
    widgetService,
  }) => {
    const rewardsAddressPage = widgetService.rolesPage.rewardsAddressPage;
    const rolesPage = widgetService.rolesPage;
    const accountForRolesChanged = generateAddress();

    await rewardsAddressPage.addressInput.fill(accountForRolesChanged);
    await widgetService.page.waitForTimeout(LOW_TIMEOUT);
    await rewardsAddressPage.addressValidIcon.waitFor({
      state: 'visible',
    });
    await rewardsAddressPage.proposeButton.click();

    await test.step('Verify first warning modal', async () => {
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
  });

  test('Should display tx modal after approve warning after propose button', async ({
    widgetService,
  }) => {
    const rewardsAddressPage = widgetService.rolesPage.rewardsAddressPage;
    const rolesPage = widgetService.rolesPage;
    const accountForRolesChanged = generateAddress();

    await rewardsAddressPage.addressInput.fill(accountForRolesChanged);
    await widgetService.page.waitForTimeout(LOW_TIMEOUT);
    await rewardsAddressPage.addressValidIcon.waitFor({
      state: 'visible',
    });

    await rewardsAddressPage.proposeButton.click();
    await rolesPage.modalRoot.modal.waitFor({
      state: 'visible',
    });

    const [txPage] = await Promise.all([
      rewardsAddressPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
      rolesPage.modalRoot.continueButton.click(),
    ]);

    await rewardsAddressPage.page.waitForSelector(
      `text=You are proposing rewards address change`,
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

    await rewardsAddressPage.walletPage.cancelTx(txPage);
  });

  test(
    qase(
      74,
      'Should success complete transaction of propose a new Rewards Address',
    ),
    { tag: [Tags.smoke, Tags.performTX] },
    async ({ widgetService }) => {
      const rewardsAddressPage = widgetService.rolesPage.rewardsAddressPage;
      const rolesPage = widgetService.rolesPage;
      const accountForRolesChanged = generateAddress();

      await test.step('Propose a new rewards address', async () => {
        await rewardsAddressPage.addressInput.fill(accountForRolesChanged);
        await widgetService.page.waitForTimeout(LOW_TIMEOUT);
        await rewardsAddressPage.addressValidIcon.waitFor({
          state: 'visible',
        });
        await rewardsAddressPage.proposeButton.click();
        await rolesPage.modalRoot.modal.waitFor({
          state: 'visible',
        });

        const [txPage] = await Promise.all([
          rewardsAddressPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
          rolesPage.modalRoot.continueButton.click(),
        ]);

        await rewardsAddressPage.page.waitForSelector(
          `text=You are proposing rewards address change`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );

        await rewardsAddressPage.walletPage.confirmTx(txPage);

        await test.step('Verify confirm transaction', async () => {
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
      });
    },
  );
});
