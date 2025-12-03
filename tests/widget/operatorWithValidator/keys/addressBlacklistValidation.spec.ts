import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { TokenSymbol } from 'tests/consts/common.const';
import { KeysPage } from 'tests/pages';
import { KeysGeneratorService } from 'tests/services/keysGenerator.service';
import { TxModal } from 'tests/pages/elements/common/element.txProgressModal';
import { LOW_TIMEOUT } from 'tests/consts/timeouts';
import { OFAC_MODAL_TEXT } from 'tests/consts/texts.const';
import { qase } from 'playwright-qase-reporter/playwright';

test.describe('Operator with validator. Keys. Address blacklist validation', async () => {
  let txModal: TxModal;

  test.beforeAll(async ({ widgetService }) => {
    await widgetService.page.goto('/?survey-setup=1&ics-apply=1');
    txModal = new TxModal(widgetService.page);

    await widgetService.mockValidationAddressRequest();
  });

  test.afterAll(async ({ widgetService }) => {
    await widgetService.page.unrouteAll();
  });

  test(
    qase(289, 'Should open access denied modal after added 1 key'),
    async ({ widgetService }) => {
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
    },
  );

  test(
    qase(290, 'Should open access denied modal after remove key'),
    async ({ widgetService }) => {
      const keysPage = widgetService.keysPage;
      await keysPage.removePage.open();

      await test.step('Select and remove key', async () => {
        await keysPage.removePage.keyCheckbox.first().click();
        await keysPage.removePage.removeKeysButton.click();
      });

      await test.step('Check the warning OFAC modal', async () => {
        await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
      });
    },
  );
});
