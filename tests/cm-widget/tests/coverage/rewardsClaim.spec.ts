import { expect } from '@playwright/test';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { Tags } from 'tests/shared/consts/common.const';
import {
  PAGE_WAIT_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
} from 'tests/shared/consts/timeouts';
import { TxModal } from 'tests/cm-widget/pages/elements/common/element.txProgressModal';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';
import { test } from '../test.fixture';
import { CLAIM_OPTION } from '../operatorWithValidator/bondRewards/claim/claim.const';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

// sm-lab Phase B Task 8: proves a rewards tree built + pinned to the real
// ipfs-mock (Task 6/7 — no more Phase A `fork-*` sentinel CID) flows all the
// way through the claim UI: SDK-reported amount, claim button, and a real
// claim transaction against the freshly pinned tree.
test.describe(
  'sm-lab rewards claim against a pinned rewards tree',
  { tag: [Tags.forked, Tags.performTX] },
  () => {
    let snapshotId: string;
    let noId: number;
    let txModal: TxModal;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();
      txModal = new TxModal(widgetService.page);

      await test.step('Set up: report rewards on a freshly pinned tree', async () => {
        await widgetService.bondRewardsPage.claim.open();
        noId = await widgetService.extractNodeOperatorId();
        // No addBond → delta stays 0, so "Claim All" carries only rewards.
        const report = await forkActionService.reportRewards();
        expect(report.treeCid).toBeTruthy();
        expect(report.treeCid).not.toMatch(/^fork-/);
      });

      // Reopen so the widget reflects the newly reported rewards frame.
      await widgetService.bondRewardsPage.claim.open();
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test('Should claim rewards reported on the pinned tree', async ({
      widgetService,
      cmSDK,
    }) => {
      const { claim } = widgetService.bondRewardsPage;
      const rewards = await cmSDK.getRewards(noId);
      const expected = parseFloat(rewards.available);

      await test.step('SDK reports a non-zero claimable amount from the pinned tree', async () => {
        expect(expected).toBeGreaterThan(0);
      });

      await test.step('"Claim All" is selected by default and stETH card matches SDK amount', async () => {
        await expect(
          claim.getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA),
        ).toBeChecked({ timeout: PAGE_WAIT_TIMEOUT });

        const tokenText = await claim.getBalanceByToken(TOKENS.steth);
        // UI truncates to 4 decimal places; stETH share conversion may shift the 4th decimal by ±1 unit
        expect(Math.abs(parseFloat(tokenText) - expected)).toBeLessThan(0.0002);
      });

      await test.step('Select stETH and fill max amount', async () => {
        await claim.selectBondToken(TOKENS.steth);
        await claim.maxBtn.click();
        await expect(claim.claimButton).toBeEnabled({
          timeout: PAGE_WAIT_TIMEOUT,
        });
      });

      await test.step('"Rewards Address will receive" shows the SDK amount', async () => {
        await expect(claim.claimBondFormInfoTitle).toContainText(
          'will receive',
        );
        const infoText = await claim.willReceiveAmount.textContent();
        expect(Math.abs(parseFloat(infoText ?? '0') - expected)).toBeLessThan(
          0.0002,
        );
      });

      await test.step('Claim and confirm the transaction', async () => {
        await claim.claimButton.click();
        await widgetService.page.waitForSelector(
          'text=Confirm this transaction in your wallet',
          { timeout: PAGE_WAIT_TIMEOUT },
        );
        await widgetService.walletPage.confirmTx();
      });

      await test.step('Success modal confirms the claim went through', async () => {
        await expect(txModal.title).toHaveText(
          'Requested amount has been successfully claimed',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
      });
    });
  },
);
