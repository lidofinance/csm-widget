# Claim Bond — Flows, Math & UI Mapping

End-to-end developer reference for the claim-bond feature: what happens on-chain, what the SDK exposes, and how the UI maps onto both.

---

## 1. On-chain entry points (`Accounting.sol`)

Three external claim methods plus a no-payout variant, all gated by `whenResumed` and `_checkAndGetEligibleNodeOperatorProperties` (manager / reward / custom claimer):

| Function                                                                    | Token paid out           | Returns         |
| --------------------------------------------------------------------------- | ------------------------ | --------------- |
| `claimRewardsStETH(noId, stETHAmount, cumulativeFeeShares, rewardsProof)`   | stETH (`transferShares`) | `claimedShares` |
| `claimRewardsWstETH(noId, wstETHAmount, cumulativeFeeShares, rewardsProof)` | wstETH (wrap → transfer) | `claimedWstETH` |
| `claimRewardsUnstETH(noId, stETHAmount, cumulativeFeeShares, rewardsProof)` | unstETH NFT (WQ request) | `requestId`     |
| `pullAndSplitFeeRewards(noId, cumulativeFeeShares, rewardsProof)`           | (no payout, just settle) | –               |

Body of each claim:

```solidity
uint256 claimableShares = _pullAndSplitFeeRewards(noId, cumulativeFeeShares, rewardsProof);
if (amount != 0 && claimableShares != 0) {
    BondCore._claim*(noId, amount, claimableShares, no.rewardAddress);
}
MODULE.updateDepositableValidatorsCount(noId);
```

The order is **always**: pull rewards (optional) → cover debt → splitter payout → user payout from what remains. `amount = 0` skips the user-payout step (effectively `pullAndSplitFeeRewards`).

### `_pullAndSplitFeeRewards` ([Accounting.sol:460](../../../../../community-staking-module/src/Accounting.sol))

```text
hasSplits = FeeSplits.hasSplits(noId)

# Step A — pull rewards (only if a proof is passed)
if rewardsProof.length != 0:
    distributed = FEE_DISTRIBUTOR.distributeFees(noId, cumFeeShares, proof)   # in shares
    if distributed != 0:
        BondCore._creditBondShares(noId, distributed)         # bond += distributed, then _coverBondDebt
        if hasSplits:
            FeeSplits._increasePendingSharesToSplit(noId, distributed)

# Step B — recompute claimable from post-credit/post-debt state
claimableShares = saturatingSub(currentShares, forKeysShares + lockedShares + debtShares)

# Step C — splitter payout (runs even when proof was empty)
if hasSplits && claimableShares != 0:
    splittableShares = min(claimableShares, pendingToSplit)
    transfers        = FeeSplits.getFeeSplitTransfers(noId, splittableShares)   # share-weighted
    transferredShares = Σ transfers[i].shares                                   # ≤ splittableShares
    LIDO.transferShares(recipient, shares) for each transfer
    FeeSplits._decreasePendingSharesToSplit(noId, splittableShares)             # decrement by base, not transferred
    BondCore._unsafeReduceBond(noId, transferredShares)
    claimableShares -= transferredShares                                        # returned to caller

return claimableShares
```

`_creditBondShares` ([BondCore.sol:106](../../../../../community-staking-module/src/abstract/BondCore.sol)) auto-calls `_coverBondDebt`, which burns up to `min(debt, currentShares)` from bond before claimable is computed. After Step A:

```text
claimableShares == saturatingSub(currentShares_before + distributed, forKeys + locked + debt_before)
```

### `BondCore._claim*` (user payout)

```text
sharesToClaim = min(_sharesByEth(amount), claimableShares)   # _claimWstETH compares in shares directly
if sharesToClaim == 0: revert NothingToClaim()
_unsafeReduceBond(noId, sharesActuallySent)
transfer / wrap / requestWithdrawal → rewardAddress
```

The user-requested `amount` is **capped server-side** by `claimableShares` (post-splitter). The UI does not have to be exact for safety; it just needs to be honest about what will happen.

---

## 2. SDK layer (`@lidofinance/lido-csm-sdk`)

### `BondSDK.claimBond({ token, amount, proof, shares, ... })` ([bond-sdk.ts](../../../../../lido-csm-sdk/packages/csm-sdk/src/bond-sdk/bond-sdk.ts))

```text
amount === 0n         → pullAndSplitFeeRewards(noId, shares, proof)
token === eth         → claimRewardsUnstETH(noId, amount, shares, proof)
token === steth       → claimRewardsStETH(noId, amount, shares, proof)
token === wsteth      → claimRewardsWstETH(noId, amount, shares, proof)
```

