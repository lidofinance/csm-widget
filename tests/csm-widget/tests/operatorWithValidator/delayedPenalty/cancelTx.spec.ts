import { expect } from '@playwright/test';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import {
  PAGE_WAIT_TIMEOUT,
  RPC_WAIT_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
} from 'tests/shared/consts/timeouts';
import { formatEther, parseEther } from 'viem';
import { test } from '../../test.fixture';
import {
  AMOUNT_TOLERANCE,
  parseAmount,
  REPORT_GENERAL_DELAYED_PENALTY_ROLE,
} from '../../../consts/delayedPenalty.const';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const CANCEL_AMOUNT = '0.4';

test.describe(
  ...suite({
    epic: EPIC.delayedPenalty,
    feature: 'Cancel',
    story: 'Transaction',
  }),
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(async ({ csmSDK, forkActionService, widgetService }) => {
      snapshotId = await csmSDK.evmSnapshot();

      await test.step('Grant reporter role to the wallet', async () => {
        await forkActionService.grantRole(
          REPORT_GENERAL_DELAYED_PENALTY_ROLE,
          PRESETS.FULL_OPERATOR.address,
        );
      });

      await test.step('Lock bond of own operator with a penalty', async () => {
        await widgetService.dashboardPage.open();
        noId = await widgetService.extractNodeOperatorId();
        await forkActionService.reportPenalty(noId, '1');
      });
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    test('Should cancel part of penalty and show it to the operator', async ({
      widgetService,
      csmSDK,
    }) => {
      const { cancel, txModal } = widgetService.delayedPenaltyPage;
      const { unlockBond } = widgetService.bondRewardsPage;
      const lockedBefore = (await csmSDK.operator.getBondBalance(BigInt(noId)))
        .locked;

      await test.step('Submit the cancel form', async () => {
        await cancel.open();
        await cancel.submit(noId, CANCEL_AMOUNT);
      });

      await test.step('Sign stage shows operator and amount', async () => {
        await expect(txModal.title).toHaveText(
          'You are canceling delayed penalty',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
        await expect(txModal.description).toContainText(
          `Node Operator ID: ${noId}`,
        );
        await expect(txModal.description).toContainText(CANCEL_AMOUNT);
      });

      await test.step('Confirm transaction and wait for success', async () => {
        await widgetService.walletPage.confirmTx();
        await expect(txModal.title).toHaveText('Delayed penalty is canceled', {
          timeout: STAGE_WAIT_TIMEOUT,
        });
        await txModal.closeModal();
      });

      const { locked } = await csmSDK.operator.getBondBalance(BigInt(noId));

      await test.step('Locked bond decreased by the cancelled amount', async () => {
        expect(lockedBefore - locked).toBe(parseEther(CANCEL_AMOUNT));
      });

      await test.step('Locked table shows the remaining amount', async () => {
        // the table refetches after the modal closes
        await expect
          .poll(
            async () =>
              parseAmount(
                await cancel
                  .lockedRow(noId)
                  .getByTestId('lockedAmountCell')
                  .textContent(),
              ),
            { timeout: PAGE_WAIT_TIMEOUT },
          )
          .toBeCloseTo(parseFloat(formatEther(locked)), 3);
      });

      await test.step('Penalty History lists the cancellation', async () => {
        await unlockBond.open();
        await unlockBond.expandPenaltyHistory();
        const row = unlockBond.penaltyHistoryRows.filter({
          has: widgetService.page
            .getByTestId('typeCell')
            .getByText('Cancelled'),
        });
        // history is read from contract events, slow on the fork
        await expect(row).toHaveCount(1, { timeout: RPC_WAIT_TIMEOUT });
        const amount = parseAmount(
          await row.getByTestId('amountCell').textContent(),
        );
        expect(Math.abs(amount - parseFloat(CANCEL_AMOUNT))).toBeLessThan(
          AMOUNT_TOLERANCE,
        );
      });
    });
  },
);
