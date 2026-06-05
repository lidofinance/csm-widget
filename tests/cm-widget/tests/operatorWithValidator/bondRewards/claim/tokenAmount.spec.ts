import { expect } from '@playwright/test';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { TOKEN_DISPLAY_NAMES } from 'utils/get-token-display-name';
import { test } from '../../../test.fixture';
import { formatEther } from 'viem';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const BOND_EXCESS_ETH = '2';

test.describe(
  'Bond & Rewards. Claim. Token select & amount.',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();
      await widgetService.bondRewardsPage.claim.open();
      noId = await widgetService.extractNodeOperatorId();
      await forkActionService.addBond(noId, BOND_EXCESS_ETH);
    });

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.bondRewardsPage.claim.open();
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test(
      qase(337, 'Should show "Choose a token to claim" section'),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('Token buttons section is visible', async () => {
          await expect(claim.tokenButtons).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await expect(claim.form).toContainText('Choose a token to claim');
        });
      },
    );

    [TOKENS.steth, TOKENS.wsteth, TOKENS.eth].forEach((tokenName) => {
      test(
        qase(
          338,
          `Should show correct name, converted amount and hint for ${tokenName}`,
        ),
        async ({ widgetService, cmSDK }) => {
          const { claim } = widgetService.bondRewardsPage;
          const bondBalance = await cmSDK.operator.getBondBalance(BigInt(noId));
          // claimable = current - required - locked - debt (matches UI computation)
          const claimable =
            bondBalance.current -
            bondBalance.required -
            bondBalance.locked -
            bondBalance.debt;
          const expectedSteth = parseFloat(
            formatEther(claimable > 0n ? claimable : 0n),
          );
          const token = claim.getTokenCardBySymbol(tokenName);

          await test.step('Select token — radio is checked', async () => {
            await claim.selectBondToken(tokenName);
            await expect(token.getByRole('radio')).toBeChecked({
              timeout: PAGE_WAIT_TIMEOUT,
            });
          });

          await test.step('Token name is correct', async () => {
            await expect(token.getByTestId('tokenAmount')).toContainText(
              TOKEN_DISPLAY_NAMES[tokenName],
            );
          });

          await test.step('Amount is correctly converted from stETH', async () => {
            const amount = parseFloat(await claim.getBalanceByToken(tokenName));
            if (tokenName === TOKENS.steth) {
              // 4 decimals shown; stETH share conversion may shift last decimal by ±1
              expect(Math.abs(amount - expectedSteth)).toBeLessThan(0.0002);
            } else if (tokenName === TOKENS.wsteth) {
              // wstETH is worth more per token → fewer tokens for same underlying value
              expect(amount).toBeGreaterThan(0);
              expect(amount).toBeLessThan(expectedSteth);
            } else {
              // ETH withdrawal ≈ stETH at ~1:1
              expect(Math.abs(amount - expectedSteth)).toBeLessThan(0.01);
            }
          });

          await test.step('Input label shows correct token name', async () => {
            await expect(claim.amountLabel).toContainText(
              `${TOKEN_DISPLAY_NAMES[tokenName]} amount`,
            );
          });

          if (tokenName === TOKENS.eth) {
            await test.step('Note about manual ETH claim is shown with FAQ link', async () => {
              await expect(claim.ethNote).toContainText(
                'note: After receiving NFT you will need to claim ETH manually. Follow FAQ for more details.',
              );
              await expect(
                claim.ethNote.getByRole('link', { name: 'FAQ' }),
              ).toBeVisible();
            });
          }

          await test.step('Hint shows correct waiting time and receive info', async () => {
            if (tokenName === TOKENS.eth) {
              await expect(token.getByTestId('waitingTime')).toContainText(
                'Waiting time:',
              );
              await expect(token.getByTestId('receive')).toContainText(
                'withdrawal NFT',
              );
            } else {
              await expect(token.getByTestId('waitingTime')).toContainText(
                '~ 1 min',
              );
              await expect(token.getByTestId('receive')).toContainText(
                TOKEN_DISPLAY_NAMES[tokenName],
              );
            }
          });
        },
      );
    });

    [TOKENS.steth, TOKENS.wsteth, TOKENS.eth].forEach((tokenName) => {
      test(
        qase(
          341,
          `Should fill amount with Max and enable submit for ${tokenName}`,
        ),
        async ({ widgetService, cmSDK }) => {
          const { claim } = widgetService.bondRewardsPage;
          const bondBalance = await cmSDK.operator.getBondBalance(BigInt(noId));
          const claimable =
            bondBalance.current -
            bondBalance.required -
            bondBalance.locked -
            bondBalance.debt;
          const expectedSteth = parseFloat(
            formatEther(claimable > 0n ? claimable : 0n),
          );

          await claim.selectBondToken(tokenName);
          const expectedBalance = await claim.getBalanceByToken(tokenName);

          await test.step('Max fills input with available balance', async () => {
            await claim.maxBtn.click();
            const input = parseFloat(await claim.amountInput.inputValue());
            expect(input).toBeCloseTo(parseFloat(expectedBalance));
          });

          await test.step('Submit button is enabled', async () => {
            const btn =
              tokenName === TOKENS.eth
                ? claim.requestWithdrawalButton
                : claim.claimButton;
            await expect(btn).toBeEnabled({ timeout: PAGE_WAIT_TIMEOUT });
          });

          await test.step('"Rewards Address will receive" row is shown', async () => {
            await expect(claim.claimBondFormInfoTitle).toContainText(
              'will receive',
              { timeout: PAGE_WAIT_TIMEOUT },
            );
          });

          await test.step('"will receive" amount shows selected token', async () => {
            await expect(claim.willReceiveAmount).toContainText(
              TOKEN_DISPLAY_NAMES[tokenName],
              { timeout: PAGE_WAIT_TIMEOUT },
            );
          });

          await test.step('"Excess bond will decrease by" shows correct stETH amount', async () => {
            const text = await claim.bondDecreaseRow
              .getByTestId('tokenAmount')
              .textContent();
            expect(text).toContain('stETH');
            // wstETH: decrease shows stETH equivalent of max wstETH (double floor conversion → ≤ 0.01 drift)
            const tolerance = tokenName === TOKENS.wsteth ? 0.01 : 0.0002;
            expect(
              Math.abs(parseFloat(text ?? '0') - expectedSteth),
            ).toBeLessThan(tolerance);
          });
        },
      );
    });

    [TOKENS.steth, TOKENS.wsteth, TOKENS.eth].forEach((tokenName) => {
      test(
        qase(
          344,
          `Should show validation error when ${tokenName} amount exceeds balance`,
        ),
        async ({ widgetService }) => {
          const { claim } = widgetService.bondRewardsPage;

          await claim.selectBondToken(tokenName);

          await test.step('Fill amount exceeding balance', async () => {
            await claim.amountInput.fill('1000000');
            await claim.page.mouse.click(0, 0);
          });

          await test.step('Validation error shown', async () => {
            await expect(claim.validationInputTooltip).toContainText(
              `Entered ${TOKEN_DISPLAY_NAMES[tokenName]} amount exceeds available to claim`,
              { timeout: PAGE_WAIT_TIMEOUT },
            );
          });
        },
      );
    });

    test(
      qase(347, 'Should disable submit when amount input is empty'),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await claim.selectBondToken(TOKENS.steth);

        await test.step('Clear amount input', async () => {
          await claim.amountInput.fill('');
          await claim.page.mouse.click(0, 0);
        });

        await test.step('Claim button is disabled', async () => {
          await expect(claim.claimButton).toBeDisabled({
            timeout: PAGE_WAIT_TIMEOUT,
          });
        });
      },
    );

    test(
      qase(
        348,
        'Should show reward address, Etherscan link and tooltip in "will receive" row',
      ),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('Select stETH and fill max to show info row', async () => {
          await claim.selectBondToken(TOKENS.steth);
          await claim.maxBtn.click();
          await expect(claim.claimButton).toBeEnabled({
            timeout: PAGE_WAIT_TIMEOUT,
          });
        });

        await test.step('Rewards Address is shown', async () => {
          await expect(
            claim.claimBondFormInfoTitle.getByTestId('addressText'),
          ).toContainText(/0x/, { timeout: PAGE_WAIT_TIMEOUT });
        });

        await test.step('Etherscan link is visible', async () => {
          await expect(
            claim.claimBondFormInfoTitle.getByTestId('etherscanLink'),
          ).toBeVisible();
        });

        await test.step('Help tooltip shows recipient info', async () => {
          // DataTableRow renders help icon as an SVG (Question) without data-testid;
          // it is the last SVG in the row (after the External icon inside etherscanLink).
          // lido-ui Tooltip renders content into #lido-ui-modal-root (not tooltipWrapper)
          await claim.claimBondFormInfoTitle.locator('svg').last().hover();
          await expect(claim.page.locator('#lido-ui-modal-root')).toContainText(
            'The recipient of the claim is the Rewards Address. You can change the Rewards Address on the Settings tab',
            { timeout: PAGE_WAIT_TIMEOUT },
          );
        });
      },
    );
  },
);
