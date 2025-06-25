/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/consts/common.const';
import { TOKEN_DISPLAY_NAMES } from 'utils/getTokenDisplayName';
import { TOKENS } from 'consts/tokens';

test.describe('Bond & Rewards. Add bond.', async () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.connectWallet();
    await widgetService.bondRewardsPage.addBond.open();
  });

  test(
    qase(189, 'Should displays balance and explanatory text for stETH bond'),
    async ({ widgetService, contractClients }) => {
      const bondRewardsPage = widgetService.bondRewardsPage;

      await test.step('Verify information about bond', async () => {
        const nodeOperatorId = await widgetService.extractNodeOperatorId();

        if (!nodeOperatorId) {
          throw new Error('Node operator ID not found');
        }

        await test.step('Verify bond balance', async () => {
          await expect(
            bondRewardsPage.addBond.titledAmount.locator('div').first(),
          ).toContainText('Bond balance');
          const bondSummary =
            await contractClients.CSAccounting.getBondSummary(nodeOperatorId);

          await expect(bondRewardsPage.addBond.titledAmountBalance).toHaveText(
            `${bondSummary.excess.toCut(4)} stETH`,
          );
        });

        await test.step('Verify text', async () => {
          const expectedText =
            'Why you might need to add bond:Adding a bond serves as a voluntary security measure for your Node Operator to prevent your validators from becoming unbonded and being requested to exit in case of applied penalties.Supplied bond will be stored as stETH, which also garners staking rewards.';
          await expect(bondRewardsPage.addBond.formInfoText).toContainText(
            expectedText,
          );

          const expectedLinkHref =
            'https://docs.lido.fi/staking-modules/csm/guides/unbonded-validators';
          const linkUnbondedElement =
            bondRewardsPage.addBond.formInfoText.locator('a');
          // @todo: check to click on the link
          await expect(linkUnbondedElement).toHaveAttribute(
            'href',
            expectedLinkHref,
          );
        });
      });
    },
  );

  [TOKENS.ETH, TOKENS.STETH, TOKENS.WSTETH].forEach((tokenName) => {
    const tag = [Tags.performTX];
    if (tokenName === 'STETH') tag.push(Tags.smoke);

    test(
      qase(193, `Should add bond using ${tokenName} as bond token`),
      { tag },
      async ({ widgetService, contractClients }) => {
        qase.parameters({ tokenName });
        const bondRewardsPage = widgetService.bondRewardsPage;

        const nodeOperatorId = await widgetService.extractNodeOperatorId();

        const expectedAmount = '0.0003';
        const bondSummary =
          await contractClients.CSAccounting.getBondSummary(nodeOperatorId);

        await widgetService.addBond(tokenName, expectedAmount);

        await test.step('Verify new balance after bond added', async () => {
          const expectedBalance =
            parseFloat(bondSummary.excess) + parseFloat(expectedAmount);
          const actualBalance =
            await bondRewardsPage.addBond.titledAmountBalance.textContent();

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          expect(parseFloat(actualBalance!)).toBeCloseTo(expectedBalance);
        });
      },
    );
  });

  [TOKENS.ETH, TOKENS.STETH, TOKENS.WSTETH].forEach((tokenName) => {
    test(
      qase(65, `Add bond using maximum available ${tokenName} amount`),
      async ({ widgetService }) => {
        qase.parameters({ tokenName });
        const bondRewardsPage = widgetService.bondRewardsPage;

        await test.step(`Choose ${tokenName} symbol for bond`, async () => {
          const bondToken = bondRewardsPage.addBond.selectBondToken(tokenName);
          await bondToken.click();
        });

        const expectedBalance =
          await bondRewardsPage.addBond.getBalanceByToken(tokenName);

        await test.step('Click the Max button', async () => {
          await bondRewardsPage.addBond.maxBtn.click();
        });

        await test.step('Check the input value and submit button', async () => {
          const inputValue = parseFloat(
            await bondRewardsPage.addBond.amountInput.inputValue(),
          );

          expect(inputValue).toBeCloseTo(expectedBalance);
          await expect(bondRewardsPage.addBond.addBondButton).toBeEnabled();
        });
      },
    );
  });

  [TOKENS.ETH, TOKENS.STETH, TOKENS.WSTETH].forEach((tokenName) => {
    test(
      qase(
        67,
        `Attempt to add bond exceeding available balance for ${tokenName} token`,
      ),
      async ({ widgetService }) => {
        qase.parameters({ tokenName });
        const bondRewardsPage = widgetService.bondRewardsPage;

        await test.step(`Choose ${tokenName} symbol for bond`, async () => {
          const bondToken = bondRewardsPage.addBond.selectBondToken(tokenName);
          await bondToken.click();
        });

        await bondRewardsPage.addBond.amountInput.fill('1000');
        await bondRewardsPage.page.mouse.click(0, 0);
        await expect(
          bondRewardsPage.addBond.validationInputTooltip,
        ).toContainText(
          `Not enough balance of ${TOKEN_DISPLAY_NAMES[tokenName]}`,
        );
      },
    );
  });

  [TOKENS.ETH, TOKENS.STETH, TOKENS.WSTETH].forEach((tokenName) => {
    test(`Chaeck bond token information for ${tokenName}`, async ({
      widgetService,
    }) => {
      qase.parameters({ tokenName });
      const bondRewardsPage = widgetService.bondRewardsPage;

      await test.step(`Choose ${tokenName} symbol for bond`, async () => {
        const bondToken = bondRewardsPage.addBond.selectBondToken(tokenName);
        await bondToken.click();
      });

      await test.step('Verify "Balance will receive"', async () => {
        await expect(bondRewardsPage.addBond.balanceWillReceive).toBeVisible();
        await expect(bondRewardsPage.addBond.balanceWillReceive).toContainText(
          'Bond balance will receive',
        );
      });

      await test.step('Verify "Exchange rate"', async () => {
        if (tokenName == TOKENS.STETH.valueOf()) {
          await expect(bondRewardsPage.addBond.exchangeRate).toBeHidden();
        } else {
          await expect(bondRewardsPage.addBond.exchangeRate).toBeVisible();
          await expect(bondRewardsPage.addBond.exchangeRate).toContainText(
            'Exchange rate',
          );
        }
      });
    });
  });
});
