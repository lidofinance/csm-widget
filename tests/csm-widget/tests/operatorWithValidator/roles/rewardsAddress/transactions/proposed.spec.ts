import { expect } from '@playwright/test';
import { test } from '../../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { trimAddress } from '@lidofinance/address';
import {
  LOW_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
} from '../../../../../../shared/consts/timeouts';
import { generateAddress } from '../../../../../../shared/helpers/accountData';
import { Tags } from '../../../../../../shared/consts/common.const';

test.describe('Roles. Rewards Address. Transactions. Proposed Address', () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.settingsPage.rewardsAddressPage.open();
  });

  test.afterEach(async ({ widgetService }) => {
    await test.step('Revoke proposal role', async () => {
      // @todo: need to add cancel all tx before.
      await widgetService.settingsPage.rewardsAddressPage.open();
      await widgetService.page.waitForTimeout(LOW_TIMEOUT);
      await widgetService.settingsPage.rewardsAddressPage.revokePendingRole();
    });
  });

  test(
    qase(227, 'Should display warning modal after click to propose button'),
    async ({ widgetService }) => {
      const rewardsAddressPage = widgetService.settingsPage.rewardsAddressPage;
      const settingsPage = widgetService.settingsPage;
      const accountForRolesChanged = generateAddress();

      await rewardsAddressPage.addressInput.fill(accountForRolesChanged);
      await widgetService.page.waitForTimeout(LOW_TIMEOUT);
      await rewardsAddressPage.addressValidIcon.waitFor({
        state: 'visible',
      });
      await rewardsAddressPage.proposeButton.click();

      await test.step('Verify first warning modal', async () => {
        await settingsPage.modalRoot.modal.waitFor({
          state: 'visible',
        });

        await expect(settingsPage.modalRoot.headings).toContainText(
          'All rewards will be claimable to the proposed address',
        );

        await expect(settingsPage.modalRoot.paragraphs.first()).toContainText(
          'After changing the Rewards Address, all rewards and excess bond accumulated on the bond balance can be claimed to the new Rewards Address. In the event of validator withdrawal, the whole bond is also returned to the new address.',
        );

        await expect(settingsPage.modalRoot.continueButton).toBeVisible();
        await expect(settingsPage.modalRoot.paragraphs.nth(1)).toContainText(
          'The change doesn’t apply immediately. To complete the address change, the owner of the new address must confirm the change',
        );
      });
    },
  );

  test(
    qase(
      228,
      'Should display tx modal after approve warning after propose button',
    ),
    async ({ widgetService }) => {
      const rewardsAddressPage = widgetService.settingsPage.rewardsAddressPage;
      const settingsPage = widgetService.settingsPage;
      const accountForRolesChanged = generateAddress();

      await rewardsAddressPage.addressInput.fill(accountForRolesChanged);
      await widgetService.page.waitForTimeout(LOW_TIMEOUT);
      await rewardsAddressPage.addressValidIcon.waitFor({
        state: 'visible',
      });

      await rewardsAddressPage.proposeButton.click();
      await settingsPage.modalRoot.modal.waitFor({
        state: 'visible',
      });

      await settingsPage.modalRoot.continueButton.click();

      await rewardsAddressPage.page.waitForSelector(
        `text=You are proposing rewards address change`,
        { timeout: STAGE_WAIT_TIMEOUT },
      );

      await test.step('Verify transaction modal', async () => {
        const { txModal } = widgetService.settingsPage;

        await expect(txModal.description).toContainText('Proposed address');

        await expect(txModal.description).toContainText(
          trimAddress(accountForRolesChanged, 6),
        );
        await expect(txModal.footerHint).toHaveText(
          'Confirm this transaction in your wallet',
        );
      });

      await rewardsAddressPage.walletPage.cancelTx();
    },
  );

  test(
    qase(
      74,
      'Should success complete transaction of propose a new Rewards Address',
    ),
    { tag: [Tags.smoke, Tags.performTX] },
    async ({ widgetService }) => {
      const rewardsAddressPage = widgetService.settingsPage.rewardsAddressPage;
      const settingsPage = widgetService.settingsPage;
      const accountForRolesChanged = generateAddress();

      await test.step('Propose a new rewards address', async () => {
        await rewardsAddressPage.addressInput.fill(accountForRolesChanged);
        await widgetService.page.waitForTimeout(LOW_TIMEOUT);
        await rewardsAddressPage.addressValidIcon.waitFor({
          state: 'visible',
        });
        await rewardsAddressPage.proposeButton.click();
        await settingsPage.modalRoot.modal.waitFor({
          state: 'visible',
        });

        await settingsPage.modalRoot.continueButton.click();

        await rewardsAddressPage.page.waitForSelector(
          `text=You are proposing rewards address change`,
          { timeout: STAGE_WAIT_TIMEOUT },
        );

        await rewardsAddressPage.walletPage.confirmTx();

        await test.step('Verify confirm transaction', async () => {
          await rewardsAddressPage.page.waitForSelector(
            `text=New rewards address has been proposed`,
            { timeout: STAGE_WAIT_TIMEOUT },
          );

          const { txModal } = widgetService.settingsPage;

          await expect(txModal.description).toContainText('What is next:');
          await expect(txModal.description).toContainText(
            'Connect to CSM UI with the proposed address',
          );
          await expect(txModal.description).toContainText(
            'Go to Settings tab → Inbox requests to confirm the change',
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
