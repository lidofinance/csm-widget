import { expect } from '@playwright/test';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { Tags } from 'tests/shared/consts/common.const';
import {
  PAGE_WAIT_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
} from 'tests/shared/consts/timeouts';
import {
  checkExternalMatomoLink,
  checkInternalMatomoLink,
  escapeRegex,
  fullUrlPattern,
} from 'tests/shared/helpers/matomoLinks';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../../test.fixture';

const CLAIM_AMOUNT = '0.0005';
const HOW_TO_CLAIM_ANCHOR = '#how-to-claim-eth-using-a-withdrawal-nft';

test.describe(
  'Bond & Rewards. Claim. Transaction.',
  { tag: [Tags.forked, Tags.performTX] },
  () => {
    let snapshotId: string;
    let matomoEventService: MatomoService;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeAll(async ({ csmSDK, forkActionService, widgetService }) => {
      snapshotId = await csmSDK.evmSnapshot();

      await test.step('Set up: add excess bond', async () => {
        await widgetService.bondRewardsPage.claim.open();
        const noId = await widgetService.extractNodeOperatorId();
        await forkActionService.addBond(noId, '2');
      });
    });

    test.beforeEach(async ({ widgetConfig, widgetService }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.bondRewardsPage.claim.open();
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    test('Should send Matomo events on ETH withdrawal success modal links', async ({
      widgetService,
      widgetConfig,
    }) => {
      const { claim } = widgetService.bondRewardsPage;
      const claimTabUrl = `${widgetConfig.standConfig.stakeWidgetUrl}/withdrawals/claim`;
      const widgetUrl = widgetConfig.standConfig.standUrl.replace(/\/+$/, '');
      const claimPageUrl = `${widgetUrl}/bond/claim`;

      await test.step('Request withdrawal in ETH', async () => {
        await claim.selectBondToken(TOKENS.eth);
        await claim.amountInput.fill(CLAIM_AMOUNT);
        await expect(claim.requestWithdrawalButton).toBeEnabled({
          timeout: PAGE_WAIT_TIMEOUT,
        });
        await claim.requestWithdrawalButton.click();
        await widgetService.page.waitForSelector(
          'text=Confirm this transaction in your wallet',
          { timeout: PAGE_WAIT_TIMEOUT },
        );
        await widgetService.walletPage.confirmTx();
      });

      await test.step('Success modal shows both links', async () => {
        await expect(claim.txModal.title).toContainText(
          'Withdrawal request has been sent',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
        await expect(claim.claimWithdrawalsLink).toHaveAttribute(
          'href',
          claimTabUrl,
        );
        await expect(claim.howToClaimEthGuideLink).toBeVisible();
      });

      await checkExternalMatomoLink(widgetService.page, matomoEventService, {
        name: 'Claim tab on the Lido Staking Widget',
        link: claim.claimWithdrawalsLink,
        event: 'csm_widget_claim_withdrawals_link',
        url: fullUrlPattern(claimTabUrl),
      });

      await checkInternalMatomoLink(widgetService.page, matomoEventService, {
        name: 'This guide',
        link: claim.howToClaimEthGuideLink,
        event: 'csm_widget_how_to_claim_eth_success_link',
        url: new RegExp(
          `^${escapeRegex(claimPageUrl)}(?:\\?[^#]*)?${escapeRegex(HOW_TO_CLAIM_ANCHOR)}$`,
          'i',
        ),
      });

      await expect(claim.txModal.modal).toBeHidden();
    });
  },
);
