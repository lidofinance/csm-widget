/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { USD_AMOUNT_REGEX } from '../../../../../shared/consts/regexp.const';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/shared/consts/common.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  'Dashboard. Bond & Rewards. Available to claim section.',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(
      async ({ useFork, cmSDK, forkActionService, widgetService }) => {
        test.skip(!useFork, 'Test suite runs only on forked network');

        snapshotId = await cmSDK.evmSnapshot();

        await test.step('Set up: add excess bond and report rewards', async () => {
          await widgetService.dashboardPage.open();
          noId = await widgetService.extractNodeOperatorId();
          await forkActionService.addBond(noId, '2');
          await forkActionService.reportRewards();
        });
      },
    );

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.dashboardPage.open();
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });
    test(
      qase(131, 'Should correctly expand and display the balance'),
      async ({ widgetService, cmSDK }) => {
        const availableToClaim =
          widgetService.dashboardPage.bondRewards.availableToClaim;

        const nodeOperatorId = await widgetService.extractNodeOperatorId();

        const bondSummary = await cmSDK.getBondSummary(nodeOperatorId);
        const rewards = await cmSDK.getRewards(nodeOperatorId);

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
          const rewardsText =
            await availableToClaim.rewardsBalance_Text.textContent();
          expect(rewardsText).toEqual(`${rewards.available.toCut(4)} stETH`);

          await expect(availableToClaim.rewardsBalance_SubText).not.toHaveText(
            'N/A',
            { timeout: 20000 },
          );
          const rewardsUSDBalance =
            await availableToClaim.rewardsBalance_SubText.textContent();
          expect(rewardsUSDBalance).toMatch(USD_AMOUNT_REGEX);
        });

        await test.step('Verify "Excess bond" stETH value', async () => {
          const excessBondBalance =
            await availableToClaim.excessBondBalance_Text.textContent();
          expect(excessBondBalance).toEqual(
            `${bondSummary.excess.toCut(4)} stETH`,
          );

          const excessBondUSDBalance =
            await availableToClaim.excessBondBalance_SubText.textContent();
          expect(excessBondUSDBalance).toMatch(USD_AMOUNT_REGEX);
        });

        await test.step('Verify total claimable amount', async () => {
          const commonBalance =
            await availableToClaim.commonBalance_Text.textContent();
          expect(commonBalance).toEqual(
            `${(parseFloat(bondSummary.excess) + parseFloat(rewards.available)).toString().toCut(4)} stETH`,
          );

          const commonUSDBalance =
            await availableToClaim.commonBalance_SubText.textContent();
          expect(commonUSDBalance).toMatch(USD_AMOUNT_REGEX);
        });
      },
    );

    test(
      qase(132, 'Tooltip verification for "Rewards" field'),
      async ({ widgetService }) => {
        const availableToClaim =
          widgetService.dashboardPage.bondRewards.availableToClaim;

        await availableToClaim.expand();

        await test.step('Check tooltip for "Rewards"', async () => {
          const tooltip = await widgetService.dashboardPage.hoverElement(
            availableToClaim.rewardsBalance_TitleIcon,
          );
          expect(tooltip).toContain(
            'Next rewards distribution is expected on ',
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
      qase(133, 'Tooltip verification for "Excess bond" field'),
      async ({ widgetService }) => {
        const availableToClaim =
          widgetService.dashboardPage.bondRewards.availableToClaim;

        await availableToClaim.expand();

        await test.step('Check tooltip for "Excess bond"', async () => {
          const tooltip = await widgetService.dashboardPage.hoverElement(
            availableToClaim.excessBondBalance_TitleIcon,
          );

          expect(tooltip).toContain('Increases daily');
        });

        await test.step('Check to hidden tooltip after unhover', async () => {
          await widgetService.dashboardPage.closeTooltip();
          const tooltip =
            await widgetService.dashboardPage.bondRewards.getHoveredContent();
          await expect(tooltip).toBeHidden();
        });
      },
    );
  },
);
