import { expect } from '@playwright/test';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { Tags } from 'tests/shared/consts/common.const';
import {
  PAGE_WAIT_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
} from 'tests/shared/consts/timeouts';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../../../test.fixture';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  'Bond & Rewards. Claim. Transaction.',
  { tag: [Tags.forked, Tags.performTX] },
  () => {
    let snapshotId: string;
    let matomoEventService: MatomoService;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await test.step('Set up: add excess bond and report rewards', async () => {
        await widgetService.bondRewardsPage.claim.open();
        const noId = await widgetService.extractNodeOperatorId();
        await forkActionService.addBond(noId, '2');
        await forkActionService.reportRewards();
      });
    });

    test.beforeEach(async ({ widgetConfig, widgetService }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.bondRewardsPage.claim.open();
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test('Should claim and send Matomo form events', async ({
      widgetService,
    }) => {
      const { claim } = widgetService.bondRewardsPage;

      await test.step('Select stETH and fill max amount', async () => {
        await claim.selectBondToken(TOKENS.steth);
        await claim.amountInput.fill('0.0005');
        await expect(claim.claimButton).toBeEnabled({
          timeout: PAGE_WAIT_TIMEOUT,
        });
      });

      await test.step('Claim and check Matomo start event', async () => {
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'cm_widget_submit_form_claim_bond_start',
          ),
          claim.claimButton.click(),
        ]);
      });

      await test.step('Confirm transaction and check Matomo success event', async () => {
        await widgetService.page.waitForSelector(
          'text=Confirm this transaction in your wallet',
          { timeout: PAGE_WAIT_TIMEOUT },
        );
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'cm_widget_submit_form_claim_bond_success',
            { timeout: STAGE_WAIT_TIMEOUT },
          ),
          widgetService.walletPage.confirmTx(),
        ]);
      });

      await test.step('Success message is shown', async () => {
        await expect(
          widgetService.page.getByText(
            'Requested amount has been successfully claimed',
          ),
        ).toBeVisible({ timeout: STAGE_WAIT_TIMEOUT });
      });
    });

    test('Should send Matomo events on ETH withdrawal success modal links', async ({
      widgetService,
    }) => {
      const { claim } = widgetService.bondRewardsPage;

      await test.step('Select ETH and fill max amount', async () => {
        await claim.selectBondToken(TOKENS.eth);
        await claim.amountInput.fill('0.0005');
        await expect(claim.requestWithdrawalButton).toBeEnabled({
          timeout: PAGE_WAIT_TIMEOUT,
        });
      });

      await test.step('Request withdrawal and confirm transaction', async () => {
        await claim.requestWithdrawalButton.click();
        await widgetService.page.waitForSelector(
          'text=Confirm this transaction in your wallet',
          { timeout: PAGE_WAIT_TIMEOUT },
        );
        await widgetService.walletPage.confirmTx();
      });

      await test.step('Success modal shows "Withdrawal request has been sent"', async () => {
        await expect(
          widgetService.page.getByText('Withdrawal request has been sent'),
        ).toBeVisible({ timeout: STAGE_WAIT_TIMEOUT });
      });

      await test.step('"Claim tab" link opens Staking Widget and sends Matomo event', async () => {
        await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          matomoEventService.waitForEvent(
            'e_n',
            'cm_widget_claim_withdrawals_link',
          ),
          widgetService.page
            .getByRole('link', { name: 'Claim tab on the Lido Staking Widget' })
            .click(),
        ]);
      });

      await test.step('"This guide" link sends Matomo event', async () => {
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'cm_widget_how_to_claim_eth_success_link',
          ),
          widgetService.page.getByRole('link', { name: 'This guide' }).click(),
        ]);
      });
    });
  },
);
