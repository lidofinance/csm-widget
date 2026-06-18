import { expect } from '@playwright/test';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../../test.fixture';
import { CLAIM_OPTION } from './claim.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  'Bond & Rewards. Claim. Only Rewards.',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await test.step('Set up: report rewards only (no addBond — delta stays 0)', async () => {
        await widgetService.bondRewardsPage.claim.open();
        noId = await widgetService.extractNodeOperatorId();
        // No addBond → delta = 0 (neither excess nor insufficient)
        await forkActionService.reportRewards();
      });

      await widgetService.bondRewardsPage.claim.open();
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test(
      qase(331, 'Should show correct option states and descriptions'),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('"Claim All" option is enabled, checked by default, description reads "Claim Rewards"', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA),
          ).toBeEnabled({ timeout: PAGE_WAIT_TIMEOUT });
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA),
          ).toBeChecked();
          await expect(
            claim.getClaimOptionDescription(CLAIM_OPTION.ALL_TO_RA),
          ).toHaveText('Claim both Excess Bond and Rewards');
        });

        await test.step('"Excess Bond" option is disabled (no excess to claim)', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.BOND_TO_RA),
          ).toBeDisabled();
          await expect(
            claim.getClaimOptionDescription(CLAIM_OPTION.BOND_TO_RA),
          ).toHaveText('Claim only Excess Bond. Rewards remain unclaimed');
        });

        await test.step('"Rewards to Bond" is enabled, not checked, description reads "Move all rewards to the bond" (NOT "Compensate")', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.REWARDS_TO_BOND),
          ).toBeEnabled();
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.REWARDS_TO_BOND),
          ).not.toBeChecked();
          await expect(
            claim.getClaimOptionDescription(CLAIM_OPTION.REWARDS_TO_BOND),
          ).toHaveText(
            'Move all rewards to the bond. Best for uploading more keys',
          );
        });
      },
    );

    test(
      qase(
        332,
        'Should show correct stETH and "will receive" when "Claim All" selected',
      ),
      async ({ widgetService, cmSDK }) => {
        const { claim } = widgetService.bondRewardsPage;
        const rewards = await cmSDK.getRewards(noId);
        const expected = parseFloat(rewards.available);

        await test.step('Select "Claim All" option', async () => {
          await claim.selectClaimOption(CLAIM_OPTION.ALL_TO_RA);
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA),
          ).toBeChecked({ timeout: PAGE_WAIT_TIMEOUT });
        });

        await test.step('stETH token card shows correct rewards amount from SDK', async () => {
          const tokenText = await claim.getBalanceByToken(TOKENS.steth);
          // UI truncates to 4 decimal places; stETH share conversion may shift the 4th decimal by ±1 unit
          expect(Math.abs(parseFloat(tokenText) - expected)).toBeLessThan(
            0.0002,
          );
        });

        await test.step('Fill max amount — claim button becomes enabled', async () => {
          await claim.maxBtn.click();
          await expect(claim.claimButton).toBeEnabled({
            timeout: PAGE_WAIT_TIMEOUT,
          });
        });

        await test.step('"Rewards Address will receive" row shows correct rewards amount', async () => {
          await expect(claim.claimBondFormInfoTitle).toBeVisible();
          await expect(claim.claimBondFormInfoTitle).toContainText(
            'will receive',
          );
          const infoText = await claim.claimBondFormInfoTitle
            .getByTestId('tokenAmount')
            .textContent();
          expect(Math.abs(parseFloat(infoText ?? '0') - expected)).toBeLessThan(
            0.0002,
          );
        });
      },
    );

    test(
      qase(
        333,
        'Should hide token selector and show "Bond will receive" when "Rewards to Bond" selected',
      ),
      async ({ widgetService, cmSDK }) => {
        const { claim } = widgetService.bondRewardsPage;
        const rewards = await cmSDK.getRewards(noId);
        const expected = parseFloat(rewards.available);

        await test.step('Select "Rewards to Bond" option', async () => {
          await claim.selectClaimOption(CLAIM_OPTION.REWARDS_TO_BOND);
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.REWARDS_TO_BOND),
          ).toBeChecked({ timeout: PAGE_WAIT_TIMEOUT });
        });

        await test.step('Token selector and amount input are not visible', async () => {
          await expect(claim.tokenButtons).not.toBeVisible();
          await expect(claim.amountInput).not.toBeVisible();
        });

        await test.step('"Claim rewards to the Bond balance" button is visible and enabled', async () => {
          await expect(claim.claimRewardsToBondButton).toBeVisible();
          await expect(claim.claimRewardsToBondButton).toBeEnabled();
        });

        await test.step('"Bond will receive" row shows correct rewards amount', async () => {
          await expect(claim.claimBondFormInfo).toContainText(
            'Bond will receive',
          );
          const infoText = await claim.claimBondFormInfo
            .getByTestId('tokenAmount')
            .textContent();
          expect(Math.abs(parseFloat(infoText ?? '0') - expected)).toBeLessThan(
            0.0002,
          );
        });
      },
    );
  },
);
