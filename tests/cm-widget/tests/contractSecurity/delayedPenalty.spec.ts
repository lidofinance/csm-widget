import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup';
import { contracts } from 'tests/cm-widget/consts/contracts.const';
import { Tags } from 'tests/shared/consts/common.const';
import { DelayedPenaltyCancelPage } from 'tests/shared/pages/delayedPenalty/cancel.page';
import { DelayedPenaltyReportPage } from 'tests/shared/pages/delayedPenalty/report.page';
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

    test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await test.step('Set up: reporter role and a penalty to cancel', async () => {
        await forkActionService.grantRole(
          'REPORT_GENERAL_DELAYED_PENALTY_ROLE',
          PRESETS.FULL_OPERATOR.address,
        );
        await widgetService.dashboardPage.open();
        noId = await widgetService.extractNodeOperatorId();
        await forkActionService.reportPenalty(noId, '0.1');
      });
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test('Should send Report penalty to CuratedModule', async ({
      widgetService,
    }) => {
      const report = new DelayedPenaltyReportPage(widgetService.page);
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

      await test.step('Transaction goes to CuratedModule', async () => {
        await walletPage.assertReceiptAddress(contracts.module);
        await walletPage.cancelTx();
      });
    });

    test('Should send Cancel penalty to CuratedModule', async ({
      widgetService,
    }) => {
      const cancel = new DelayedPenaltyCancelPage(widgetService.page);
      const { walletPage } = widgetService;

      await test.step('Submit the cancellation', async () => {
        await cancel.open();
        await cancel.submit(noId, '0.1');
      });

      await test.step('Transaction goes to CuratedModule', async () => {
        await walletPage.assertReceiptAddress(contracts.module);
        await walletPage.cancelTx();
      });
    });
  },
);
