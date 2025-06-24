/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';

test.describe('Bond & Rewards. Add bond.', async () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.connectWallet();
    await widgetService.bondRewardsPage.open();
  });

  test('Should displays balance and explanatory text for stETH bond', async ({
    widgetService,
    contractClients,
  }) => {
    const bondRewardsPage = widgetService.bondRewardsPage;

    await test.step('Verify information about bond', async () => {
      const nodeOperatorId = await widgetService.extractNodeOperatorId();

      if (!nodeOperatorId) {
        throw new Error('Node operator ID not found');
      }

      await test.step('Verify bond balance', async () => {
        await expect(
          bondRewardsPage.titledAmount.locator('div').first(),
        ).toContainText('Bond balance');
        const bondSummary =
          await contractClients.CSAccounting.getBondSummary(nodeOperatorId);

        await expect(bondRewardsPage.titledAmountBalance).toHaveText(
          `${bondSummary.excess.toCut(4)} stETH`,
        );
      });

      await test.step('Verify text', async () => {
        const expectedText =
          'Why you might need to add bond:Adding a bond serves as a voluntary security measure for your Node Operator to prevent your validators from becoming unbonded and being requested to exit in case of applied penalties.Supplied bond will be stored as stETH, which also garners staking rewards.';
        await expect(bondRewardsPage.formInfoText).toContainText(expectedText);

        const expectedLinkHref =
          'https://docs.lido.fi/staking-modules/csm/guides/unbonded-validators';
        const linkUnbondedElement = bondRewardsPage.formInfoText.locator('a');
        // @todo: check to click on the link
        await expect(linkUnbondedElement).toHaveAttribute(
          'href',
          expectedLinkHref,
        );
      });
    });
  });

  (['ETH', 'STETH', 'WSTETH'] as const).forEach((tokenName) => {
    test(`Should adds bond using ${tokenName} as bond token`, async ({
      widgetService,
      contractClients,
    }) => {
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
          await bondRewardsPage.titledAmountBalance.textContent();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        expect(parseFloat(actualBalance!)).toBeCloseTo(expectedBalance);
      });
    });
  });

  test.skip(
    qase(65, 'Add bond using maximum available ETH amount'),
    async () => {},
  );

  test.skip(
    qase(66, 'Add bond with manual token amount entry'),
    async () => {},
  );

  test.skip(
    qase(67, 'Attempt to add bond exceeding available balance'),
    async () => {},
  );
});
