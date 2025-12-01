import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { TxModal } from 'tests/pages/elements/common/element.txProgressModal';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { OFAC_MODAL_TEXT } from 'tests/consts/texts.const';

test.describe('Bond & Rewards. CRAP and widget transaction', async () => {
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
});
