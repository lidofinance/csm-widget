/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { CSAccountingContract } from 'tests/services/contractClients/CSAccounting.contract';
import { formatEther } from '@ethersproject/units';
import { USD_AMOUNT_REGEX } from 'tests/consts/regexp.const';

test.describe('Dashboard. Bond & Rewards. Bond balance section.', async () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.connectWallet();
    await widgetService.dashboardPage.open();
  });

  test(
    qase(135, 'Should correctly expand and display the balance'),
    async ({ widgetService }) => {
      const bondBalance = widgetService.dashboardPage.bondRewards.bondBalance;

      const nodeOperatorId =
        (await widgetService.extractNodeOperatorId()) as number;
      if (!nodeOperatorId) {
        throw new Error('Node operator ID not found');
      }

      const bondSummary = await new CSAccountingContract().getBondSummary(
        nodeOperatorId,
      );

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
          `${formatEther(bondSummary.required)} stETH`,
        );

        const rewardsUSDBalance =
          await bondBalance.requiredBondBalance_SubText.textContent();
        expect(rewardsUSDBalance).toMatch(USD_AMOUNT_REGEX);
      });

      await test.step('Verify "Excess bond" stETH value', async () => {
        const expectedExcessBond = formatEther(
          BigInt(bondSummary.current - bondSummary.required),
        );

        const excessBondBalance =
          await bondBalance.excessBondBalance_Text.textContent();
        expect(excessBondBalance).toEqual(
          `${expectedExcessBond.toCut(4)} stETH`,
        );

        const excessBondUSDBalance =
          await bondBalance.excessBondBalance_SubText.textContent();
        expect(excessBondUSDBalance).toMatch(USD_AMOUNT_REGEX);
      });

      await test.step('Verify total claimable amount', async () => {
        const commonBalance =
          await bondBalance.commonBalance_Text.textContent();
        expect(commonBalance).toEqual(
          `${formatEther(bondSummary.current).toCut(4)} stETH`,
        );

        const commonUSDBalance =
          await bondBalance.commonBalance_SubText.textContent();
        expect(commonUSDBalance).toMatch(USD_AMOUNT_REGEX);
      });
    },
  );

  test(
    qase(141, 'Tooltip verification for "Required bond" field'),
    async ({ widgetService }) => {
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
    },
  );

  test(
    qase(142, 'Tooltip verification for "Excess bond" field'),
    async ({ widgetService }) => {
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
    },
  );
});
