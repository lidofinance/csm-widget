import { expect } from '@playwright/test';
import { test } from '../test.fixture';
import { TokenSymbol } from 'tests/consts/common.const';
import { KeysGeneratorService } from 'tests/services/keysGenerator.service';
import { TxModal } from 'tests/pages/elements/common/element.txProgressModal';
import { LOW_TIMEOUT } from 'tests/consts/timeouts';
import { OFAC_MODAL_TEXT } from 'tests/consts/texts.const';
import { qase } from 'playwright-qase-reporter/playwright';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

test.describe('Operator without validator. Address blacklist validation.', async () => {
  let txModal: TxModal;

  test.beforeAll(async ({ widgetService }) => {
    await widgetService.page.goto('/');
    txModal = new TxModal(widgetService.page);

    await widgetService.mockValidationAddressRequest();
  });

  test.afterAll(async ({ widgetService }) => {
    await widgetService.page.unrouteAll();
  });

  test(
    qase(273, 'Should open access denied modal after added extended key'),
    async ({ widgetService }) => {
      const keysPage = widgetService.keysPage;
      await keysPage.goto();
      const submitPage = keysPage.createNodeOperatorForm;

      const keysGeneratorService = new KeysGeneratorService();
      const keys = keysGeneratorService.generateKeys();

      await test.step('Submit keys with extended manager permissions', async () => {
        const bondTokenElement = keysPage.submitPage.getBondTokenElement(
          TokenSymbol.ETH,
        );
        await bondTokenElement.click();
        await submitPage.fillKeys(keys);
        await submitPage.page.waitForTimeout(LOW_TIMEOUT);
        await submitPage.confirmKeysReady.click();

        await submitPage.specifyCustomAdresses.click();
        await submitPage.extendedManagerPermissionsRadio.click();

        await submitPage.customRewardAddressCurrentButton.click();
        await submitPage.customManagerAddressCurrentButton.click();

        await submitPage.submitKeysButton.click();
      });

      await test.step('Check the warning OFAC modal', async () => {
        await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
      });
    },
  );
});
