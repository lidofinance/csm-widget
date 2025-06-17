/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { CSAccountingContract } from 'tests/services/csmContracts.service';
import { formatEther } from '@ethersproject/units';
import { USD_AMOUNT_REGEX } from 'tests/consts/regexp.const';

test.describe('Dashboard. Bond & Rewards. Available to claim section.', async () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.connectWallet();
    await widgetService.dashboardPage.open();
  });

  test(
    qase(134, 'Should correctly expand and display the balance'),
    async ({ widgetService }) => {
      const availableToClaim =
        widgetService.dashboardPage.bondRewards.availableToClaim;

      const nodeOperatorId =
        (await widgetService.extractNodeOperatorId()) as number;
      if (!nodeOperatorId) {
        throw new Error('Node operator ID not found');
      }

      let bondSummary: any;
      await test.step('Try to get bond blanace from contract directly', async () => {
        bondSummary = await new CSAccountingContract().getBondSummary(
          nodeOperatorId,
        );
      });

      await test.step('Check "Available to claim" section', async () => {
        await expect(availableToClaim.rewardsBalance).toBeHidden();

        await availableToClaim.expandedButton.click();
        await expect(availableToClaim.rewardsBalance).toBeVisible();
        await expect(availableToClaim.expandedButton).toHaveAttribute(
          'aria-expanded',
          'true',
        );
      });

      await test.step('Verify "Rewards" stETH value', async () => {
        const rewardsBalance =
          await availableToClaim.rewardsBalance_Text.textContent();
        expect(rewardsBalance).toEqual('0.0 stETH');

        const rewardsUSDBalance =
          await availableToClaim.rewardsBalance_SubText.textContent();
        expect(rewardsUSDBalance).toEqual('$0.00');
      });

      const expectedExcessBond = formatEther(
        BigInt(bondSummary.current - bondSummary.required),
      );

      await test.step('Verify "Excess bond" stETH value', async () => {
        const excessBondBalance =
          await availableToClaim.excessBondBalance_Text.textContent();
        expect(excessBondBalance).toEqual(
          `${expectedExcessBond.toCut(4)} stETH`,
        );

        const excessBondUSDBalance =
          await availableToClaim.excessBondBalance_SubText.textContent();
        expect(excessBondUSDBalance).toMatch(USD_AMOUNT_REGEX);
      });

      await test.step('Verify total claimable amount', async () => {
        const commonBalance =
          await availableToClaim.commonBalance_Text.textContent();
        expect(commonBalance).toEqual(`${expectedExcessBond.toCut(4)} stETH`);

        const commonUSDBalance =
          await availableToClaim.commonBalance_SubText.textContent();
        expect(commonUSDBalance).toMatch(USD_AMOUNT_REGEX);
      });
    },
  );

  test('Tooltip verification for "Rewards" field', async ({
    widgetService,
  }) => {
    const availableToClaim =
      widgetService.dashboardPage.bondRewards.availableToClaim;

    await availableToClaim.expand();

    await test.step('Check tooltip for "Rewards"', async () => {
      const tooltip = await widgetService.dashboardPage.hoverElement(
        availableToClaim.rewardsBalance_TitleIcon,
      );
      expect(tooltip).toContain('Next rewards distribution is expected on ');
    });

    await test.step('Check to hidden tooltip after unhover', async () => {
      await widgetService.page.mouse.move(0, 0);
      const tooltip =
        await widgetService.dashboardPage.bondRewards.getHoveredContent();
      await expect(tooltip).toBeHidden();
    });
  });

  test('Tooltip verification for "Excess bond" field', async ({
    widgetService,
  }) => {
    const availableToClaim =
      widgetService.dashboardPage.bondRewards.availableToClaim;

    await availableToClaim.expand();

    await test.step('Check tooltip for "Excess bond"', async () => {
      const tooltip = await widgetService.dashboardPage.hoverElement(
        availableToClaim.excessBondBalance_TitleIcon,
      );
      // Предыдущий метод иногда может по дороге захватить другой тултип https://app.qase.io/run/CSM/dashboard/118/cc3796f85f0de1b5c60f0e6d14fa3659adff9c3b
      expect(tooltip).toContain('Increases daily');
    });

    await test.step('Check to hidden tooltip after unhover', async () => {
      await widgetService.page.mouse.move(0, 0);
      const tooltip =
        await widgetService.dashboardPage.bondRewards.getHoveredContent();
      await expect(tooltip).toBeHidden();
    });
  });
});
