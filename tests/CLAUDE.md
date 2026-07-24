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
