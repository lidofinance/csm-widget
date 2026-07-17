import { expect } from '@playwright/test';
import { VALIDATOR_STATUSES } from '@sm-lab/cl';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';
import { KeysPage } from 'tests/cm-widget/pages';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

type ValidatorStatus = (typeof VALIDATOR_STATUSES)[number];

type StatusCase = {
  clStatus: ValidatorStatus;
  expectedChips: string[];
};

/**
 * The 5 cl-mock statuses that are both settable (POST /admin/validators)
 * and rendered as distinct chips by the keys/view UI. Mapping is
 * csm-sdk's keys-with-status-sdk/parse-cl-response.ts StatusMap, which
 * collapses the mock's 9 zod-recognised statuses onto 5 lifecycle chips
 * (Active / Exiting / Exited (withdrawal pending) / Withdrawn / Activation
 * pending). "Slashed" is not a lifecycle state — it's an extra chip driven
 * by the CL validator.slashed flag (compute-statuses.ts checkSlashed), so
 * it renders alongside whichever lifecycle chip the status maps to
 * (active_slashed → Exiting + Slashed).
 *
 * exited_unslashed drives the "Exited (withdrawal pending)" lifecycle
 * chip — distinct from withdrawal_done's "Withdrawn" — via cl-mock's
 * buildValidator, which only sets validator.slashed when the status name
 * ends in "_slashed" ("exited_unslashed" doesn't), so no "+ Slashed" suffix
 * is expected here. exited_slashed and withdrawal_possible collapse onto
 * that same "Exited (withdrawal pending)" chip, so they're redundant with
 * the exited_unslashed case and not covered separately.
 * withdrawal_possible_slashed / withdrawal_done_slashed exist in cl-mock's
 * VALIDATOR_STATUSES but are NOT in the SDK's CLStatusSchema zod enum
 * (parse-cl-response.ts) — setting one would fail zod parsing for the
 * whole CL fetch (hasCLStatuses flips to false for every key on the
 * operator), so they're intentionally excluded here rather than silently
 * breaking the other assertions.
 */
const STATUS_CASES: StatusCase[] = [
  { clStatus: 'active_ongoing', expectedChips: ['Active'] },
  { clStatus: 'active_exiting', expectedChips: ['Exiting'] },
  {
    clStatus: 'exited_unslashed',
    expectedChips: ['Exited (withdrawal pending)'],
  },
  { clStatus: 'withdrawal_done', expectedChips: ['Withdrawn'] },
  { clStatus: 'active_slashed', expectedChips: ['Exiting', 'Slashed'] },
];

/**
 * POSTs one validator status directly to the running cl-mock admin API.
 * `@sm-lab/recipes`' `setClValidator(clMockUrl, input)` wraps this same
 * endpoint, but its exported `SetValidatorInput.status` type only allows
 * `'active_ongoing' | 'active_exiting'` (the two statuses the recipes
 * bridge itself produces) — withdrawal_done/active_slashed aren't reachable
 * through it. Hitting the mock directly keeps one uniform code path across
 * all 5 cases (mirrors the Task 9 precedent: when a plan assumption about
 * an exported helper doesn't hold, fall back to the documented admin API).
 */
const setValidatorStatus = async (
  pubkey: `0x${string}`,
  status: ValidatorStatus,
) => {
  const clMockUrl = process.env.CL_MOCK_URL;
  expect(clMockUrl, 'CL_MOCK_URL must be set for @forked runs').toBeTruthy();

  const res = await fetch(`${clMockUrl}/admin/validators`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pubkey, status }),
  });
  expect(res.ok, `cl-mock rejected status "${status}" for ${pubkey}`).toBe(
    true,
  );
};

/**
 * Finds the keys/view row whose status chips contain every text in `texts`.
 * Throws (rather than returning undefined) so callers get type-narrowed
 * access to the row and a clear failure message in one place.
 */
const findRowByStatusTexts = async (keysPage: KeysPage, texts: string[]) => {
  const rows = await keysPage.keysView.getAllTableRows();
  for (const row of rows) {
    const text = await row.statusCell.textContent();
    if (text && texts.every((chip) => text.includes(chip))) return row;
  }
  throw new Error(`No row found with chips [${texts.join(', ')}]`);
};

// sm-lab Phase B Task 10: proves the keys/view UI reflects a validator's CL
// status served by the cl-mock (Task 1/3 wiring: browser CL routed to the
// mock, see test.fixture.ts's clUrlToMock route). All 5 cases reuse the
// operator's first key/pubkey and overwrite its cl-mock entry sequentially
// (worker-scoped browser/page fixtures run these tests in series), so no
// EVM state actually needs reverting for the CL side — the evmSnapshot/
// evmRevert bracket and admin cleanup below just keep the fork and the
// cl-mock's in-memory ValidatorStore tidy for whatever runs next.
test.describe(
  'sm-lab validator status coverage: keys/view via cl-mock',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;
    let pubkey: `0x${string}`;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeAll(async ({ cmSDK, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await widgetService.keysPage.keysView.open();
      const noId = await widgetService.extractNodeOperatorId();

      const keys = await cmSDK.getAllKeys(BigInt(noId));
      expect(keys.length).toBeGreaterThan(0);
      [pubkey] = keys;
    });

    test.afterAll(async ({ cmSDK }) => {
      // Relies on this spec file sorting last among coverage/*.spec.ts (see
      // the describe-level comment above) so no later coverage test reads
      // this validator's cl-mock entry before it's deleted here.
      if (pubkey && process.env.CL_MOCK_URL) {
        await fetch(
          `${process.env.CL_MOCK_URL}/admin/validators/${encodeURIComponent(pubkey)}`,
          { method: 'DELETE' },
        ).catch(() => undefined);
      }
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    for (const { clStatus, expectedChips } of STATUS_CASES) {
      const chipsLabel = expectedChips.map((c) => `"${c}"`).join(' + ');

      test(`Should show ${chipsLabel} when cl-mock reports ${clStatus}`, async ({
        widgetService,
      }) => {
        await test.step(`[Fork] Set cl-mock validator status to ${clStatus}`, async () =>
          setValidatorStatus(pubkey, clStatus));

        await test.step('Reload keys view', async () => {
          await widgetService.keysPage.keysView.open();
          await widgetService.keysPage.keysView.table.waitFor({
            state: 'visible',
            timeout: PAGE_WAIT_TIMEOUT,
          });
        });

        await test.step(`Assert the row shows ${chipsLabel}`, async () => {
          const row = await findRowByStatusTexts(
            widgetService.keysPage,
            expectedChips,
          );

          for (const chip of expectedChips) {
            await expect(row.statusCell).toContainText(chip);
          }
        });
      });
    }
  },
);
