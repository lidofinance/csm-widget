/* eslint-disable no-irregular-whitespace */
import { expect, Locator } from '@playwright/test';
import { test } from '../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { qase } from 'playwright-qase-reporter/playwright';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.dashboard,
    feature: 'Bond & Rewards',
    story: 'Bond balance',
  }),
  async () => {
    test.beforeEach(async ({ widgetService }) => {
      await widgetService.dashboardPage.open();
    });

    test(
      qase(135, 'Should correctly display the balance'),
      async ({ widgetService, csmSDK }) => {
        const { balanceCard } = widgetService.dashboardPage;

        const nodeOperatorId = await widgetService.extractNodeOperatorId();

        const bondSummary = await csmSDK.getBondSummary(nodeOperatorId);
        const rewards = await csmSDK.getRewards(nodeOperatorId);

        const expectAmount = async (
          locator: Locator,
          expected: string | number,
        ) => {
          await expect(locator).toHaveText(/\d/);
          const value = parseFloat(
            ((await locator.textContent()) ?? '').replace(/,/g, ''),
          );
          expect(Math.abs(value - Number(expected))).toBeLessThan(0.1);
        };

        await test.step('Verify balance value', async () => {
          await expectAmount(balanceCard.value, bondSummary.current);
        });

        await test.step('Verify "Required bond"', async () => {
          await expectAmount(balanceCard.requiredBond, bondSummary.required);
        });

        await test.step('Verify "Excess bond"', async () => {
          await expectAmount(balanceCard.excessBond, bondSummary.excess);
        });

        await test.step('Verify "Rewards"', async () => {
          await expectAmount(balanceCard.rewards, rewards.available);
        });
      },
    );
  },
);
