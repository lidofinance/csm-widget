import { expect } from '@playwright/test';
import { test } from '../test.fixture';
import { TxModal } from 'tests/pages/elements/common/element.txProgressModal';
import { OFAC_MODAL_TEXT } from 'tests/consts/texts.const';
import { qase } from 'playwright-qase-reporter/playwright';

test.describe('Operator with validator. ICS & Survey CRAP and widget transaction', async () => {
  let txModal: TxModal;

  test.beforeAll(async ({ widgetService }) => {
    await widgetService.page.goto('/?survey-setup=1&ics-apply=1');
    txModal = new TxModal(widgetService.page);

    await widgetService.mockValidationAddressRequest();
  });

  test.afterAll(async ({ widgetService }) => {
    await test.step('Mock route for Blacklisted wallet address', async () => {
      await widgetService.page.unrouteAll();
    });
  });

  test(
    qase(282, 'Should open access denied modal after sign in ICS'),
    async ({ widgetService }) => {
      await widgetService.page.goto('/type/ics-apply');
      await test.step('Sign in ics', async () => {
        await widgetService.page
          .getByRole('button', { name: 'Sign in' })
          .click();
      });

      await test.step('Check the warning OFAC modal', async () => {
        await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
      });
    },
  );

  test(
    qase(283, 'Should open access denied modal after sign in surveys'),
    async ({ widgetService }) => {
      await widgetService.page.goto('/surveys');
      await test.step('Sign in surveys', async () => {
        await widgetService.page
          .getByRole('button', { name: 'Sign in' })
          .click();
      });

      await test.step('Check the warning OFAC modal', async () => {
        await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
      });
    },
  );
});
