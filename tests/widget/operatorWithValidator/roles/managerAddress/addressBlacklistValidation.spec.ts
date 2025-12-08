import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { TxModal } from 'tests/pages/elements/common/element.txProgressModal';
import { LOW_TIMEOUT } from 'tests/consts/timeouts';
import { generateAddress } from 'tests/helpers/accountData';
import { OFAC_MODAL_TEXT } from 'tests/consts/texts.const';
import { qase } from 'playwright-qase-reporter/playwright';

test.describe('Roles. Manager Address. Address blacklist validation', async () => {
  let txModal: TxModal;

  test.beforeAll(async ({ widgetService }) => {
    await widgetService.page.goto('/?survey-setup=1&ics-apply=1');
    txModal = new TxModal(widgetService.page);

    await widgetService.mockValidationAddressRequest();
  });

  test.afterAll(async ({ widgetService }) => {
    await widgetService.page.unrouteAll();
    await widgetService.page.reload();
    await widgetService.page.waitForTimeout(1000);
    await widgetService.rolesPage.managerAddressPage.revokePendingRole();
  });

  test(
    qase(291, 'Should open access denied modal after propose manager role'),
    async ({ widgetService }) => {
      const managerAddressPage = widgetService.rolesPage.managerAddressPage;
      await managerAddressPage.open();

      const accountForRolesChanged = generateAddress();

      await test.step('Propose new manager address', async () => {
        await managerAddressPage.addressInput.fill(accountForRolesChanged);
        await widgetService.page.waitForTimeout(LOW_TIMEOUT);
        await managerAddressPage.addressValidIcon.waitFor({
          state: 'visible',
        });

        await managerAddressPage.proposeButton.click();
      });

      await test.step('Check the warning OFAC modal', async () => {
        await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
      });
    },
  );

  test(
    qase(292, 'Should open access denied modal after revoke manager role'),
    async ({ widgetService }) => {
      await test.step('Mock route for Blacklisted wallet address', async () => {
        await widgetService.page.unrouteAll();
      });
      const managerAddressPage = widgetService.rolesPage.managerAddressPage;
      await managerAddressPage.open();

      const proposedAddress = generateAddress();
      await managerAddressPage.proposeNewAddress(proposedAddress);

      await widgetService.mockValidationAddressRequest();
      await widgetService.page.reload();

      await test.step('Revoke proposed manager address', async () => {
        await managerAddressPage.revokeButton.click();
      });

      await test.step('Check the warning OFAC modal', async () => {
        await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
      });
    },
  );
});
