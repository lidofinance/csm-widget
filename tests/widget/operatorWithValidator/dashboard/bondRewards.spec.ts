/* eslint-disable no-irregular-whitespace */
import { COMMON_ACTION_TIMEOUT } from 'tests/consts/timeouts';
import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { CSAccountingContract } from 'tests/services/csmContracts.service';
import { formatEther } from '@ethersproject/units';
import { USD_AMOUNT_REGEX } from 'tests/consts/regexp.const';

test.describe('Dashboard. Bond & Rewards.', async () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.connectWallet();
    await widgetService.dashboardPage.open();
  });

  test(
    qase(134, 'Available to Claim Section Verification'),
    async ({ widgetService }) => {
      const availableToClaim =
        widgetService.dashboardPage.bondRewards.availableToClaim;

      await test.step('Wait for balance loaded', async () => {
        await widgetService.dashboardPage.waitForTextContent(
          availableToClaim.commonBalance_Text,
          COMMON_ACTION_TIMEOUT,
        );
      });

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

        await availableToClaim.button.click();
        await expect(availableToClaim.rewardsBalance).toBeVisible();
        await expect(availableToClaim.button).toHaveAttribute(
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

  test('Tooltip verification for "Rewards" field for "Available to claim" section', async ({
    widgetService,
  }) => {
    const availableToClaim =
      widgetService.dashboardPage.bondRewards.availableToClaim;

    await availableToClaim.expand();

    await test.step('Check tooltip for "Rewards"', async () => {
      await availableToClaim.rewardsBalance_TitleIcon.hover();
      const tooltipContent =
        await widgetService.dashboardPage.bondRewards.getHoveredContent();
      await expect(tooltipContent).toContainText(
        'Next rewards distribution is expected on ',
      );
    });
  });

  test('Tooltip verification for "Excess bond" field for "Available to claim" section', async ({
    widgetService,
  }) => {
    const availableToClaim =
      widgetService.dashboardPage.bondRewards.availableToClaim;

    await availableToClaim.expand();

    await test.step('Check tooltip for "Excess bond"', async () => {
      await availableToClaim.excessBondBalance_TitleIcon.hover();
      const tooltipContent =
        await widgetService.dashboardPage.bondRewards.getHoveredContent();
      await expect(tooltipContent).toContainText('Increases daily');
    });
  });

  test(qase(135, 'Bond Balance Verification'), async ({ widgetService }) => {
    const bondBalance = widgetService.dashboardPage.bondRewards.bondBalance;

    await test.step('Wait for balance loaded', async () => {
      await widgetService.dashboardPage.waitForTextContent(
        bondBalance.commonBalance_Text,
        COMMON_ACTION_TIMEOUT,
      );
    });

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

    await test.step('Check "Bond balance" section', async () => {
      await expect(bondBalance.requiredBondBalance).toBeHidden();

      await bondBalance.button.click();
      await expect(bondBalance.requiredBondBalance).toBeVisible();
      await expect(bondBalance.button).toHaveAttribute('aria-expanded', 'true');
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
      expect(excessBondBalance).toEqual(`${expectedExcessBond.toCut(4)} stETH`);

      const excessBondUSDBalance =
        await bondBalance.excessBondBalance_SubText.textContent();
      expect(excessBondUSDBalance).toMatch(USD_AMOUNT_REGEX);
    });

    await test.step('Verify total claimable amount', async () => {
      const commonBalance = await bondBalance.commonBalance_Text.textContent();
      expect(commonBalance).toEqual(
        `${formatEther(bondSummary.current).toCut(4)} stETH`,
      );

      const commonUSDBalance =
        await bondBalance.commonBalance_SubText.textContent();
      expect(commonUSDBalance).toMatch(USD_AMOUNT_REGEX);
    });
  });

  test(
    qase(
      141,
      'Tooltip verification for "Required bond" field for "Bond balance" section',
    ),
    async ({ widgetService }) => {
      const bondBalance = widgetService.dashboardPage.bondRewards.bondBalance;

      await bondBalance.expand();

      await test.step('Check tooltip for "Required bond"', async () => {
        await bondBalance.requiredBondBalance_TitleIcon.hover();
        const tooltipContent =
          await widgetService.dashboardPage.bondRewards.getHoveredContent();
        await expect(tooltipContent).toContainText(
          'The amount of bond required for all submitted keys of the Node Operator',
        );
      });
    },
  );

  test(
    qase(
      142,
      'Tooltip verification for "Excess bond" field for "Bond balance" section',
    ),
    async ({ widgetService }) => {
      const bondBalance = widgetService.dashboardPage.bondRewards.bondBalance;

      await bondBalance.expand();

      await test.step('Check tooltip for "Excess bond"', async () => {
        await bondBalance.excessBondBalance_TitleIcon.hover();
        const tooltipContent =
          await widgetService.dashboardPage.bondRewards.getHoveredContent();
        await expect(tooltipContent).toContainText(
          'The bond amount available to claim without having to exit validators. Increases daily',
        );
      });
    },
  );

  test.skip(
    qase(136, 'Latest Rewards Distribution Information Verification'),
    async () => {},
  );
  test.skip(
    qase(143, 'Tooltip verification for "Keys over threshold" field'),
    async () => {},
  );
  test.skip(
    qase(144, 'Tooltip verification for "Stuck keys found" field'),
    async () => {},
  );
  test.skip(
    qase(137, 'Upcoming Rewards Distribution Verification'),
    async () => {},
  );

  test(
    qase(138, 'Navigation from Bond & Rewards Section'),
    async ({ widgetService }) => {
      await widgetService.dashboardPage.bondRewards.sectionHeaderLink.click();
      await widgetService.page.waitForURL('**/bond/claim');
    },
  );
});