`parseClaimProps` defaults `proof = []` and `shares = 0n` — omitting them yields `rewardsProof.length == 0`, which **skips Step A on-chain** but still runs Step C (splitter).

### `BondBalance` ([common/types.ts](../../../../../lido-csm-sdk/packages/csm-sdk/src/common/types.ts), [calc-bond-balance.ts](../../../../../lido-csm-sdk/packages/csm-sdk/src/operator-sdk/calc-bond-balance.ts))

The contract's `getNodeOperatorBondInfo` returns `requiredBond = forKeys + locked + debt`. The SDK normalises to:

```ts
required        = requiredBond - locked - debt    // forKeys ONLY
delta           = |current - required|            // distance from forKeys (NOT real excess)
isInsufficient  = current < required              // forKeys-only deficit
locked, debt, pendingToSplit                      // exposed separately, all in stETH
```

⚠ **Subtle**: `bond.delta` and `bond.isInsufficient` are forKeys-only. Real claimable-bond math must subtract `locked` and `debt` separately. Use the named quantities in §3.3 instead.

### `Rewards` (from `RewardsSDK`)

```ts
{ available: bigint   // distributable stETH for this round (already eth-denominated)
  shares:    bigint   // cumulativeFeeShares to pass to the contract
  proof:     Hex[] }  // Merkle proof
```

---

## 3. UI implementation (`features/claim-bond/claim-bond-form/`)

### 3.1 Form inputs ([context/types.ts](../context/types.ts))

```text
claimOption: ALL_TO_RA | BOND_TO_RA | REWARDS_TO_BOND
token:       eth | steth | wsteth
amount:      bigint   (in token units)
```

### 3.2 Submission matrix ([context/use-claim-bond-flow.ts](../context/use-claim-bond-flow.ts))

```ts
includeRewards = claimOption !== BOND_TO_RA
amount         = showAmount ? input.amount : 0n
proof/shares   = includeRewards ? data.rewards.{proof,shares} : undefined
```

| `claimOption`                               | proof passed? | amount > 0? | On-chain branch                                                                                |
| ------------------------------------------- | ------------- | ----------- | ---------------------------------------------------------------------------------------------- |
| ALL_TO_RA (rewards available > 0)           | ✅            | usually yes | full pull + split + payout                                                                     |
| ALL_TO_RA, splitters take 100% / cover only | ✅            | 0           | pull + split, no payout (`pullAndSplitFeeRewards`)                                             |
| BOND_TO_RA                                  | ❌            | yes         | no pull; splitter step still runs against pre-existing pendingToSplit; payout from excess bond |
| REWARDS_TO_BOND                             | ✅            | 0           | pull + split, no payout — bond grows by net distributed                                        |

### 3.3 Named quantities ([context/claim-bond-data-provider.tsx:97-105](../context/claim-bond-data-provider.tsx#L97-L105))

These drive both option availability and the dispatch of per-option labels. Both `realInsufficient` and `realExcess` mirror the contract by including `locked` and `debt`:

```ts
realInsufficient = max(0, forKeys + locked + debt - current)
realExcess       = max(0, current - forKeys - locked - debt)         // = claimablePre
rewardsRemainder = max(0, rewards.available - realInsufficient)
totalShare       = Σ feeSplits[i].share
```

Use these instead of `bond.delta` / `bond.isInsufficient` for any decision that involves real claimable bond.

### 3.4 Option availability gating ([context/claim-bond-data-provider.tsx:109-115](../context/claim-bond-data-provider.tsx#L109-L115))

```text
ALL_TO_RA       enabled iff rewards.available > 0
BOND_TO_RA      enabled iff calculateAvailableToClaim(bond, no rewards, splits) > 0
REWARDS_TO_BOND enabled iff rewards.available > 0 AND calculateAvailableToClaim(bond, rewards, splits) > 0
```

The form's `'nothing'` gate is driven by `availableOptions.length === 0` — nothing is shown ⇔ nothing is selectable.

### 3.5 Available-to-claim math ([utils/calculate-available-to-claim.ts](../../../../utils/calculate-available-to-claim.ts))

Mirrors the contract (subtracts locked + debt):

```ts
distributed = rewards?.available ?? 0n;
claimable = max(0, current + distributed - forKeys - locked - debt);
splittableGross = min(claimable, pendingToSplit + distributed);
splitterCut = (splittableGross * Σshare) / PERCENT_BASIS;
return claimable - splitterCut; // ≈ what the user can actually receive
```

Used by validation, max button, and option availability.

### 3.6 Per-option labels ([hooks/use-claim-options.tsx](../hooks/use-claim-options.tsx))

