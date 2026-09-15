# Testing

Guidance for writing Playwright e2e tests (`tests/csm-widget`, `tests/cm-widget`).

## PageObject rules

- Tests, pages, and components must always use the correct PageObject
- All locators must reference the component's `data-testid`
- If an element has no `data-testid`, add one — but only where it makes logical sense
- All `data-testid` values must be in camelCase
- Always start from fixtures and build on them

## Test structure

- Test names follow the `"should ... when ..."` pattern
- Each test must cover the UI comprehensively — don't write a test that makes only one assertion
- Always use `test.step` to structure assertions
- Always use fixtures

## Test name style

Names must be **very short** — the `describe` block already provides state context, the test name should only say what it checks.

- Bad: `'Should show correct stETH amount, enable claim button and show "will receive" info when "Claim All" is selected'`
- Bad: `'Should show correct stETH amount and "will receive" info when "Claim All" selected'`
- Good: `'Should show correct stETH and "will receive" when "Claim All" selected'`
- Good: `'Should show SDK amounts on balance cards'`
- Good: `'Should disable "Excess Bond" option when all excess locked'`

Rules:

- Don't repeat the describe context (state/condition) in the test name
- Don't list every assertion — name the main thing being verified
- Drop filler: "and show success modal", "with correct", "option is" → "option", "is selected" → "selected", "is active" → "active", "info icon" → drop
- `when X` at the end is ok only if it adds info not already in describe

## Amount assertions

- **Never** use `not.toContainText('0.0 stETH')` or similar non-zero UI checks
- Compare against SDK values: `cmSDK.operator.getBondBalance(BigInt(noId))` → `.delta`, `cmSDK.getRewards(noId)` → `.available`, convert with `formatEther()`
- When SDK isn't available, use regex: `await expect(element).toContainText(/\d+\.\d+/)`
- Tolerance depends on display precision:
  - Balance cards (display `X.X` — 1 decimal): `Math.abs(parseFloat(text) - expected) < 0.1`
  - Form info / token selector (display 4 decimals): `Math.abs(parseFloat(text) - expected) < 0.0002`

## Fork test pattern

```typescript
let snapshotId: string;
let noId: number; // at describe scope when multiple tests need it

test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
  snapshotId = await cmSDK.evmSnapshot();
  await widgetService.somePage.open();
  noId = await widgetService.extractNodeOperatorId(); // must be before fork actions
  await forkActionService.someSetup(noId, ...);
  await widgetService.somePage.open(); // reopen to reflect new chain state
});

test.afterAll(async ({ cmSDK }) => {
  await cmSDK.evmRevert(snapshotId);
});
```

Use `beforeAll`/`afterAll` (one snapshot per describe), not `beforeEach`/`afterEach`.

## Claim option constants

Always import from the shared file — never inline raw strings:

```typescript
import { CLAIM_OPTION } from './claim.const';
// CLAIM_OPTION.ALL_TO_RA | CLAIM_OPTION.BOND_TO_RA | CLAIM_OPTION.REWARDS_TO_BOND
```

## Qase

Every test reports to Qase. Two rules, both enforced mechanically.

### 1. Every test needs a Qase ID

```typescript
test(qase(315, 'Should show SDK amounts on balance cards'), ...)
```

A test without an ID makes the reporter create a new case on every run, in a folder derived from
the file path. Never add IDs by hand — run the suite, let the reporter create the cases, then copy
the assigned IDs back into the code.

### 2. Every describe declares its place in the suite tree

```typescript
import { EPIC, FEATURE, STORY, qaseTree } from 'tests/cm-widget/consts/qase.const';

test.describe(
  'Bond & Rewards. Claim. Penalty state.',
  qaseTree({
    epic: EPIC.bondRewards,
    feature: FEATURE.claim,
    story: STORY.penalty,
    tag: [Tags.forked],
  }),
  () => { ... },
);
```

- Values come **only** from that module's map (`tests/<module>-widget/consts/qase.const.ts`).
  A literal string does not compile. Need a new section — add it to the map; Qase creates the
  folder on the first run.
- Maps are per module: CSM and CM are separate Qase projects with separate trees.
- `qaseTree` on `describe`, never `qase.suite()` in the test body — annotations win over it, and
  the body does not run for a skipped test.

### Epic / feature / story

- **Epic** — product area (`Bond & Rewards`).
- **Feature** — capability (`Claim`).
- **Story** — the scenario a spec file covers, usually 1:1 with the file (`Penalty`).

Three levels, no deeper. Story is not a place to encode operator type, role, or balance state as
extra nesting — that multiplies the tree. When the same check runs against several contexts, the
context is a **parameter**:

```typescript
qase.parameters({ token: tokenName });
```

Required whenever several tests share one Qase ID (a `forEach` loop, or two specs pointing at the
same case) — without it the results overwrite each other in Qase.

### Tags

`{ tag: [Tags.smoke] }` is enough. The `reportTagsToQase` auto-fixture mirrors Playwright tags into
Qase; the reporter itself never reads `test.tags`. Do not call `qase.tags()` by hand.

The markup procedure, the story-vs-parameter rule and the reporter's traps are in `QASE.md`.
