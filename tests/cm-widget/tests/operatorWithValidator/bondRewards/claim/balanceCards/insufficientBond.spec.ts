import { expect } from '@playwright/test';
import { Tags } from 'tests/shared/consts/common.const';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../../../test.fixture';
import { formatEther } from 'viem';

const OPERATOR_0_ID = 0;
const ONE_ETH = 1_000_000_000_000_000_000n;

const CLAIM_OPTION = {
  ALL_TO_RA: 'all-to-ra',
  REWARDS_TO_BOND: 'rewards-to-bond',
} as const;

test.describe(
  'Bond & Rewards. Claim. Balance cards. Insufficient bond state.',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeEach(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();
      const bondBalance = await cmSDK.operator.getBondBalance(
        BigInt(OPERATOR_0_ID),
      );
      // excess + 1 ETH ensures current bond drops below required after settlement
      const penaltyAmount = formatEther(bondBalance.delta + ONE_ETH);
      await forkActionService.reportPenalty(OPERATOR_0_ID, penaltyAmount);
      await forkActionService.settlePenalty(OPERATOR_0_ID);
      await widgetService.bondRewardsPage.claim.open();
    });

    test.afterEach(async ({ cmSDK }) => {
      await cmSDK.evmRevert(snapshotId);
    });

    test('Should show "Insufficient bond" title and amount on Bond balance card', async ({
      widgetService,
    }) => {
      const { claim } = widgetService.bondRewardsPage;

      await test.step('Bond balance card is visible', async () => {
        await expect(claim.bondBalanceCard).toBeVisible({
          timeout: STAGE_WAIT_TIMEOUT,
        });
      });

      await test.step('Card title reads "Insufficient bond"', async () => {
        await expect(claim.bondBalanceCard).toContainText('Insufficient bond');
      });

      await test.step('Bond balance card shows stETH amount', async () => {
        await expect(claim.bondBalanceCard).toContainText('stETH');
      });
    });

    test('Should show correct tooltip for Bond balance card in insufficient bond state', async ({
      widgetService,
    }) => {
      const { claim } = widgetService.bondRewardsPage;

      await test.step('Bond balance card is visible', async () => {
        await expect(claim.bondBalanceCard).toBeVisible({
          timeout: STAGE_WAIT_TIMEOUT,
        });
      });

      await test.step('Tooltip appears on hover', async () => {
        await claim.bondBalanceCardInfoIcon.hover();
        await expect(claim.tooltipWrapper).toHaveCount(1);
        await expect(claim.tooltipWrapper).toBeVisible({
          timeout: STAGE_WAIT_TIMEOUT,
        });
      });

      await test.step('Tooltip describes missing bond requirement', async () => {
        await expect(claim.tooltipWrapper).toContainText(
          "Insufficient bond is the missing amount of stETH required to cover all operator's keys",
        );
      });
    });

    test('Should show "Compensate the Insufficient Bond" description for REWARDS_TO_BOND when rewards are available', async ({
      widgetService,
      cmSDK,
    }) => {
      const noId = await widgetService.extractNodeOperatorId();
      const rewards = await cmSDK.getRewards(noId);

      test.skip(
        rewards.available <= 0n,
        'No rewards available — claim options are hidden',
      );

      const { claim } = widgetService.bondRewardsPage;
      const container = claim
        .getClaimOptionRadio(CLAIM_OPTION.REWARDS_TO_BOND)
        .locator('..');

      await test.step('REWARDS_TO_BOND label contains "Rewards" and "Bond"', async () => {
        await expect(container).toContainText('Rewards', {
          timeout: STAGE_WAIT_TIMEOUT,
        });
        await expect(container).toContainText('Bond');
      });

      await test.step('Description reads "Compensate the Insufficient Bond"', async () => {
        await expect(container).toContainText(
          'Compensate the Insufficient Bond',
        );
      });
    });

    test('Should show correct ALL_TO_RA description when bond is insufficient and rewards are available', async ({
      widgetService,
      cmSDK,
    }) => {
      const noId = await widgetService.extractNodeOperatorId();
      const rewards = await cmSDK.getRewards(noId);

      test.skip(
        rewards.available <= 0n,
        'No rewards available — claim options are hidden',
      );

      const { claim } = widgetService.bondRewardsPage;
      const bondBalance = await cmSDK.operator.getBondBalance(
        BigInt(OPERATOR_0_ID),
      );
      const container = claim
        .getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA)
        .locator('..');

      if (bondBalance.delta >= rewards.available) {
        await test.step('ALL_TO_RA description reads "All Rewards will compensate the Insufficient Bond" when deficit ≥ rewards', async () => {
          await expect(container).toContainText(
            'All Rewards will compensate the Insufficient Bond',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
        });
      } else {
        await test.step('ALL_TO_RA description reads "Compensate the Insufficient Bond and claim Rewards" when rewards exceed deficit', async () => {
          await expect(container).toContainText(
            'Compensate the Insufficient Bond and claim Rewards',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
        });
      }
    });
  },
);
