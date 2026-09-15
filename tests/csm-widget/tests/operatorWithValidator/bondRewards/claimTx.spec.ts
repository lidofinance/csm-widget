import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { EPIC, qaseTree } from 'tests/csm-widget/consts/qase.const';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/shared/consts/common.const';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

test.describe(
  ...qaseTree({
    epic: EPIC.bondRewards,
    feature: 'Claim',
    story: 'Transaction',
  }),
  async () => {
    test.beforeEach(async ({ widgetService }) => {
      await widgetService.bondRewardsPage.claim.open();
    });

    [TOKENS.eth, TOKENS.steth, TOKENS.wsteth].forEach((tokenName) => {
      const tag = [];
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
  },
);
