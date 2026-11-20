import { qase } from 'playwright-qase-reporter/playwright';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { contracts } from 'tests/csm-widget/consts/contracts.const';
import { REPORT_GENERAL_DELAYED_PENALTY_ROLE } from 'tests/csm-widget/consts/delayedPenalty.const';
import { Tags } from 'tests/shared/consts/common.const';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.security,
    feature: 'Contract address',
    story: 'Delayed penalty',
    tag: Tags.contractSecurityCheck,
  }),
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(async ({ csmSDK, forkActionService, widgetService }) => {
      snapshotId = await csmSDK.evmSnapshot();

      await test.step('Set up: reporter role and a penalty to cancel', async () => {
        await forkActionService.grantRole(
          REPORT_GENERAL_DELAYED_PENALTY_ROLE,
          PRESETS.FULL_OPERATOR.address,
        );
        await widgetService.dashboardPage.open();
        noId = await widgetService.extractNodeOperatorId();
        await forkActionService.reportPenalty(noId, '0.1');
      });
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    test(
      qase(742, 'Should send Report penalty to CSModule'),
      async ({ widgetService }) => {
        const { report } = widgetService.delayedPenaltyPage;
        const { walletPage } = widgetService;

        await test.step('Submit the report', async () => {
          await report.open();
          await report.submit({
            nodeOperatorId: noId,
            amount: '0.1',
            penaltyType: `0x${'ab'.repeat(32)}`,
            details: 'contract address check',
          });
        });

        await test.step('Transaction goes to CSModule', async () => {
          await walletPage.assertReceiptAddress(contracts.csm.module);
          await walletPage.cancelTx();
        });
      },
    );

    test(
      qase(743, 'Should send Cancel penalty to CSModule'),
      async ({ widgetService }) => {
        const { cancel } = widgetService.delayedPenaltyPage;
        const { walletPage } = widgetService;

        await test.step('Submit the cancellation', async () => {
          await cancel.open();
          await cancel.submit(noId, '0.1');
        });

        await test.step('Transaction goes to CSModule', async () => {
          await walletPage.assertReceiptAddress(contracts.csm.module);
          await walletPage.cancelTx();
        });
      },
    );
  },
);
