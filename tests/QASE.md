# Qase

How test cases get their place in Qase. The short rules are in `CLAUDE.md`; this file is the
reasoning and the traps behind them.

## The model

Three levels, declared on `describe`:

- **Epic** — product area (`Bond & Rewards`)
- **Feature** — capability (`Claim`)
- **Story** — the scenario a spec file covers, usually 1:1 with the file (`Penalty`)

Values come only from the module's map — `tests/cm-widget/consts/qase.const.ts`,
`tests/csm-widget/consts/qase.const.ts`. Each module builds its own typed `qaseTree` via
`createQaseTree<Epic, Feature, Story>()`, so a string that is not in the map does not compile, and
CSM values cannot leak into CM tests. CSM and CM are separate Qase projects with separate trees.

Adding a section = adding a line to the map. Qase creates the folder on the first run of a test
that points at it — the reporter sends `{ title, public_id: null }` per level, which means
"find by title under the parent, create if absent".

## Story or parameter?

The judgement call that keeps coming up. Apply it literally:

> Same steps and same assertions, only the preconditions differ → **parameter**.
> Different assertions → **story**.

Operator type, role, balance state, token — these are contexts, not stories. Nesting them
multiplies the tree: in CSM, 2 roles × 2 address states already produced four copies of one case
(`Verify input appearence` — CSM-232/234/236/238).

One caveat learned the hard way: a parameter only pays off if the tests involved **share one Qase
ID**. Turning a context into a parameter while leaving separate IDs gives the worst outcome —
identical titles side by side in one folder with nothing to tell them apart. So while the state
lives in separate cases, keep it as a story level. That is why the claim suite uses
`Penalty` / `Only rewards` / `Insufficient bond` as stories today.

## Marking up a folder

1. **IDs first.** Never restructure the tree before every test has an ID — the suite is part of the
   dedup signature, so moving an ID-less test creates a second case instead of moving the first.
   Never invent IDs either: run the suite, let the reporter create the cases, copy the assigned
   numbers out of the Qase report, matching by exact title.

2. **Group by what tests assert, not by file name.** Read the folder before naming stories.

3. **Extend the map, then mark each `describe`.** `qaseTree` replaces the existing `{ tag: [...] }`
   argument — carry the tags over:

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

   Tests themselves stay untouched. Per-test markup is only for a test that belongs to a different
   story than its describe — levels declared on a test are appended after the inherited ones.

4. **Check the suite still loads** — a broken fixture or import silently drops every test, and
   `tsc` does not catch it:

   ```bash
   npx playwright test -c tests/cm-widget/playwright.config.ts --list --reporter=list | tail -1
   ```

   The repo's own reporters swallow `--list` output, hence the explicit `--reporter=list`.

## Traps

- **Annotations beat `qase.suite()`.** If a describe carries `QaseSuite` annotations, a
  `qase.suite()` call in the body is ignored. Use `qaseTree`, never `qase.suite()`.

- **Runtime calls are lost on skip.** `qase.tags()` / `qase.parameters()` / `qase.fields()` attach
  metadata while the test body runs, so a test skipped in `beforeAll` (`test.skip(!useFork)`)
  reports none of it. Suite levels survive — they are static annotations evaluated at collection.

- **No suite at all falls back to the file path.** Without annotations or `qase.suite()` the
  reporter uses `test.titlePath()` — `['', project, relative/file.spec.ts, ...describe titles]`.
  That is where the file-shaped tree in Qase comes from.

- **Shared ID needs parameters.** A `forEach` loop reusing one ID overwrites its own results unless
  each run declares `qase.parameters({...})` — parameters are part of the signature.

- **Playwright tags are invisible to Qase** on their own: the reporter reads only what was passed
  to `qase.tags()`, never `test.tags`. `tests/shared/helpers/qaseTags.ts` bridges them with an auto
  fixture, so `{ tag: [Tags.smoke] }` is all a test needs.

- **Fixtures must destructure their first argument.** `async ({}, use) => {}`, never
  `async (_x, use) => {}` — the latter throws "First argument must use the object destructuring
  pattern" at load time and drops every test in the project.

- **Qase project setting "Update test cases from automated results"** with `Suite` in the field
  mapping is what moves existing cases into their new folders — no migration script needed. But
  `All fields` also overwrites Title, Description, Pre-conditions, Post-conditions and Steps from
  each automated run, wiping anything written in Qase by hand.

## Known duplicates, deferred

The claim suite holds provable duplicates: `314/320/326/330/331/335` all assert the same three
claim options with different expected values per balance state, and `316/332`, `317/327`,
`318/333` are pairwise identical "will receive" checks. Collapsing them (12 cases → 4, with a
`bondState` parameter) is agreed as correct but deferred pending the user's own analysis.
Do not merge them unprompted.
