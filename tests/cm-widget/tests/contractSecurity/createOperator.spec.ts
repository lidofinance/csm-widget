import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup';
import { contracts } from 'tests/cm-widget/consts/contracts.const';
import { Tags } from 'tests/shared/consts/common.const';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.EMPTY_OPERATOR_WITH_ALL_GATES.secretPhrase });

const ADDRESS = PRESETS.EMPTY_OPERATOR_WITH_ALL_GATES.address;

test.describe(
  ...suite({
    epic: EPIC.security,
    story: 'Contract address. Create operator',
    tag: Tags.contractSecurityCheck,
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ evmNode }) => {
      snapshotId = await evmNode.snapshot();
      await evmNode.setBalance(ADDRESS, 100);
    });

    test.afterAll(async ({ evmNode }) => {
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    (Object.entries(contracts.gates) as [OPERATOR_TYPE, string][]).forEach(
      ([type, gate]) => {
        test(`Should send Create ${type} operator to its curated gate`, async ({
          widgetService,
        }) => {
          const { step1, step2, step3, step4 } =
            widgetService.createNodeOperatorPage;
          const { walletPage } = widgetService;

          await test.step('Go through the creation wizard', async () => {
            await widgetService.createNodeOperatorPage.open();
            await step1.fillForm(type);
            await step2.fillForm(ADDRESS, ADDRESS);
            await step3.fillForm('Contract check', 'Contract address check');
            await step4.createButton.click();
          });

          await test.step('Transaction goes to the curated gate', async () => {
            await walletPage.assertReceiptAddress(gate);
            await walletPage.cancelTx();
          });
        });
      },
    );
  },
);
