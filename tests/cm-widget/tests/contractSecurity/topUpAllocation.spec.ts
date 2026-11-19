import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup';
import { contracts } from 'tests/cm-widget/consts/contracts.const';
import { Tags } from 'tests/shared/consts/common.const';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.security,
    feature: 'Contract address',
    story: 'Top-up allocation',
    tag: Tags.contractSecurityCheck,
  }),
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await test.step('Set up: enabler role for the wallet', async () => {
        await forkActionService.grantRole(
          'ENABLE_TOP_UP_ALLOCATION_ROLE',
          PRESETS.FULL_OPERATOR.address,
        );
        await widgetService.dashboardPage.open();
        noId = await widgetService.extractNodeOperatorId();
      });
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test('Should send Enable top-up allocation to CuratedModule', async ({
      widgetService,
    }) => {
      const { page, walletPage } = widgetService;

      await test.step('Submit the operator to enable', async () => {
        await page.goto('/top-up-allocation');
        await page.locator('input[name="nodeOperatorId"]').fill(String(noId));
        await page
          .getByRole('button', { name: 'Enable top-up allocation' })
          .click();
      });

      await test.step('Transaction goes to CuratedModule', async () => {
        await walletPage.assertReceiptAddress(contracts.module);
        await walletPage.cancelTx();
      });
    });

    test('Should send Disable top-ups to CuratedModule', async ({
      widgetService,
      forkActionService,
    }) => {
      const { page, walletPage } = widgetService;

      await test.step('Set up: enable top-ups for the operator', async () => {
        await forkActionService.enableTopUpAllocation(noId);
      });

      await test.step('Switch top-ups off', async () => {
        await page.goto('/settings/general');
        await page.getByRole('switch').click();
        await page
          .getByRole('button', { name: 'Confirm', exact: true })
          .click();
      });

      await test.step('Transaction goes to CuratedModule', async () => {
        await walletPage.assertReceiptAddress(contracts.module);
        await walletPage.cancelTx();
      });
    });
  },
);
