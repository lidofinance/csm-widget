/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/consts/common.const';
import {
  USD_AMOUNT_REGEX,
  USD_AMOUNT_WITH_APPROX_REGEX,
} from 'tests/consts/regexp.const';
import { trimAddress } from '@lidofinance/address';
import { mnemonicToAccount } from 'viem/accounts';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { TOKEN_DISPLAY_NAMES } from 'utils/get-token-display-name';

test.describe('Bond & Rewards. Claim.', async () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.bondRewardsPage.claim.open();
  });

  test(
    qase(61, 'Verify UI elements for source select'),
    async ({ widgetService, csmSDK }) => {
      const bondRewardsPage = widgetService.bondRewardsPage;

      const nodeOperatorId = await widgetService.extractNodeOperatorId();

      const bondSummary = await csmSDK.getBondSummary(nodeOperatorId);

      await test.step('Check title', async () => {
        await expect(
          bondRewardsPage.claim.availableToClaimBalance.locator('div').nth(0),
        ).toContainText('Available to claim');
        await expect(bondRewardsPage.claim.titledTokenBalance).toContainText(
          `${bondSummary.excess.toCut(4)} stETH`,
        );
        await expect(bondRewardsPage.claim.titledTokenPrice).toContainText(
          USD_AMOUNT_WITH_APPROX_REGEX,
        );
      });

      await test.step('Check "Rewards" source', async () => {
        await test.step('Check checkbox', async () => {
          await expect(
            bondRewardsPage.claim.sourceSelect.rewards.getByRole('checkbox'),
          ).toBeDisabled();
          await expect(
            bondRewardsPage.claim.sourceSelect.rewards.getByRole('checkbox'),
          ).not.toBeChecked();
        });

        await test.step('Check balances', async () => {
          await expect(
            bondRewardsPage.claim.sourceSelect.rewardsTokenAmount,
          ).toContainText(`0.0 stETH`);

          await expect(
            bondRewardsPage.claim.sourceSelect.rewardsUSDPrice,
          ).toContainText(USD_AMOUNT_REGEX);
        });
      });

      await test.step('Check "Excess bond" source', async () => {
        await test.step('Check checkbox', async () => {
          await expect(
            bondRewardsPage.claim.sourceSelect.excessBond.getByRole('checkbox'),
          ).toBeDisabled();
          await expect(
            bondRewardsPage.claim.sourceSelect.excessBond.getByRole('checkbox'),
          ).toBeChecked();
        });

        await test.step('Check balances', async () => {
          await expect(
            bondRewardsPage.claim.sourceSelect.excessBondTokenAmount,
          ).toContainText(`${bondSummary.excess.toCut(4)} stETH`);

          await expect(
            bondRewardsPage.claim.sourceSelect.excessBondUSDPrice,
          ).toContainText(USD_AMOUNT_WITH_APPROX_REGEX);
        });
      });
    },
  );

  [TOKENS.eth, TOKENS.steth, TOKENS.wsteth].forEach((tokenName) => {
    test(
      qase(200, `Verify UI elements for ${tokenName} buttons`),
      async ({ widgetService, csmSDK, ethereumSDK }) => {
        qase.parameters({ tokenName });
        const bondRewardsPage = widgetService.bondRewardsPage;

        const token = bondRewardsPage.claim.selectBondToken(tokenName);

        const nodeOperatorId = await widgetService.extractNodeOperatorId();

        const bondSummary = await csmSDK.getBondSummary(nodeOperatorId);

        const rateToStETH =
          tokenName === TOKENS.wsteth
            ? parseFloat(await ethereumSDK.getWstETHRate())
            : parseFloat('1.0');

        const expectedTokenAmount =
          `${parseFloat(bondSummary.excess) / rateToStETH}`.toCut(4);

        await test.step(`Verify UI of ${tokenName} button`, async () => {
          await test.step('Verify checked state', async () => {
            if (tokenName === TOKENS.steth) {
              await expect(token.getByRole('radio')).toBeChecked();
            } else {
              await expect(token.getByRole('radio')).not.toBeChecked();
            }
          });

          await token.click();
          await expect(token.getByRole('radio')).toBeChecked();

          await test.step('Verify token amount', async () => {
            await expect(token.getByTestId('tokenAmount')).toContainText(
              `${expectedTokenAmount} ${TOKEN_DISPLAY_NAMES[tokenName]}`,
            );
          });

          await test.step('Verify waiting time and receive data', async () => {
            if (tokenName === TOKENS.eth) {
              await expect(token.getByTestId('waitingTime')).toContainText(
                'Waiting time:~ 1-5 days',
              );
              await expect(token.getByTestId('receive')).toContainText(
                'Receive:withdrawal NFT',
              );
              // await expect(bondRewardsPage.claim.form).toContainText('After receiving NFT you will need to claim ETH manually. FollowFAQfor more details.')
            } else {
              await expect(token.getByTestId('tokenAmount')).toContainText(
                `${expectedTokenAmount} ${TOKEN_DISPLAY_NAMES[tokenName]}`,
              );
              await expect(token.getByTestId('waitingTime')).toContainText(
                'Waiting time:~ 1 min',
              );
              await expect(token.getByTestId('receive')).toContainText(
                `Receive:${TOKEN_DISPLAY_NAMES[tokenName]}`,
              );
            }
          });
        });
      },
    );
  });

  test(
    qase(201, 'Verify UI elements for Rewards Address information'),
    async ({ widgetService, secretPhrase }) => {
      const bondRewardsPage = widgetService.bondRewardsPage;
      const address = mnemonicToAccount(secretPhrase).address;

      await test.step('Verify text of rewards information', async () => {
        const textContentRewardInfo =
          await bondRewardsPage.claim.claimBondFormInfoTitle
            .locator('> div')
            .nth(0)
            .textContent();
        const expectedText = `Rewards Address (${trimAddress(address, 6)}) will receive`;

        expect(textContentRewardInfo?.replace(address, '')).toEqual(
          expectedText,
        );
      });
    },
  );

  [TOKENS.eth, TOKENS.steth, TOKENS.wsteth].forEach((tokenName) => {
    const tag = [Tags.performTX];
    if (tokenName === TOKENS.steth) tag.push(Tags.smoke);

    test(
      qase(62, `Should correct claim by ${tokenName}`),
      { tag },
      async ({ widgetService, csmSDK }) => {
        qase.parameters({ tokenName });
        const bondRewardsPage = widgetService.bondRewardsPage;

        const nodeOperatorId = await widgetService.extractNodeOperatorId();

        const claimAmount = '0.0003';
        const bondSummary = await csmSDK.getBondSummary(nodeOperatorId);

        await widgetService.claim(tokenName, claimAmount);

        await test.step('Verify new balance after bond added', async () => {
          const expectedBalance =
            parseFloat(bondSummary.excess) - parseFloat(claimAmount);

          await expect(
            bondRewardsPage.claim.titledTokenBalance,
          ).not.toContainText('N/A');

          const actualBalance =
            await bondRewardsPage.claim.titledTokenBalance.textContent();

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          expect(parseFloat(actualBalance!)).toBeCloseTo(expectedBalance);
        });
      },
    );
  });

  [TOKENS.eth, TOKENS.steth, TOKENS.wsteth].forEach((tokenName) => {
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
          if (tokenName === TOKENS.eth.valueOf()) {
            await expect(
              bondRewardsPage.claim.requestWithdrawalButton,
            ).toBeEnabled();
          } else {
            await expect(bondRewardsPage.claim.claimButton).toBeEnabled();
          }
        });

        await test.step('Verify "will receive" value', async () => {
          await expect(bondRewardsPage.claim.willReceiveAmount).toContainText(
            `${expectedBalance.toString().toCut(4)} ${TOKEN_DISPLAY_NAMES[tokenName]}`,
          );
        });
      },
    );
  });

  [TOKENS.eth, TOKENS.steth, TOKENS.wsteth].forEach((tokenName) => {
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
          `Entered ${TOKEN_DISPLAY_NAMES[tokenName]} amount exceeds available to claim of ${parseFloat(expectedBalance)}`,
        );
      },
    );
  });
});
