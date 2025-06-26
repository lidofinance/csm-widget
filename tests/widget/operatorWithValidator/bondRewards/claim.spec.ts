/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { TOKEN_DISPLAY_NAMES } from 'utils/getTokenDisplayName';
import { TOKENS } from 'consts/tokens';

test.describe('Bond & Rewards. Claim.', async () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.bondRewardsPage.claim.open();
  });

  test.skip(qase(61, 'Verify UI elements in "Claim" tab'), async () => {});

  test.skip(
    qase(62, 'Claiming bond with valid token and amount'),
    async () => {},
  );

  [TOKENS.ETH, TOKENS.STETH, TOKENS.WSTETH].forEach((tokenName) => {
    test(
      qase(199, `Should claim amount using maximum available ${tokenName}`),
      async ({ widgetService }) => {
        qase.parameters({ tokenName });
        const bondRewardsPage = widgetService.bondRewardsPage;

        await test.step(`Choose ${tokenName} symbol for claim`, async () => {
          const token = bondRewardsPage.claim.selectBondToken(tokenName);
          await token.click();
        });

        const expectedBalance =
          await bondRewardsPage.claim.getBalanceByToken(tokenName);

        await test.step('Click the Max button', async () => {
          await bondRewardsPage.claim.maxBtn.click();
        });

        await test.step('Check the input value and submit button', async () => {
          const inputValue = parseFloat(
            await bondRewardsPage.claim.amountInput.inputValue(),
          );

          expect(inputValue).toBeCloseTo(expectedBalance);
          if (tokenName === TOKENS.ETH.valueOf()) {
            await expect(
              bondRewardsPage.claim.requestWithdrawalButton,
            ).toBeEnabled();
          } else {
            await expect(bondRewardsPage.claim.claimButton).toBeEnabled();
          }
        });
      },
    );
  });

  [TOKENS.ETH, TOKENS.STETH, TOKENS.WSTETH].forEach((tokenName) => {
    test(
      qase(
        63,
        `Should not claim with ${tokenName} amount exceeding available balance`,
      ),
      async ({ widgetService }) => {
        qase.parameters({ tokenName });
        const bondRewardsPage = widgetService.bondRewardsPage;

        await test.step(`Choose ${tokenName} symbol for claim`, async () => {
          const token = bondRewardsPage.claim.selectBondToken(tokenName);
          await token.click();
        });
        const expectedBalance =
          await bondRewardsPage.claim.getBalanceByToken(tokenName);
        await bondRewardsPage.claim.amountInput.fill('1000');
        await bondRewardsPage.page.mouse.click(0, 0);
        await expect(
          bondRewardsPage.claim.validationInputTooltip,
        ).toContainText(
          `Entered ${TOKEN_DISPLAY_NAMES[tokenName]} amount exceeds available to claim of ${expectedBalance}`,
        );
      },
    );
  });
});
