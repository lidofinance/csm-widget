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
the assigned IDs back into the code, matching by exact title.

IDs come **first**. The suite path is part of the reporter's dedup signature, so restructuring the
tree before a test has an ID creates a second case instead of moving the first.

### 2. Every describe declares its place in the suite tree

```typescript
import { EPIC, qaseTree } from 'tests/cm-widget/consts/qase.const';

test.describe(
  ...qaseTree({
    epic: EPIC.bondRewards,
    feature: 'Claim',
    story: 'Penalty',
    tag: [Tags.forked],
  }),
  () => { ... },
);
```

`qaseTree` is **spread** into `describe`: it returns `[title, details]` and derives the title from
the levels — `'Bond & Rewards. Claim. Penalty.'`. Never write the title by hand; there is nothing
to keep in sync that way. Two describes in one file therefore need two distinct stories, otherwise
they generate the same title.

- `epic` and `feature` come **only** from that module's map
  (`tests/<module>-widget/consts/qase.const.ts`). Each epic carries its own `features`, so
  `feature` accepts only a feature of the epic being passed, and it is **required whenever the
  epic declares any** — a level can never be dropped by accident. Need a new area or surface — add
  it to the map; Qase creates the folder on the first run of a test pointing at it.
- A spec that deliberately sits at the epic level passes `feature: null` with a comment saying why
  (it spans several features, or the surface has a single spec). Silence is not an option.
- `story` is a plain string written in the spec: it names that one file's scenario and is not
  shared with other files, so a map would only add a second place to edit. A typo lands under the
  right parent and is obvious in Qase; a typo in an epic or feature would silently scatter many
  files, which is why those stay typed.
- Maps are per module: CSM and CM are separate Qase projects with separate trees.
- `qaseTree` on `describe`, never `qase.suite()` in the test body — annotations win over it, and
  the body does not run for a skipped test.

### Epic / feature / story

- **Epic** — product area (`Bond & Rewards`, `Keys`, `Settings`).
- **Feature** — a real surface of that area, named after what the operator does there
  (`Submit keys`, `Remove keys`, `View keys` — not one vague `Keys`). Derive them from the page
  objects, not from the folder names: `KeysPage` exposes `submitPage` / `removePage` / `keysView`,
  so those are the features. Under `Dashboard` the features are the page's sections.
- **Story** — the scenario a spec file covers, usually 1:1 with the file (`Penalty`).

Three levels, no deeper. `feature` is optional: a spec that spans several features of its area sits
at the epic level — the address-blacklist specs check submit _and_ remove, add bond _and_ claim, so
they are `Keys / Address blacklist`, `Bond & Rewards / Address blacklist`, and so on.

Keep a feature in the map even when nothing tests it yet, if the surface exists — the map should
describe the product, not only today's coverage. Folders appear in Qase only when a test points at
one.

Add the feature level when several specs share a surface **and** that surface has a name not
already in the path. Skip it — with an explicit `feature: null` — when the spec spans several
surfaces (it belongs to the epic), when the surface has a single spec (the story already names it),
or when the name would just restate the surface: `Group / Operator card / Operator card` says
nothing twice.

**A feature may reuse an epic's name when it names a view of that epic's area.** Under `Dashboard`
the blocks are `Keys`, `Bond & Rewards` and `Roles` — the same words as the epics, because that is
what those blocks show, and the parent already says they are the dashboard's view of them. Invented
synonyms (`Keys stats`, `Bond stats`) only add a word nobody uses when reading the path aloud.

A practical tell: **if a key in the map needs a prefix to avoid colliding with its neighbour**
(`dashboardKeys` next to `keys`), the difference lives in the variable name instead of the data —
rename the value, or drop the level.

### Naming a story

Read the whole path aloud: it must identify the scenario without opening the file.

A generic story name only works under a specific parent. `Bond & Rewards / Claim / Transaction` is
clear because `Claim` carries the meaning; `Create operator / Transaction` is not — the parent is
an epic, too broad for a generic leaf to lean on. Without a feature level the story has to carry
the specifics itself: `Create operator / Curated operator transaction`.

**A story names the scenario, never the environment.** `Apply. Cluster members on fork` said where
the test runs; `tag: [Tags.forked]` already says that. Two files that differ only by environment
differ by scenario too — the fork is what makes the positive path reachable — so name them by what
they check: `Apply. Cluster members` (filling, validation, rejections) next to
`Apply. Member verification` (a member actually verified) and `Apply. Submit happy path`.

**Split a form's own behaviour from its transaction.** A story called `Form` covers everything and
says nothing. Token choice, amounts, Max, validation are `Token & amount`; the test that signs and
asserts the new on-chain balance is `Transaction`, in its own `<action>Tx.spec.ts`. `Add bond` and
`Claim` use that split in both modules.

### Story or parameter?

> Same steps and same assertions, only the preconditions differ → **parameter**.
> Different assertions → **story**.

Operator type, role, balance state, token — these are contexts, not stories. Nesting them
multiplies the tree: in CSM, 2 roles × 2 address states already produced four copies of one case
(`Verify input appearence` — CSM-232/234/236/238).

The catch: a parameter only pays off if the tests involved **share one Qase ID**. Turning a context
into a parameter while leaving separate IDs gives the worst outcome — identical titles side by side
in one folder with nothing to tell them apart. While the variants keep separate cases, keep the
context as a story level. That is why the claim suite uses `Penalty` / `Only rewards` /
`Insufficient bond` as stories.

```typescript
qase.parameters({ token: tokenName });
```

Required whenever several tests share one Qase ID (a `forEach` loop, or two specs pointing at the
same case) — parameters are part of the signature, and without them the results overwrite each
other in Qase.

### Tags

`{ tag: [Tags.smoke] }` is enough. The `reportTagsToQase` auto-fixture mirrors Playwright tags into
Qase; the reporter itself never reads `test.tags`. Do not call `qase.tags()` by hand.

### Traps

- **Runtime calls are lost on skip.** `qase.tags()` / `qase.parameters()` / `qase.fields()` attach
  metadata while the test body runs, so a test skipped in `beforeAll` (`test.skip(!useFork)`)
  reports none of it. Suite levels survive — they are static annotations read at collection.
- **No suite at all falls back to the file path.** Without annotations the reporter uses
  `test.titlePath()`, which is where the file-shaped tree in Qase comes from.
- **Fixtures must destructure their first argument.** `async ({}, use) => {}`, never
  `async (_x, use) => {}` — the latter throws "First argument must use the object destructuring
  pattern" at load time and drops every test in the project. `tsc` does not catch it.
- **Verify the suite still loads** after touching markup, fixtures or imports — the repo's own
  reporters swallow `--list` output, so pass an explicit one:

  ```bash
  npx playwright test -c tests/cm-widget/playwright.config.ts --list --reporter=list | tail -1
  ```

- **Qase project setting "Update test cases from automated results"** with `Suite` in the field
  mapping is what moves existing cases into their new folders — no migration script needed. But
  `All fields` also overwrites Title, Description, Pre-conditions, Post-conditions and Steps from
  each automated run, wiping anything written in Qase by hand.
