import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup';
import { contracts } from 'tests/cm-widget/consts/contracts.const';
import { Tags } from 'tests/shared/consts/common.const';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const PERMIT_TOKEN = {
  [TOKENS.steth]: contracts.stETH,
  [TOKENS.wsteth]: contracts.wstETH,
};

test.describe(
  ...suite({
    epic: EPIC.security,
    feature: 'Contract address',
    story: 'Bond & Rewards',
    tag: Tags.contractSecurityCheck,
  }),
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await test.step('Set up: tokens and excess bond to claim', async () => {
        await widgetService.bondRewardsPage.addBond.open();
        noId = await widgetService.extractNodeOperatorId();
        await forkActionService.fundTokens(PRESETS.FULL_OPERATOR.address, '1');
        await forkActionService.addBond(noId, '2');
      });
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    [TOKENS.eth, TOKENS.steth, TOKENS.wsteth].forEach((token) => {
      test(`Should send Add bond ${token} to Accounting`, async ({
        widgetService,
      }) => {
        const { addBond } = widgetService.bondRewardsPage;
        const { walletPage } = widgetService;

        await test.step(`Submit ${token} bond`, async () => {
          await addBond.open();
          await addBond.selectBondToken(token).click();
          await addBond.amountInput.fill('0.0003');
          await addBond.addBondButton.click();
          await widgetService.confirmOperatorModal.confirm();
        });

        if (token !== TOKENS.eth) {
          await test.step(`Permit is signed for ${token}`, async () => {
            await walletPage.assertReceiptAddress(PERMIT_TOKEN[token]);
            await walletPage.confirmTx();
          });
        }

        await test.step('Transaction goes to Accounting', async () => {
          await walletPage.assertReceiptAddress(contracts.accounting);
          await walletPage.cancelTx();
        });
      });
    });

    [TOKENS.eth, TOKENS.steth, TOKENS.wsteth].forEach((token) => {
      test(`Should send Claim ${token} to Accounting`, async ({
        widgetService,
      }) => {
        const { claim } = widgetService.bondRewardsPage;
        const { walletPage } = widgetService;

        await test.step(`Submit ${token} claim`, async () => {
          await claim.open();
          await claim.selectBondToken(token);
          await claim.amountInput.fill('0.0003');
          await (
            token === TOKENS.eth
              ? claim.requestWithdrawalButton
              : claim.claimButton
          ).click();
        });

        await test.step('Transaction goes to Accounting', async () => {
          await walletPage.assertReceiptAddress(contracts.accounting);
          await walletPage.cancelTx();
        });
      });
    });

    test('Should send Compensate locked bond to CuratedModule', async ({
      widgetService,
      forkActionService,
    }) => {
      const { page, walletPage } = widgetService;

      await test.step('Set up: lock bond with a penalty', async () => {
        await forkActionService.reportPenalty(noId, '0.1');
      });

      await test.step('Submit compensation', async () => {
        await page.goto('/bond/unlock');
        await page
          .getByRole('button', { name: 'Compensate locked bond' })
          .click();
      });

      await test.step('Transaction goes to CuratedModule', async () => {
        await walletPage.assertReceiptAddress(contracts.module);
        await walletPage.cancelTx();
      });
    });
  },
);