| `CLAIM_OPTION`                                                  | Branch (no splits)                                                                                   | Branch (with splits)                                                                        |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **ALL_TO_RA**, `realInsufficient > 0` & `rewardsRemainder == 0` | `COMPENSATE_ALL_FROM_REWARDS` — Rewards → Bond / "All Rewards will compensate the Insufficient Bond" | _same_ (when claimable=0, splitters get nothing this txn)                                   |
| **ALL_TO_RA**, `realInsufficient > 0` & `rewardsRemainder > 0`  | `COMPENSATE_AND_CLAIM_REWARDS` — Bond, Rewards → RA                                                  | `SPLIT_AND_COMPENSATE_TO_RA` — Rewards → Splitter addresses → RA                            |
| **ALL_TO_RA**, `realExcess > 0`                                 | `CLAIM_ALL` — Bond, Rewards → All → RA                                                               | `SPLIT_AND_CLAIM_BOND` — Rewards → Splitter addresses, Excess Bond → RA                     |
| **ALL_TO_RA**, `realExcess == 0` & `realInsufficient == 0`      | `CLAIM_REWARDS_ONLY` — Bond, Rewards → RA                                                            | `SPLIT_REWARDS_ONLY` — Rewards → Splitter addresses                                         |
| **BOND_TO_RA**, `pendingToSplit == 0` (or no splits)            | `CLAIM_EXCESS_BOND` — Excess Bond → RA / "Claim only Excess Bond. Rewards remain unclaimed"          | _same_                                                                                      |
| **BOND_TO_RA**, `hasSplits && pendingToSplit > 0`               | –                                                                                                    | `CLAIM_EXCESS_BOND_WITH_PENDING_SPLIT` — "Pending splitter share will be settled from bond" |
| **REWARDS_TO_BOND**, `realInsufficient > 0`                     | `COMPENSATE_INSUFFICIENT` — Rewards → Bond                                                           | `SPLIT_REWARDS_TO_BOND` — Rewards → Splitter addresses → Excess bond                        |
| **REWARDS_TO_BOND**, `realInsufficient == 0`                    | `REWARDS_TO_EXCESS_BOND` — Rewards → Excess Bond                                                     | `SPLIT_REWARDS_TO_BOND` (same as above)                                                     |

### 3.7 Per-tx breakdown ([hooks/use-claim-breakdown.ts](../hooks/use-claim-breakdown.ts))

Pure function `computeClaimBreakdown(input, data)` — also called imperatively from [`use-tx-modal-stages-claim-bond.tsx`](../hooks/use-tx-modal-stages-claim-bond.tsx) so the confirmation modal can show consistent numbers.

```text
distributed         = includesRewards ? rewards.available : 0
claimablePre        = max(0, current - forKeys - locked - debt)
claimable           = max(0, current + distributed - forKeys - locked - debt)
totalAbsorbed       = distributed - (claimable - claimablePre)              # rewards eaten by the bond
debtBurned          = includesRewards ? min(debt, current + distributed) : 0
debtRemain          = debt - debtBurned
debtCoveredFromRewards = min(distributed, debtBurned)
coverAmount         = max(0, totalAbsorbed - debtCoveredFromRewards)        # rewards filling forKeys+locked deficit
splittableGross     = hasSplits ? min(claimable, pendingToSplit + distributed) : 0
splittable          = splittableGross * Σshare / PERCENT_BASIS
userClaimSteth      = isRewardsToBond ? 0 : (token == wsteth ? sharesToEth(amount) : amount)
toRA                = min(userClaimSteth, claimable - splittable)
bondDelta           = claimable - claimablePre - splittable - toRA          # change in Excess Bond
```

Rendered as: "Compensation for Insufficient Bond" (`coverAmount`), "Bond debt covered" (`debtBurned`), "Bond debt remaining" (`debtRemain`), "Splitters payout" (`splittable`), "Rewards Address will receive" (`toRA`), "Excess bond will increase/decrease by" (`bondDelta`).

---

## 4. Notes & references

- "Rewards Address" is plural everywhere in the codebase. The Figma label `"Reward Address"` (singular) is treated as a typo.
- Splitter receipt is bounded by `min(claimable, pendingToSplit)`. When bond is heavily insufficient (`current + distributed < forKeys + locked + debt`), `claimable = 0` and splitters receive nothing this txn — `pendingToSplit` accrues for next cycle.
- `_decreasePendingSharesToSplit` decrements by the gross base (`splittableShares`), not the sum actually transferred. The unallocated remainder (rounding dust + NO's retained share) stays in bond.
- Figma references: nodes `14655:28900` (sufficient + splits), `14653:12850` and `14788:15136` (insufficient + splits) in file `rDYbUiPsuNCDnb2vLvhONR` (CSM-UX).
