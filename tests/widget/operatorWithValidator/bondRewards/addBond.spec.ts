/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/consts/common.const';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { TOKEN_DISPLAY_NAMES } from 'utils/get-token-display-name';

test.describe('Bond & Rewards. Add bond.', async () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.bondRewardsPage.addBond.open();
  });

  test(
    qase(189, 'Should displays balance and explanatory text for stETH bond'),
    async ({ widgetService, csmSDK }) => {
      const bondRewardsPage = widgetService.bondRewardsPage;

      await test.step('Verify information about bond', async () => {
        const nodeOperatorId = await widgetService.extractNodeOperatorId();

        await test.step('Verify bond balance', async () => {
          await expect(
            bondRewardsPage.addBond.titledAmount.locator('div').first(),
          ).toContainText('Bond balance');
          const bondSummary = await csmSDK.getBondSummary(nodeOperatorId);

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
            'https://docs.lido.fi/run-on-lido/csm/troubleshooting/unbonded-validators';
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

  [TOKENS.eth, TOKENS.steth, TOKENS.wsteth].forEach((tokenName) => {
    const tag = [Tags.performTX];
    if (tokenName === TOKENS.steth) tag.push(Tags.smoke);

    test(
      qase(193, `Should add bond using ${tokenName} as bond token`),
      { tag },
      async ({ widgetService, csmSDK }) => {
        qase.parameters({ tokenName });
        const bondRewardsPage = widgetService.bondRewardsPage;

        const nodeOperatorId = await widgetService.extractNodeOperatorId();

        const bondAmount = '0.0003';
        const bondSummary = await csmSDK.getBondSummary(nodeOperatorId);

        await widgetService.addBond(tokenName, bondAmount);

        await test.step('Verify new balance after bond added', async () => {
          const expectedBalance =
            parseFloat(bondSummary.excess) + parseFloat(bondAmount);
          const actualBalance =
            await bondRewardsPage.addBond.titledAmountBalance.textContent();

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          expect(parseFloat(actualBalance!)).toBeCloseTo(expectedBalance);
        });
      },
    );
  });

  [TOKENS.eth, TOKENS.steth, TOKENS.wsteth].forEach((tokenName) => {
    test(
      qase(65, `Check max button for ${tokenName} token`),
      async ({ widgetService, ethereumSDK }) => {
        qase.parameters({ tokenName });
        const bondRewardsPage = widgetService.bondRewardsPage;

        await test.step(`Choose ${tokenName} symbol for bond`, async () => {
          const bondToken = bondRewardsPage.addBond.selectBondToken(tokenName);
          await bondToken.click();
        });

        const expectedBalance = await ethereumSDK.getBalanceByToken(tokenName);
        await test.step('Click the Max button', async () => {
          await bondRewardsPage.addBond.maxBtn.click();
        });

        await test.step('Check the input value and submit button', async () => {
          const inputValue = parseFloat(
            await bondRewardsPage.addBond.amountInput.inputValue(),
          );

          expect(inputValue).toBeCloseTo(parseFloat(expectedBalance));
          await expect(bondRewardsPage.addBond.addBondButton).toBeEnabled();
        });
      },
    );
  });

  [TOKENS.eth, TOKENS.steth, TOKENS.wsteth].forEach((tokenName) => {
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

  [TOKENS.eth, TOKENS.steth, TOKENS.wsteth].forEach((tokenName) => {
    test(
      qase(
        196,
        `Should display correct bond token information for ${tokenName}`,
      ),
      async ({ widgetService, ethereumSDK }) => {
        qase.parameters({ tokenName });
        const bondRewardsPage = widgetService.bondRewardsPage;

        await test.step(`Choose ${tokenName} symbol for bond`, async () => {
          const bondToken = bondRewardsPage.addBond.selectBondToken(tokenName);
          await bondToken.click();
        });

        const tokenAmountToClaim = 1.123;

        const rateToStETH =
          tokenName === TOKENS.wsteth
            ? parseFloat(await ethereumSDK.getWstETHRate())
            : parseFloat('1.0');

        const expectedTokenAmount = `${tokenAmountToClaim * rateToStETH}`.toCut(
          4,
        );

        await bondRewardsPage.addBond.amountInput.fill(`${tokenAmountToClaim}`);

        await test.step('Verify "Balance will receive"', async () => {
          await expect(
            bondRewardsPage.addBond.balanceWillReceive,
          ).toBeVisible();
          await expect(
            bondRewardsPage.addBond.balanceWillReceive,
          ).toContainText('Bond balance will receive');

          await expect(
            bondRewardsPage.addBond.balanceWillReceive.getByTestId(
              'tokenAmount',
            ),
          ).toContainText(`${expectedTokenAmount} stETH`);
        });

        await test.step('Verify "Exchange rate"', async () => {
          if (tokenName === TOKENS.steth) {
            await expect(bondRewardsPage.addBond.exchangeRate).toBeHidden();
          } else {
            await expect(bondRewardsPage.addBond.exchangeRate).toBeVisible();
            await expect(bondRewardsPage.addBond.exchangeRate).toContainText(
              'Exchange rate',
            );
            await expect(
              bondRewardsPage.addBond.exchangeRate.locator('> div').nth(1),
            ).toContainText(
              `1.0 ${TOKEN_DISPLAY_NAMES[tokenName]} = ${rateToStETH.toString().toCut(4)} stETH`,
            );
          }
        });
      },
    );
  });
});
