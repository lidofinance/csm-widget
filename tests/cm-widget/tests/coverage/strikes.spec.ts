import { expect } from '@playwright/test';
import { formatEther } from 'viem';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const BOND_EXCESS_ETH = '3';
const PENALTY_ETH = '1';
const ONE_ETH = 1_000_000_000_000_000_000n;
// UI truncates to 4 decimal places (FormatToken default); allow ±1 unit drift
const TOKEN_AMOUNT_TOLERANCE = 0.0002;

// sm-lab Phase B Task 9: proves the in-process penalty recipes
// (reportPenalty/settlePenalty, Task 1/3 wiring) drive the Bond & Rewards
// claim page UI, with amounts cross-checked against the CM SDK.
//
// A real "strikes" tree (Merkle tree of per-key strike counts, pinned to the
// ipfs-mock) is NOT covered here: neither `forkActionService` nor
// `@sm-lab/recipes` expose a way to seed one — the only "strikes" surface in
// the recipes package is a hardcoded `mock-strikes-${refSlot}` sentinel CID
// baked into the FeeOracle report struct by `submitRewards` (see
// `strikesTreeRoot()`/`strikesTreeCid` in the recipes bundle), which pins no
// real leaf data the widget's `StrikesSDK` can read. The CM SDK
// (`LidoSDKCm`) also has no `.strikes` module at all (`StrikesSDK` is
// mounted only on `LidoSDKCsm`), and the Monitoring page's strikes UI
// (`features/monitoring/strikes-section`) ships no `data-testid`s to drive
// a PageObject against. This spec therefore covers what IS available:
// general delayed penalties (reportPenalty/settlePenalty) and the resulting
// locked-bond / debt UI on the claim page.
test.describe(
  'sm-lab penalty coverage: locked bond after reportPenalty',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await test.step('Set up: add excess bond, then report a penalty smaller than the excess', async () => {
        await widgetService.bondRewardsPage.claim.open();
        noId = await widgetService.extractNodeOperatorId();
        await forkActionService.addBond(noId, BOND_EXCESS_ETH);
        await forkActionService.reportPenalty(noId, PENALTY_ETH);
      });

      await widgetService.bondRewardsPage.claim.open();
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test('Should show locked bond amount matching SDK', async ({
      widgetService,
      cmSDK,
    }) => {
      const { claim } = widgetService.bondRewardsPage;
      const bond = await cmSDK.operator.getBondBalance(BigInt(noId));

      await test.step('SDK reports a locked bond from the reported penalty, bond stays sufficient', async () => {
        expect(bond.locked).toBeGreaterThan(0n);
        expect(bond.isInsufficient).toBe(false);
      });

      await test.step('Bond balance card shows "Excess bond" (not insufficient)', async () => {
        await expect(claim.bondBalanceCard).toBeVisible({
          timeout: PAGE_WAIT_TIMEOUT,
        });
        await expect(claim.bondBalanceCard).toContainText('Excess bond');
      });

      await test.step('Locked bond row shows an amount matching the SDK locked bond', async () => {
        await expect(claim.lockedBondRow).toBeVisible();
        await expect(claim.lockedBondRow).toContainText('Locked:');
        await expect(claim.lockedBondRow).toContainText('ETH');

        const lockedText = await claim.lockedBondRow
          .getByTestId('tokenAmount')
          .textContent();
        const expected = parseFloat(formatEther(bond.locked));
        expect(Math.abs(parseFloat(lockedText ?? '0') - expected)).toBeLessThan(
          TOKEN_AMOUNT_TOLERANCE,
        );
      });

      await test.step('Penalty tooltip describes the locked bond', async () => {
        await claim.lockedBondRowInfoIcon.hover();
        await expect(claim.tooltipWrapper).toBeVisible({
          timeout: PAGE_WAIT_TIMEOUT,
        });
        await expect(claim.tooltipWrapper).toContainText(
          'Penalties have been applied to your Node Operator',
        );
      });
    });
  },
);

test.describe(
  'sm-lab penalty coverage: debt after settlePenalty beyond excess bond',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await test.step('Set up: report a penalty beyond current excess, then settle it', async () => {
        await widgetService.bondRewardsPage.claim.open();
        noId = await widgetService.extractNodeOperatorId();
        // delta = 0 in base state → penalty of (delta + 1 ETH) leaves exactly
        // 1 ETH of debt once settled (mirrors nothingToClaim.spec.ts fixture).
        const bondBalance = await cmSDK.operator.getBondBalance(BigInt(noId));
        const penaltyAmount = formatEther(bondBalance.delta + ONE_ETH);
        await forkActionService.reportPenalty(noId, penaltyAmount);
        await forkActionService.settlePenalty(noId);
      });

      await widgetService.bondRewardsPage.claim.open();
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test('Should show debt amount matching SDK', async ({
      widgetService,
      cmSDK,
    }) => {
      const { claim } = widgetService.bondRewardsPage;
      const bond = await cmSDK.operator.getBondBalance(BigInt(noId));

      await test.step('SDK reports an insufficient bond with outstanding debt', async () => {
        expect(bond.isInsufficient).toBe(true);
        expect(bond.debt).toBeGreaterThan(0n);
      });

      await test.step('Bond balance card shows "Insufficient bond"', async () => {
        await expect(claim.bondBalanceCard).toBeVisible({
          timeout: PAGE_WAIT_TIMEOUT,
        });
        await expect(claim.bondBalanceCard).toContainText('Insufficient bond');
      });

      await test.step('Debt row shows an amount matching the SDK debt', async () => {
        await expect(claim.debtBondRow).toBeVisible();
        await expect(claim.debtBondRow).toContainText('Debt:');
        await expect(claim.debtBondRow).toContainText('ETH');

        const debtText = await claim.debtBondRow
          .getByTestId('tokenAmount')
          .textContent();
        const expected = parseFloat(formatEther(bond.debt));
        expect(Math.abs(parseFloat(debtText ?? '0') - expected)).toBeLessThan(
          TOKEN_AMOUNT_TOLERANCE,
        );
      });

      await test.step('Locked bond is fully settled: no locked row shown', async () => {
        expect(bond.locked).toBe(0n);
        await expect(claim.lockedBondRow).not.toBeVisible();
      });
    });
  },
);
