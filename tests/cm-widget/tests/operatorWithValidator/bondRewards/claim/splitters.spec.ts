import { expect } from '@playwright/test';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../../../test.fixture';
import { mnemonicToAccount } from 'viem/accounts';
import { CLAIM_OPTION } from './claim.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

// 3-address split: 50% + 25% + 25% = 100% (totalShare = PERCENT_BASIS → all rewards split)
const STANDARD_SPLITS = [{ share: '50' }, { share: '25' }, { share: '25' }];

const BOND_EXCESS_ETH = '2';

test.describe(
  'Bond & Rewards. Claim. Splitters.',
  { tag: [Tags.forked, Tags.performTX] },
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeAll(
      async ({ cmSDK, forkActionService, widgetService, secretPhrase }) => {
        snapshotId = await cmSDK.evmSnapshot();

        await widgetService.bondRewardsPage.claim.open();
        noId = await widgetService.extractNodeOperatorId();

        await forkActionService.addBond(noId, BOND_EXCESS_ETH);

        await test.step('Configure 3 splitters via Settings (50% / 25% / 25%)', async () => {
          const splits = STANDARD_SPLITS.map((s, i) => ({
            address: mnemonicToAccount(secretPhrase, { accountIndex: i + 1 })
              .address,
            share: s.share,
          }));
          await widgetService.settingsPage.splitsPage.open();
          await widgetService.settingsPage.splitsPage.clickSetupSplits();
          for (const [i, split] of splits.entries()) {
            await widgetService.settingsPage.splitsPage.addSplit(i, split);
          }
          await widgetService.settingsPage.splitsPage.submitAndConfirm();
        });

        await forkActionService.reportRewards();

        await widgetService.bondRewardsPage.claim.open();
      },
    );

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test(
      qase(334, 'Should show "SPLITTERS ON" chip with tooltip'),
      async ({ widgetService, secretPhrase }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('"SPLITTERS ON" chip is visible', async () => {
          await expect(claim.splittersChip).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await expect(claim.splittersChip).toContainText('SPLITTERS ON');
        });

        await test.step('Chip tooltip shows distribution text and correct addresses', async () => {
          await claim.splittersChipInfoIcon.hover();
          await expect(claim.tooltipWrapper).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await expect(claim.tooltipWrapper).toContainText(
            'When you claim rewards, they will be distributed according to the proportions below.',
          );

          const rows = claim.tooltipWrapper.getByTestId('splittersTooltipRow');
          await expect(rows).toHaveCount(3, { timeout: PAGE_WAIT_TIMEOUT });
          for (const [i, STANDARD_SPLIT] of STANDARD_SPLITS.entries()) {
            const address = mnemonicToAccount(secretPhrase, {
              accountIndex: i + 1,
            }).address;
            const row = rows.nth(i);
            await expect(row).toContainText(address.slice(0, 8));
            await expect(row).toContainText(`${STANDARD_SPLIT.share}%`);
          }
        });
      },
    );

    test(
      qase(
        335,
        'Should show correct labels and descriptions for all claim options',
      ),
      async ({ widgetService }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('"Claim All" option', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.ALL_TO_RA),
          ).toBeEnabled({ timeout: PAGE_WAIT_TIMEOUT });
          await expect(
            claim.getClaimOptionLabel(CLAIM_OPTION.ALL_TO_RA),
          ).toHaveText(
            'Rewards → Splitter addresses, Excess Bond → Rewards Address',
          );
          await expect(
            claim.getClaimOptionDescription(CLAIM_OPTION.ALL_TO_RA),
          ).toHaveText('Split rewards and claim Excess bond');
        });

        await test.step('"Excess Bond" option', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.BOND_TO_RA),
          ).toBeEnabled();
          await expect(
            claim.getClaimOptionLabel(CLAIM_OPTION.BOND_TO_RA),
          ).toHaveText('Excess Bond → Rewards Address');
          await expect(
            claim.getClaimOptionDescription(CLAIM_OPTION.BOND_TO_RA),
          ).toHaveText('Claim only Excess Bond. Rewards remain unclaimed.');
        });

        await test.step('"Rewards to Bond" option', async () => {
          await expect(
            claim.getClaimOptionRadio(CLAIM_OPTION.REWARDS_TO_BOND),
          ).toBeEnabled();
          await expect(
            claim.getClaimOptionLabel(CLAIM_OPTION.REWARDS_TO_BOND),
          ).toHaveText('Rewards → Splitter addresses → Excess bond');
          await expect(
            claim.getClaimOptionDescription(CLAIM_OPTION.REWARDS_TO_BOND),
          ).toHaveText('Split rewards, send remaining to Excess bond');
        });
      },
    );

    test(
      qase(336, 'Should show distribution accordion'),
      async ({ widgetService, cmSDK }) => {
        const { claim } = widgetService.bondRewardsPage;

        await test.step('Select "Claim All" and fill Max stETH', async () => {
          await claim.selectClaimOption(CLAIM_OPTION.ALL_TO_RA);
          await claim.selectBondToken(TOKENS.steth);
          await claim.maxBtn.click();
          await expect(claim.claimButton).toBeEnabled({
            timeout: PAGE_WAIT_TIMEOUT,
          });
        });

        await test.step('Accordion summary shows 3 splitters', async () => {
          await expect(claim.splittersSummary).toBeVisible({
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await expect(claim.splittersSummary).toContainText(
            'Splitter addresses (3) will receive',
          );
        });

        const expectedTotal =
          await test.step('Capture expected total from SDK', async () => {
            const rewards = await cmSDK.getRewards(noId);
            // totalShare = PERCENT_BASIS (100%) → splittableGross ≈ rewards.available
            return parseFloat(rewards.available);
          });

        await test.step('Total splitter amount matches rewards.available', async () => {
          const totalText = await claim.waitForTextContent(
            claim.splittersTotalAmount,
          );
          expect(Math.abs(parseFloat(totalText) - expectedTotal)).toBeLessThan(
            0.0002,
          );
        });

        await test.step('Recipients hidden when collapsed', async () => {
          await expect(claim.splitterRecipient.first()).not.toBeVisible();
        });

        await test.step('Expand → 3 recipients visible with correct amounts', async () => {
          await claim.splittersAccordion.locator('[aria-expanded]').click();
          await expect(claim.splitterRecipient).toHaveCount(3, {
            timeout: PAGE_WAIT_TIMEOUT,
          });

          const shareMultipliers = [0.5, 0.25, 0.25];
          for (let i = 0; i < 3; i++) {
            const row = claim.splitterRecipient.nth(i);
            await expect(row.getByTestId('addressText')).toContainText(/0x/);
            const amountText = await claim.waitForTextContent(
              row.getByTestId('tokenAmount'),
            );
            expect(
              Math.abs(
                parseFloat(amountText) - expectedTotal * shareMultipliers[i],
              ),
            ).toBeLessThan(0.0002);
          }
        });

        await test.step('Collapse → recipients hidden again', async () => {
          await claim.splittersAccordion.locator('[aria-expanded]').click();
          await expect(claim.splitterRecipient.first()).not.toBeVisible();
        });
      },
    );
  },
);
