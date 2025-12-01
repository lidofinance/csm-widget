import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { TxModal } from 'tests/pages/elements/common/element.txProgressModal';
import { LOW_TIMEOUT } from 'tests/consts/timeouts';
import { generateAddress } from 'tests/helpers/accountData';
import { OFAC_MODAL_TEXT } from 'tests/consts/texts.const';

test.describe('Roles. Rewards Address. CRAP and widget transaction', async () => {
  let txModal: TxModal;

  test.beforeAll(async ({ widgetService }) => {
    await widgetService.page.goto('/?survey-setup=1&ics-apply=1');
    txModal = new TxModal(widgetService.page);

    await widgetService.mockValidationAddressRequest();
  });

  test.afterAll(async ({ widgetService }) => {
    await test.step('Mock route for CRAP-Blacklisted wallet address', async () => {
      await widgetService.page.unrouteAll();
      await widgetService.page.reload();
      await widgetService.page.waitForTimeout(1000);
      await widgetService.rolesPage.rewardsAddressPage.revokePendingRole();
    });
  });

  test('Should open access denied modal after propose reward role', async ({
    widgetService,
  }) => {
    const rewardsAddressPage = widgetService.rolesPage.rewardsAddressPage;
    await rewardsAddressPage.open();

    const accountForRolesChanged = generateAddress();

    await test.step('Propose new rewards address', async () => {
      await rewardsAddressPage.addressInput.fill(accountForRolesChanged);
      await widgetService.page.waitForTimeout(LOW_TIMEOUT);
      await rewardsAddressPage.addressValidIcon.waitFor({
        state: 'visible',
      });

      await rewardsAddressPage.proposeButton.click();
    });
    await test.step('Check the warning OFAC modal', async () => {
      await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
    });
  });

  test('Should open access denied modal after revoke reward role', async ({
    widgetService,
  }) => {
    await test.step('Mock route for CRAP-Blacklisted wallet address', async () => {
      await widgetService.page.unrouteAll();
    });
    const rewardsAddressPage = widgetService.rolesPage.rewardsAddressPage;
    await rewardsAddressPage.open();

    const proposedAddress = generateAddress();
    await rewardsAddressPage.proposeNewAddress(proposedAddress);

    await widgetService.mockValidationAddressRequest();
    await widgetService.page.reload();

    await test.step('Revoke proposed manager address', async () => {
      await rewardsAddressPage.revokeButton.click();
    });

    await test.step('Check the warning OFAC modal', async () => {
      await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
    });
  });
});
