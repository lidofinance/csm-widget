import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { test } from '../test.fixture';
import { KeysPage } from 'tests/pages/keys.page';

test.describe('Validator keys removal', async () => {
  let keysPage: KeysPage;

  test.beforeEach(async ({ widgetService }) => {
    keysPage = new KeysPage(widgetService.page);
    await widgetService.connectWallet();
    await keysPage.removePage.open();
    await keysPage.page.waitForTimeout(1000);
  });

  [1, 3].forEach((keyLength: number) => {
    test(
      qase(
        150,
        `Should load correct data from contract when ${keyLength} key selected`,
      ),
      async () => {
        qase.parameters({ keyLength: keyLength.toString() });

        const keysCheckboxes = await keysPage.removePage.removeKeysForm
          .locator('label >> svg')
          .all();

        await test.step(`Select ${keyLength} key(s) to remove`, async () => {
          for (const key of keysCheckboxes.slice(0, keyLength)) {
            await key.click();
          }
        });

        await test.step('Check Number of keys to remove', async () => {
          await expect(
            keysPage.removePage.numberOfKeysToRemoveValue,
          ).toContainText(keyLength.toString());
        });

        await test.step('Check removal fee', async () => {
          await test.step('Check removal fee value', async () => {
            await expect(keysPage.removePage.removalFeeValue).toContainText(
              `${(0.05 * keyLength).toFixed(2)} stETH`,
            );
          });

          await test.step('Check tooltip text', async () => {
            await keysPage.removePage.removalFeeInfo.hover();
            await expect(
              keysPage.removePage.removalFeeInfoTooltipText,
            ).toContainText(
              "Key deletion incurs a removal charge, deducted from the node operator's bond. This charge covers the maximum possible operational costs of queue processing",
            );
          });
        });

        await test.step('Check excess bond after execution', async () => {
          // @todo: add assertion
        });
      },
    );
  });
});
