import { expect } from '@playwright/test';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import {
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

const AMOUNT = '0.5';
// a full 32-byte type, above Number.MAX_SAFE_INTEGER
const PENALTY_TYPE = `0x${'ab'.repeat(32)}`;
const DETAILS = 'e2e delayed penalty';

test.describe(
  ...suite({
    epic: EPIC.delayedPenalty,
    feature: 'Report',
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

      await test.step('Resolve own Node Operator ID', async () => {
        await widgetService.dashboardPage.open();
        noId = await widgetService.extractNodeOperatorId();
      });
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    test('Should report penalty and show it to the operator', async ({
      widgetService,
      csmSDK,
    }) => {
      const { report, cancel, txModal } = widgetService.delayedPenaltyPage;
      const { unlockBond } = widgetService.bondRewardsPage;
      const lockedBefore = (await csmSDK.operator.getBondBalance(BigInt(noId)))
        .locked;

      await test.step('Submit the report form', async () => {
        await report.open();
        await report.submit({
          nodeOperatorId: noId,
          amount: AMOUNT,
          penaltyType: PENALTY_TYPE,
          details: DETAILS,
        });
      });

      await test.step('Sign stage shows operator and amount', async () => {
        await expect(txModal.title).toHaveText(
          'You are reporting delayed penalty',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
        await expect(txModal.description).toContainText(
          `Node Operator ID: ${noId}`,
        );
        await expect(txModal.description).toContainText(AMOUNT);
      });

      await test.step('Confirm transaction and wait for success', async () => {
        await widgetService.walletPage.confirmTx();
        await expect(txModal.title).toHaveText('Delayed penalty is reported', {
          timeout: STAGE_WAIT_TIMEOUT,
        });
        await txModal.closeModal();
      });

      const { locked } = await csmSDK.operator.getBondBalance(BigInt(noId));

      await test.step('Contract recorded the penalty as entered', async () => {
        const reported = (await csmSDK.events.getPenalties(BigInt(noId)))
          .filter((record) => record.type === 'reported')
          .at(-1);
        expect(reported).toMatchObject({
          amount: parseEther(AMOUNT),
          penaltyType: PENALTY_TYPE,
          details: DETAILS,
        });
        expect(locked - lockedBefore).toBeGreaterThanOrEqual(
          parseEther(AMOUNT),
        );
      });

      await test.step('Locked bond tab shows the locked amount', async () => {
        await unlockBond.open();
        const shown = parseAmount(
          await unlockBond.lockedBondAmount.textContent(),
        );
        expect(Math.abs(shown - parseFloat(formatEther(locked)))).toBeLessThan(
          AMOUNT_TOLERANCE,
        );
      });

      await test.step('Penalty History lists the report', async () => {
        await unlockBond.expandPenaltyHistory();
        const row = unlockBond.penaltyHistoryRows.filter({
          hasText: DETAILS,
        });
        // history is read from contract events, slow on the fork
        await expect(row).toHaveCount(1, { timeout: RPC_WAIT_TIMEOUT });
        await expect(row.getByTestId('typeCell')).toHaveText('Penalty');
        const amount = parseAmount(
          await row.getByTestId('amountCell').textContent(),
        );
        expect(Math.abs(amount - parseFloat(AMOUNT))).toBeLessThan(
          AMOUNT_TOLERANCE,
        );
      });

      await test.step('Cancel tab lists the operator with locked bond', async () => {
        await cancel.open();
        const row = cancel.lockedRow(noId);
        await expect(row).toHaveCount(1);
        const amount = parseAmount(
          await row.getByTestId('lockedAmountCell').textContent(),
        );
        expect(Math.abs(amount - parseFloat(formatEther(locked)))).toBeLessThan(
          AMOUNT_TOLERANCE,
        );
      });
    });
  },
);
