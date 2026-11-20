import { qase } from 'playwright-qase-reporter/playwright';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { contracts } from 'tests/csm-widget/consts/contracts.const';
import { getPendingRequestMethod } from 'tests/shared/helpers/walletRequest';
import { Tags } from 'tests/shared/consts/common.const';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.EMPTY_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.security,
    feature: 'Contract address',
    story: 'Operator type',
    tag: Tags.contractSecurityCheck,
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ csmSDK, forkActionService }) => {
      snapshotId = await csmSDK.evmSnapshot();

      await test.step('Set up: issue ICS and IDVTC to the owner', async () => {
        await forkActionService.setGateAddrs(
          ['ics', 'idvtc'],
          PRESETS.EMPTY_OPERATOR.address,
        );
      });
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    test(
      qase(768, 'Should send Claim ICS type to ICS gate'),
      async ({ widgetService }) => {
        const { claimIcs } = widgetService.operatorType;
        const { walletPage } = widgetService;

        await test.step('Submit the claim', async () => {
          await claimIcs.open();
          await claimIcs.claimButton.click();
          await claimIcs.confirmContinueButton.click();
        });

        await test.step('Transaction goes to ICS gate', async () => {
          await walletPage.assertReceiptAddress(contracts.csm.icsGate);
          await walletPage.cancelTx();
        });
      },
    );

    test(
      qase(769, 'Should send Claim IDVTC type to IDVTC gate'),
      async ({ widgetService }) => {
        const { claimIdvtc } = widgetService.operatorType;
        const { walletPage } = widgetService;

        await test.step('Submit the claim', async () => {
          await claimIdvtc.open();
          await claimIdvtc.claimButton.click();
          await claimIdvtc.confirmContinueButton.click();
        });

        await test.step('Sign the cluster setup message if asked', async () => {
          if ((await getPendingRequestMethod(walletPage)) === 'personal_sign') {
            await walletPage.confirmTx();
          }
        });

        await test.step('Transaction goes to IDVTC gate', async () => {
          await walletPage.assertReceiptAddress(contracts.csm.idvtcGate);
          await walletPage.cancelTx();
        });
      },
    );
  },
);
