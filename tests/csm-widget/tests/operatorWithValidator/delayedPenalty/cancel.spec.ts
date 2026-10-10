import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { formatEther } from 'viem';
import { test } from '../../test.fixture';
import {
  AMOUNT_TOLERANCE,
  parseAmount,
  REPORT_GENERAL_DELAYED_PENALTY_ROLE,
} from '../../../consts/delayedPenalty.const';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.delayedPenalty,
    feature: 'Cancel',
    story: 'Form validation',
  }),
  () => {
    let snapshotId: string;
    let noId: number;
    let locked: bigint;

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
        ({ locked } = await csmSDK.operator.getBondBalance(BigInt(noId)));
      });
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.delayedPenaltyPage.cancel.open();
    });

    test(
      qase(577, 'Should list operator with locked bond'),
      async ({ widgetService }) => {
        const { cancel } = widgetService.delayedPenaltyPage;
        const row = cancel.lockedRow(noId);

        await test.step('Operator row is in the table', async () => {
          await expect(row).toHaveCount(1);
        });

        await test.step('Locked amount matches the contract', async () => {
          const amount = parseAmount(
            await row.getByTestId('lockedAmountCell').textContent(),
          );
          expect(
            Math.abs(amount - parseFloat(formatEther(locked))),
          ).toBeLessThan(AMOUNT_TOLERANCE);
        });

        await test.step('Expiry date is shown', async () => {
          await expect(row.getByTestId('expiresCell')).toHaveText(
            /\d{2}\.\d{2}\.\d{4}/,
          );
        });
      },
    );

    test(
      qase(578, 'Should reject amount above locked bond'),
      async ({ widgetService }) => {
        const { cancel } = widgetService.delayedPenaltyPage;

        await test.step('Enter operator and an amount above locked', async () => {
          await cancel.nodeOperatorIdInput.fill(String(noId));
          await cancel.amountInput.fill(
            String(parseFloat(formatEther(locked)) + 1),
          );
        });

        await test.step('Error names the locked bond', async () => {
          await expect(cancel.fieldError('amount')).toHaveText(
            `Entered amount exceeds locked bond of ${formatEther(locked)} ETH`,
          );
          await expect(cancel.submitButton).toBeDisabled();
        });
      },
    );

    test(qase(579, 'Should reject zero amount'), async ({ widgetService }) => {
      const { cancel } = widgetService.delayedPenaltyPage;

      await test.step('Enter 0 as amount', async () => {
        await cancel.nodeOperatorIdInput.fill(String(noId));
        await cancel.amountInput.fill('0');
        await expect(cancel.fieldError('amount')).toHaveText(
          'Enter ETH amount greater than 0',
        );
        await expect(cancel.submitButton).toBeDisabled();
      });
    });

    test(
      qase(580, 'Should fill locked bond with Max'),
      async ({ widgetService }) => {
        const { cancel } = widgetService.delayedPenaltyPage;

        await test.step('Enter operator and click Max', async () => {
          await cancel.nodeOperatorIdInput.fill(String(noId));
          await expect(cancel.maxButton).toBeEnabled();
          await cancel.maxButton.click();
        });

        await test.step('Amount equals locked bond and submit is enabled', async () => {
          expect(parseFloat(await cancel.amountInput.inputValue())).toBeCloseTo(
            parseFloat(formatEther(locked)),
          );
          await expect(cancel.submitButton).toBeEnabled();
        });
      },
    );
  },
);
