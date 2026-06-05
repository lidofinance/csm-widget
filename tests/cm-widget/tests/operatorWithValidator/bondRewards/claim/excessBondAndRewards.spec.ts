import { expect } from '@playwright/test';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../../test.fixture';
import { formatEther } from 'viem';
import { CLAIM_OPTION } from './claim.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const BOND_EXCESS_ETH = '2';

test.describe(
  'Bond & Rewards. Claim. Excess bond and rewards.',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(
      async ({ useFork, cmSDK, forkActionService, widgetService }) => {
        test.skip(!useFork, 'Test suite runs only on forked network');

        snapshotId = await cmSDK.evmSnapshot();

        await test.step('Set up: add excess bond and report rewards', async () => {
          await widgetService.bondRewardsPage.claim.open();
          noId = await widgetService.extractNodeOperatorId();
          await forkActionService.addBond(noId, BOND_EXCESS_ETH);
          await forkActionService.reportRewards();
        });

        await widgetService.bondRewardsPage.claim.open();
      },
    );

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test(
      qase(315, 'Should show SDK amounts on balance cards'),
      async ({ widgetService, cmSDK }) => {
        const { claim } = widgetService.bondRewardsPage;
        const [bondBalance, rewards] = await Promise.all([
          cmSDK.operator.getBondBalance(BigInt(noId)),
          cmSDK.getRewards(noId),
        ]);
        const expectedRewards = parseFloat(rewards.available);
        const expectedBond = parseFloat(formatEther(bondBalance.delta));

        await test.step('Rewards balance card shows correct stETH amount from SDK', async () => {
          await expect(claim.rewardsBalanceCard).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          const text = await claim.rewardsBalanceCard
            .getByTestId('tokenAmount')
            .textContent();
          // balance cards display 1 decimal place (e.g. "5.1"), so tolerance accounts for rounding
          expect(
            Math.abs(parseFloat(text ?? '0') - expectedRewards),
          ).toBeLessThan(0.1);
        });

        await test.step('Bond balance card shows "Excess bond" title and correct stETH amount from SDK', async () => {
          await expect(claim.bondBalanceCard).toBeVisible();
          await expect(claim.bondBalanceCard).toContainText('Excess bond');
          const text = await claim.bondBalanceCard
            .getByTestId('tokenAmount')
            .textContent();
          // balance cards display 1 decimal place (e.g. "5.1"), so tolerance accounts for rounding
          expect(Math.abs(parseFloat(text ?? '0') - expectedBond)).toBeLessThan(
            0.1,
          );
        });
      },
    );

    test(
      qase(314, 'Should enable all 3 options with correct descriptions'),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('"Claim All" option is enabled, checked by default, description reads "Claim both Excess Bond and Rewards"', async () => {
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

        await test.step('"Excess Bond" option is enabled, not checked, description reads "Claim only Excess Bond. Rewards remain unclaimed"', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.BOND_TO_RA),
          ).toBeEnabled();
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.BOND_TO_RA),
          ).not.toBeChecked();
          await expect(
            claim.getClaimOptionDescription(CLAIM_OPTION.BOND_TO_RA),
          ).toHaveText('Claim only Excess Bond. Rewards remain unclaimed');
        });

        await test.step('"Rewards to Bond" option is enabled, not checked, description reads "Move all rewards to the bond"', async () => {
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
        316,
        'Should show correct stETH and "will receive" when "Claim All" selected',
      ),
      async ({ widgetService, cmSDK }) => {
        const { claim } = widgetService.bondRewardsPage;
        const noId = await widgetService.extractNodeOperatorId();
        const [bondBalance, rewards] = await Promise.all([
          cmSDK.operator.getBondBalance(BigInt(noId)),
          cmSDK.getRewards(noId),
        ]);
        const expected = parseFloat(
          (
            parseFloat(formatEther(bondBalance.delta)) +
            parseFloat(rewards.available)
          ).toString(),
        );

        await test.step('Select "Claim All" option', async () => {
          await claim.selectClaimOption(CLAIM_OPTION.ALL_TO_RA);
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA),
          ).toBeChecked({ timeout: PAGE_WAIT_TIMEOUT });
        });

        await test.step('stETH token card shows correct amount from SDK', async () => {
          const tokenText = await claim.getBalanceByToken(TOKENS.steth);
          // UI truncates to 4 decimal places; stETH share conversion may shift the 4th decimal by ±1 unit
          expect(Math.abs(parseFloat(tokenText) - expected)).toBeLessThan(
            0.0002,
          );
        });

        await test.step('Before filling amount — "Excess bond will increase by" row is shown', async () => {
          await expect(claim.claimBondFormInfo).toContainText(
            'Excess bond will increase by',
          );
        });

        await test.step('Fill max amount — claim button becomes enabled', async () => {
          await claim.maxBtn.click();
          await expect(claim.claimButton).toBeEnabled({
            timeout: PAGE_WAIT_TIMEOUT,
          });
        });

        await test.step('After filling max amount — "Excess bond will decrease by" row is shown', async () => {
          await expect(claim.claimBondFormInfo).toContainText(
            'Excess bond will decrease by',
          );
          await expect(claim.claimBondFormInfo).not.toContainText(
            'Excess bond will increase by',
          );
        });

        await test.step('"Rewards Address will receive" row shows correct stETH amount', async () => {
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
        317,
        'Should show correct stETH and "will receive" when "Excess Bond" selected',
      ),
      async ({ widgetService, cmSDK }) => {
        const { claim } = widgetService.bondRewardsPage;
        const noId = await widgetService.extractNodeOperatorId();
        const bondBalance = await cmSDK.operator.getBondBalance(BigInt(noId));
        const expected = parseFloat(formatEther(bondBalance.delta));

        await test.step('Select "Excess Bond" option', async () => {
          await claim.selectClaimOption(CLAIM_OPTION.BOND_TO_RA);
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.BOND_TO_RA),
          ).toBeChecked({ timeout: PAGE_WAIT_TIMEOUT });
        });

        await test.step('stETH token card shows correct amount from SDK', async () => {
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

        await test.step('"Rewards Address will receive" row shows correct stETH amount', async () => {
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
        318,
        'Should hide token selector and show "Bond will receive" when "Rewards to Bond" selected',
      ),
      async ({ widgetService, cmSDK }) => {
        const { claim } = widgetService.bondRewardsPage;
        const noId = await widgetService.extractNodeOperatorId();
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
