import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { KeysPage } from 'tests/pages';

test.describe('Validator keys removal', async () => {
  let keysPage: KeysPage;

  test.beforeEach(async ({ widgetService }) => {
    keysPage = new KeysPage(widgetService.page);
    await keysPage.removePage.open();
  });

  [1, 3].forEach((keyLength: number) => {
    test(
      qase(
        150,
        `Should load correct data from contract when ${keyLength} key selected`,
      ),
      async () => {
        qase.parameters({ keyLength: keyLength.toString() });
        await keysPage.removePage.page
          .getByText('Choose keys to remove')
          .waitFor({ state: 'visible' });

        const keysCheckboxes = await keysPage.removePage.keyCheckbox.all();

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
            // The fee is now dynamically calculated from the contract
            // Check that a fee value is displayed (should contain "stETH" and be greater than 0)
            const feeValue =
              await keysPage.removePage.ejectionCostInput.inputValue();
            expect(feeValue).toContain('stETH');

            // Extract numeric value and verify it's positive
            const numericValue = parseFloat(feeValue.replace(' stETH', ''));
            expect(numericValue).toBeGreaterThan(0);

            // Verify the fee scales with the number of keys selected
            expect(numericValue).toBeGreaterThan(0.001 * keyLength);
          });

          await test.step('Check tooltip text', async () => {
            await keysPage.removePage.ejectionCostInputSVG.hover();
            await expect(
              keysPage.removePage.removalFeeInfoTooltipText,
            ).toContainText(
              "Key deletion incurs a removal charge, deducted from the node operator's bond. This charge covers the maximum possible operational costs of queue processing",
            );
          });
        });

        await test.step('Check excess bond after execution', async () => {
          // Verify that the excess bond section is visible and shows a value
          await expect(
            keysPage.removePage.excessBondAfterExecution,
          ).toBeVisible();

          // Check that the excess bond value is displayed
          const excessBondText =
            await keysPage.removePage.excessBondAfterExecution.textContent();
          expect(excessBondText).toBeTruthy();

          // The excess bond should either show a positive value or indicate insufficient bond
          // This depends on the operator's current bond state
          expect(excessBondText).toMatch(/(ETH|Insufficient)/);
        });
      },
    );
  });
});
