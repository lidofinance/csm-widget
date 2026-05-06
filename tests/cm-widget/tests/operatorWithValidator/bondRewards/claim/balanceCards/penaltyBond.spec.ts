import { expect } from '@playwright/test';
import { Tags } from 'tests/shared/consts/common.const';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../../../test.fixture';

const OPERATOR_0_ID = 0;
const SMALL_PENALTY = '1';

test.describe(
  'Bond & Rewards. Claim. Balance cards. Penalty bond state.',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeEach(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();
      await forkActionService.reportPenalty(OPERATOR_0_ID, SMALL_PENALTY);
      await widgetService.bondRewardsPage.claim.open();
    });

    test.afterEach(async ({ cmSDK }) => {
      await cmSDK.evmRevert(snapshotId);
    });

    test('Should show locked-bond tooltip on Bond balance card when locked > 0', async ({
      widgetService,
    }) => {
      const { claim } = widgetService.bondRewardsPage;

      await test.step('Bond balance card is visible', async () => {
        await expect(claim.bondBalanceCard).toBeVisible({
          timeout: STAGE_WAIT_TIMEOUT,
        });
      });

      await test.step('Card title still reads "Excess bond" (locked but not insufficient)', async () => {
        await expect(claim.bondBalanceCard).toContainText('Excess bond');
      });

      await test.step('Tooltip appears on hover', async () => {
        await claim.lockedBondRowInfoIcon.hover();
        await expect(claim.tooltipWrapper).toHaveCount(1);
        await expect(claim.tooltipWrapper).toBeVisible({
          timeout: STAGE_WAIT_TIMEOUT,
        });
      });

      await test.step('Tooltip explains locked bond is excluded from claimable excess', async () => {
        await expect(claim.tooltipWrapper).toContainText(
          'Penalties have been applied to your Node Operator. If they are not covered, the corresponding amount of your bond may be burned. See details in the Locked Bond tab',
        );
      });
    });
  },
);
