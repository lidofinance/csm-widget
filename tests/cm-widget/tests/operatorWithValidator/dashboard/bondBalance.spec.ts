/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { USD_AMOUNT_REGEX } from '../../../../shared/consts/regexp.const';

test.describe('Dashboard. Bond & Rewards. Bond balance section.', async () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.dashboardPage.open();
  });

  test('Should correctly expand and display the balance', async ({
    widgetService,
    cmSDK,
  }) => {
    const bondBalance = widgetService.dashboardPage.bondRewards.bondBalance;

    const nodeOperatorId = await widgetService.extractNodeOperatorId();

    const bondSummary = await cmSDK.getBondSummary(nodeOperatorId);

    await test.step('Check "Bond balance" section', async () => {
      await expect(bondBalance.requiredBondBalance).toBeHidden();

      await bondBalance.expandedButton.click();
      await expect(bondBalance.requiredBondBalance).toBeVisible();
      await expect(bondBalance.expandedButton).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    });

    await test.step('Verify "Required bond" stETH value', async () => {
      const rewardsBalance =
        await bondBalance.requiredBondBalance_Text.textContent();
      expect(rewardsBalance).toEqual(
        `${parseFloat(bondSummary.required).toFixed(1)} stETH`,
      );

      await expect(bondBalance.requiredBondBalance_SubText).not.toHaveText(
        'N/A',
        {
          timeout: 10000,
        },
      );
      const rewardsUSDBalance =
        await bondBalance.requiredBondBalance_SubText.textContent();
      expect(rewardsUSDBalance).toMatch(USD_AMOUNT_REGEX);
    });

    await test.step('Verify "Excess bond" stETH value', async () => {
      const excessBondBalance =
        await bondBalance.excessBondBalance_Text.textContent();
      expect(excessBondBalance).toEqual(`${bondSummary.excess.toCut(4)} stETH`);

      const excessBondUSDBalance =
        await bondBalance.excessBondBalance_SubText.textContent();
      expect(excessBondUSDBalance).toMatch(USD_AMOUNT_REGEX);
    });

    await test.step('Verify total claimable amount', async () => {
      const commonBalance = await bondBalance.commonBalance_Text.textContent();
      expect(commonBalance).toEqual(`${bondSummary.current.toCut(4)} stETH`);

      const commonUSDBalance =
        await bondBalance.commonBalance_SubText.textContent();
      expect(commonUSDBalance).toMatch(USD_AMOUNT_REGEX);
    });
  });

  test('Tooltip verification for "Required bond" field', async ({
    widgetService,
  }) => {
    const bondBalance = widgetService.dashboardPage.bondRewards.bondBalance;

    await bondBalance.expand();

    await test.step('Check tooltip for "Required bond"', async () => {
      const tooltip = await widgetService.dashboardPage.hoverElement(
        bondBalance.requiredBondBalance_TitleIcon,
      );

      expect(tooltip).toContain(
        'The amount of bond required for all submitted keys of the Node Operator',
      );
    });

    await test.step('Check to hidden tooltip after unhover', async () => {
      await widgetService.dashboardPage.closeTooltip();
      const tooltip =
        await widgetService.dashboardPage.bondRewards.getHoveredContent();
      await expect(tooltip).toBeHidden();
    });
  });

  test('Tooltip verification for "Excess bond" field', async ({
    widgetService,
  }) => {
    const bondBalance = widgetService.dashboardPage.bondRewards.bondBalance;

    await bondBalance.expand();

    await test.step('Check tooltip for "Excess bond"', async () => {
      const tooltip = await widgetService.dashboardPage.hoverElement(
        bondBalance.excessBondBalance_TitleIcon,
      );

      expect(tooltip).toContain(
        'The bond amount available to claim without having to exit validators. Increases daily',
      );
    });

    await test.step('Check to hidden tooltip after unhover', async () => {
      await widgetService.dashboardPage.closeTooltip();
      const tooltip =
        await widgetService.dashboardPage.bondRewards.getHoveredContent();
      await expect(tooltip).toBeHidden();
    });
  });
});
