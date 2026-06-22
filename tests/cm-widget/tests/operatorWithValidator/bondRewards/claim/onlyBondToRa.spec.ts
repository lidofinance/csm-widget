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
  'Bond & Rewards. Claim. Only Excess Bond.',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await test.step('Set up: add excess bond (no rewards)', async () => {
        await widgetService.bondRewardsPage.claim.open();
        noId = await widgetService.extractNodeOperatorId();
        await forkActionService.addBond(noId, BOND_EXCESS_ETH);
      });

      await widgetService.bondRewardsPage.claim.open();
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test(
      qase(326, 'Should auto-select "Excess Bond" and disable other options'),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('"Excess Bond" is enabled and auto-selected', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.BOND_TO_RA),
          ).toBeEnabled({ timeout: PAGE_WAIT_TIMEOUT });
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.BOND_TO_RA),
          ).toBeChecked();
          await expect(
            claim.getClaimOptionDescription(CLAIM_OPTION.BOND_TO_RA),
          ).toHaveText('Claim only Excess Bond. Rewards remain unclaimed.');
        });

        await test.step('"Claim All" is disabled and unchecked', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA),
          ).toBeDisabled();
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA),
          ).not.toBeChecked();
          await expect(
            claim.getClaimOptionDescription(CLAIM_OPTION.ALL_TO_RA),
          ).toHaveText('Claim both Excess Bond and Rewards');
        });

        await test.step('"Rewards to Bond" is disabled and unchecked', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.REWARDS_TO_BOND),
          ).toBeDisabled();
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.REWARDS_TO_BOND),
          ).not.toBeChecked();
          await expect(
            claim.getClaimOptionDescription(CLAIM_OPTION.REWARDS_TO_BOND),
          ).toHaveText(
            'Move all rewards to the bond. Best for uploading more keys.',
          );
        });
      },
    );

    test(
      qase(
        327,
        'Should show correct stETH and "will receive" when "Excess Bond" selected',
      ),
      async ({ widgetService, cmSDK }) => {
        const { claim } = widgetService.bondRewardsPage;
        const bondBalance = await cmSDK.operator.getBondBalance(BigInt(noId));
        const expected = parseFloat(formatEther(bondBalance.delta));

        await test.step('"Excess Bond" is checked by default', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.BOND_TO_RA),
          ).toBeChecked({ timeout: PAGE_WAIT_TIMEOUT });
        });

        await test.step('stETH token card shows correct SDK amount', async () => {
          const tokenText = await claim.getBalanceByToken(TOKENS.steth);
          // UI truncates to 4 decimal places; stETH share conversion may shift the 4th decimal by ±1 unit
          expect(Math.abs(parseFloat(tokenText) - expected)).toBeLessThan(
            0.0002,
          );
        });

        await test.step('Max fills amount and enables claim button', async () => {
          await claim.maxBtn.click();
          await expect(claim.claimButton).toBeEnabled({
            timeout: PAGE_WAIT_TIMEOUT,
          });
        });

        await test.step('"will receive" row shows correct SDK amount', async () => {
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
  },
);
