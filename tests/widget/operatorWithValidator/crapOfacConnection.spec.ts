import { expect } from '@playwright/test';
import { test } from '../test.fixture';
import { TokenSymbol } from 'tests/consts/common.const';
import { KeysPage } from 'tests/pages';
import { KeysGeneratorService } from 'tests/services/keysGenerator.service';
import { TxModal } from 'tests/pages/elements/common/element.txProgressModal';
import { LOW_TIMEOUT } from 'tests/consts/timeouts';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { generateAddress } from 'tests/helpers/accountData';

const OFAC_MODAL_TEXT = 'Sorry, access is currently unavailable.';

test.describe('Operator with validator. CRAP and widget transaction', async () => {
  let txModal: TxModal;

  test.beforeAll(async ({ widgetService }) => {
    await widgetService.page.goto('/?survey-setup=1&ics-apply=1');
    txModal = new TxModal(widgetService.page);

    await widgetService.mockValidationAddressRequest();
  });

  test.afterAll(async ({ widgetService }) => {
    await test.step('Mock route for CRAP-Blacklisted wallet address', async () => {
      await widgetService.page.unrouteAll();
    });
  });

  test('Should open access denied modal after added 1 key (CRAP-API)', async ({
    widgetService,
  }) => {
    await test.step('Submit keys', async () => {
      const keysPage = new KeysPage(widgetService.page);
      await keysPage.submitPage.open();
      const keysGeneratorService = new KeysGeneratorService();

      const keys = keysGeneratorService.generateKeys();

      const bondTokenElement = keysPage.submitPage.getBondTokenElement(
        TokenSymbol.ETH,
      );
      await bondTokenElement.click();
      await keysPage.submitPage.fillKeys(keys);
      await keysPage.submitPage.page.waitForTimeout(LOW_TIMEOUT);
      await keysPage.submitPage.confirmKeysReady.click();
      await keysPage.submitPage.submitKeysButton.click();
    });

    await test.step('Check the warning OFAC modal', async () => {
      await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
    });
  });

  test('Should open access denied modal after remove key', async ({
    widgetService,
  }) => {
    const keysPage = widgetService.keysPage;
    await keysPage.removePage.open();

    await test.step('Select and remove key', async () => {
      await keysPage.removePage.keyCheckbox.first().click();
      await keysPage.removePage.removeKeysButton.click();
    });

    await test.step('Check the warning OFAC modal', async () => {
      await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
    });
  });

  test(`Should open access denied modal after add bond (CRAP-API)`, async ({
    widgetService,
  }) => {
    const bondRewardsPage = widgetService.bondRewardsPage;
    await bondRewardsPage.addBond.open();

    const tokenName = TOKENS.eth;
    await test.step(`Choose ${tokenName} symbol for bond`, async () => {
      const bondToken = bondRewardsPage.addBond.selectBondToken(tokenName);
      await bondToken.click();
    });

    await test.step('Fill bond amount and submit', async () => {
      await bondRewardsPage.addBond.amountInput.fill('0.0001');
      await bondRewardsPage.addBond.addBondButton.click();
    });
    await test.step('Check the warning OFAC modal', async () => {
      await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
    });
  });

  test(`Should open access denied modal after claim`, async ({
    widgetService,
  }) => {
    const bondRewardsPage = widgetService.bondRewardsPage;
    await bondRewardsPage.claim.open();

    const claimAmount = '0.0003';

    await test.step('Fill claim amount and submit', async () => {
      await bondRewardsPage.claim.selectBondToken(TOKENS.eth);
      await bondRewardsPage.claim.amountInput.fill(claimAmount);
      await bondRewardsPage.claim.requestWithdrawalButton.click();
    });

    await test.step('Check the warning OFAC modal', async () => {
      await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
    });
  });

  test('Should open access denied modal after propose manager role', async ({
    widgetService,
  }) => {
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
  });

  test('Should open access denied modal after revoke manager role', async ({
    widgetService,
  }) => {
    await test.step('Mock route for CRAP-Blacklisted wallet address', async () => {
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

  test('Should open access denied modal after sign in ICS', async ({
    widgetService,
  }) => {
    await widgetService.page.goto('/type/ics-apply');
    await test.step('Sign in ics', async () => {
      await widgetService.page.getByRole('button', { name: 'Sign in' }).click();
    });

    await test.step('Check the warning OFAC modal', async () => {
      await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
    });
  });

  test('Should open access denied modal after sign in surveys', async ({
    widgetService,
  }) => {
    await widgetService.page.goto('/surveys');
    await test.step('Sign in surveys', async () => {
      await widgetService.page.getByRole('button', { name: 'Sign in' }).click();
    });

    await test.step('Check the warning OFAC modal', async () => {
      await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
    });
  });
});
