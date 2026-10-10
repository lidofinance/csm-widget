import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { test } from '../../test.fixture';
import { REPORT_GENERAL_DELAYED_PENALTY_ROLE } from '../../../consts/delayedPenalty.const';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const INVALID_PENALTY_TYPES = [
  { value: '123', error: 'Should start with "0x"' },
  { value: '0X1', error: 'Should start with "0x"' },
  { value: '0xzz', error: 'Is not hexadecimal string' },
  { value: `0x${'1'.repeat(65)}`, error: 'Should be at most 32 bytes' },
  { value: '0x0', error: 'Penalty type should not be zero' },
  { value: `0x${'0'.repeat(64)}`, error: 'Penalty type should not be zero' },
];

const VALID_PENALTY_TYPES = ['0x1', '0xABCdef', `0x${'f'.repeat(64)}`];

test.describe(
  ...suite({
    epic: EPIC.delayedPenalty,
    feature: 'Report',
    story: 'Form validation',
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

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.delayedPenaltyPage.report.open();
    });

    test(qase(582, 'Should show empty form'), async ({ widgetService }) => {
      const { report } = widgetService.delayedPenaltyPage;

      await test.step('Form titles are shown', async () => {
        for (const title of [
          'Specify Node Operator',
          'Enter penalty amount',
          'Enter Penalty Type',
          'Enter Details',
        ]) {
          await expect(report.form).toContainText(title);
        }
      });

      await test.step('All inputs are empty', async () => {
        await expect(report.nodeOperatorIdInput).toHaveValue('');
        await expect(report.amountInput).toHaveValue('');
        await expect(report.penaltyTypeInput).toHaveValue('');
        await expect(report.detailsInput).toHaveValue('');
      });

      await test.step('Submit of the empty form starts no transaction', async () => {
        await report.submitButton.click();
        await expect(
          widgetService.delayedPenaltyPage.txModal.modal,
        ).toBeHidden();
      });
    });

    test('Should reject invalid Node Operator ID', async ({
      widgetService,
      csmSDK,
    }) => {
      test.fail(true, 'issue - CS-1233');

      const { report } = widgetService.delayedPenaltyPage;
      const count = await csmSDK.module.getOperatorsCount();

      await test.step('ID above the last operator', async () => {
        await report.nodeOperatorIdInput.fill(String(count + 10n));
        await expect(report.fieldError('nodeOperatorId')).toHaveText(
          `Max Node Operator ID is ${count - 1n}`,
        );
        await expect(report.submitButton).toBeDisabled();
      });

      await test.step('Non-numeric ID', async () => {
        await report.nodeOperatorIdInput.fill('abc');
        await expect(report.fieldError('nodeOperatorId')).toHaveText(
          'Invalid ID',
        );
        await expect(report.submitButton).toBeDisabled();
      });
    });

    test(qase(583, 'Should reject zero amount'), async ({ widgetService }) => {
      const { report } = widgetService.delayedPenaltyPage;

      await test.step('Enter 0 as amount', async () => {
        await report.amountInput.fill('0');
        await expect(report.fieldError('amount')).toHaveText(
          'Enter amount greater than 0',
        );
        await expect(report.submitButton).toBeDisabled();
      });
    });

    test(
      qase(584, 'Should reject invalid penalty type'),
      async ({ widgetService }) => {
        const { report } = widgetService.delayedPenaltyPage;

        for (const { value, error } of INVALID_PENALTY_TYPES) {
          await test.step(`"${value}" → "${error}"`, async () => {
            await report.penaltyTypeInput.fill(value);
            await expect(report.fieldError('penaltyType')).toHaveText(error);
            await expect(report.submitButton).toBeDisabled();
          });
        }
      },
    );

    test(
      qase(585, 'Should accept hex penalty type up to 32 bytes'),
      async ({ widgetService }) => {
        const { report } = widgetService.delayedPenaltyPage;

        await test.step('Fill the other fields with valid values', async () => {
          await report.nodeOperatorIdInput.fill(String(noId));
          await report.amountInput.fill('0.1');
        });

        for (const value of VALID_PENALTY_TYPES) {
          await test.step(`"${value}" is accepted`, async () => {
            await report.penaltyTypeInput.fill(value);
            await expect(report.fieldError('penaltyType')).toBeHidden();
            await expect(report.submitButton).toBeEnabled();
          });
        }
      },
    );

    test(
      qase(586, 'Should reject details longer than 256 chars'),
      async ({ widgetService }) => {
        const { report } = widgetService.delayedPenaltyPage;

        await test.step('256 chars are accepted', async () => {
          await report.detailsInput.fill('a'.repeat(256));
          await expect(report.fieldError('details')).toBeHidden();
        });

        await test.step('257 chars are rejected', async () => {
          await report.detailsInput.fill('a'.repeat(257));
          await expect(report.fieldError('details')).toHaveText(
            'Is too long, maximum is 256',
          );
          await expect(report.submitButton).toBeDisabled();
        });
      },
    );
  },
);
