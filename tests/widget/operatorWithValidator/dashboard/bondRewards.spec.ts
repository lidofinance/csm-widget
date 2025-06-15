import { COMMON_ACTION_TIMEOUT } from 'tests/consts/timeouts';
import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { CSAccountingContract } from 'tests/services/csmContracts.service';
import { formatEther } from '@ethersproject/units';

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
        expect(rewardsBalance?.replace(/\u00A0/g, ' ')).toEqual('0.0 stETH');

        const rewardsUSDBalance =
          await availableToClaim.rewardsBalance_SubText.textContent();
        expect(rewardsUSDBalance?.replace(/\u00A0/g, ' ')).toEqual('$0.00');
      });

      const expectedExcessBond = formatEther(
        BigInt(bondSummary.current - bondSummary.required),
      );

      await test.step('Verify "Excess bond" stETH value', async () => {
        const excessBondBalance =
          await availableToClaim.excessBondBalance_Text.textContent();
        expect(excessBondBalance?.replace(/\u00A0/g, ' ')).toEqual(
          `${expectedExcessBond.toCut(4)} stETH`,
        );

        const excessBondUSDBalance =
          await availableToClaim.excessBondBalance_SubText.textContent();
        expect(excessBondUSDBalance).toContain('$'); // @todo: add more better check
      });

      await test.step('Verify total claimable amount', async () => {
        const commonBalance =
          await availableToClaim.commonBalance_Text.textContent();
        expect(commonBalance?.replace(/\u00A0/g, ' ')).toEqual(
          `${expectedExcessBond.toCut(4)} stETH`,
        );

        const commonUSDBalance =
          await availableToClaim.commonBalance_SubText.textContent();
        expect(commonUSDBalance).toContain('$'); // @todo: add more better check
      });
    },
  );

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
      expect(rewardsBalance?.replace(/\u00A0/g, ' ')).toEqual(
        `${formatEther(bondSummary.required)} stETH`,
      );

      const rewardsUSDBalance =
        await bondBalance.requiredBondBalance_SubText.textContent();
      expect(rewardsUSDBalance?.replace(/\u00A0/g, ' ')).toContain('$'); // @todo: add more better check
    });

    await test.step('Verify "Excess bond" stETH value', async () => {
      const expectedExcessBond = formatEther(
        BigInt(bondSummary.current - bondSummary.required),
      );

      const excessBondBalance =
        await bondBalance.excessBondBalance_Text.textContent();
      expect(excessBondBalance?.replace(/\u00A0/g, ' ')).toEqual(
        `${expectedExcessBond.toCut(4)} stETH`,
      );

      const excessBondUSDBalance =
        await bondBalance.excessBondBalance_SubText.textContent();
      expect(excessBondUSDBalance).toContain('$'); // @todo: add more better check
    });

    await test.step('Verify total claimable amount', async () => {
      const commonBalance = await bondBalance.commonBalance_Text.textContent();
      expect(commonBalance?.replace(/\u00A0/g, ' ')).toEqual(
        `${formatEther(bondSummary.current).toCut(4)} stETH`,
      );

      const commonUSDBalance =
        await bondBalance.commonBalance_SubText.textContent();
      expect(commonUSDBalance).toContain('$'); // @todo: add more better check
    });
  });
  test.skip(
    qase(141, 'Tooltip verification for "Required bond" field'),
    async () => {},
  );
  test.skip(
    qase(142, 'Tooltip verification for "Excess bond" field'),
    async () => {},
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
