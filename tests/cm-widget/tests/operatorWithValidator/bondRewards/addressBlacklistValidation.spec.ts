import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { Tags } from 'tests/shared/consts/common.const';
import { OFAC_MODAL_TEXT } from 'tests/shared/consts/texts.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { TxModal } from 'tests/cm-widget/pages/elements/common/element.txProgressModal';
import { test } from '../../test.fixture';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const BOND_EXCESS_ETH = '2';

test.describe(
  'Bond & Rewards. Address blacklist validation',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;
    let txModal: TxModal;

    test.beforeAll(
      async ({ useFork, cmSDK, forkActionService, widgetService }) => {
        test.skip(!useFork, 'Test suite runs only on forked network');

        snapshotId = await cmSDK.evmSnapshot();
        txModal = new TxModal(widgetService.page);

        await test.step('Set up: add excess bond and report rewards', async () => {
          await widgetService.bondRewardsPage.claim.open();
          const noId = await widgetService.extractNodeOperatorId();
          await forkActionService.addBond(noId, BOND_EXCESS_ETH);
          await forkActionService.reportRewards();
        });

        await test.step('Mock blacklisted wallet address', async () => {
          await widgetService.mockValidationAddressRequest();
        });
      },
    );

    test.afterAll(async ({ cmSDK, widgetService }) => {
      await widgetService.page.unrouteAll();
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test(
      qase(453, 'Should show access denied modal when bond is added'),
      async ({ widgetService }) => {
        const { addBond } = widgetService.bondRewardsPage;

        await test.step('Open the Add Bond page', async () => {
          await addBond.open();
        });

        await test.step('Choose ETH, fill amount and add bond', async () => {
          await addBond.selectBondToken(TOKENS.eth).click();
          await addBond.amountInput.fill('0.0001');
          await expect(addBond.addBondButton).toBeEnabled();
          await addBond.addBondButton.click();
        });

        await test.step('Access denied modal is shown', async () => {
          await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
        });
      },
    );

    test(
      qase(454, 'Should show access denied modal when bond is claimed'),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('Open the Claim page', async () => {
          await claim.open();
        });

        await test.step('Select stETH, fill max amount and claim', async () => {
          await claim.selectBondToken(TOKENS.steth);
          await claim.maxBtn.click();
          await expect(claim.claimButton).toBeEnabled({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await claim.claimButton.click();
        });

        await test.step('Access denied modal is shown', async () => {
          await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
        });
      },
    );
  },
);
