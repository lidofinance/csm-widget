import { expect } from '@playwright/test';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { OPERATOR_TYPE_METADATA } from 'tests/shared/consts/operatorTypes.const';
import { ForkActionsService } from 'tests/shared/services/forkActions.service';
import { test } from '../test.fixture';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

// Representative CM curated gate. Any of po/pto/pgo/do/eeo/iodc/iodcp would
// prove the same thing — PGO is picked arbitrarily.
const GATE_TYPE = OPERATOR_TYPE.CM_PGO;
const GATE_SHORT = OPERATOR_TYPE_METADATA[GATE_TYPE].short;
const GATE_SELECTOR = ForkActionsService.GATE_SELECTOR.pgo;

/**
 * sm-lab Phase B Task 11: proves a curated-gate address tree, replaced and
 * pinned to the real ipfs-mock (Task 4/6 — no more Phase A `fork-*`
 * sentinel CID) via `forkActionService.setGateAddrs`, flows all the way
 * through the widget. `CAN_CREATE` (shared/hooks/use-can-create-node-operator.ts)
 * and the create-operator gate list (`useCuratedGatesEligibility`,
 * modules/web3/hooks/use-curated-gates-eligibility.ts) both read the same
 * on-chain tree, so a freshly generated address — a member of no gate tree
 * at all — flips from "not eligible" (redirected home to the
 * BannerNotEligible welcome state) to "eligible" (able to open /create and
 * select the gate) purely as a result of the fork-side tree update.
 *
 * ICS gate coverage (the other half the brief asked for) does NOT belong in
 * this file — confirmed at both the recipe and UI layers, not assumed:
 *
 * - Recipe layer: cm-widget's `forkActionService` (../test.fixture.ts) is
 *   constructed with `module: 'cm'`. `@sm-lab/recipes`' `resolveGate`
 *   (bundled in dist/topup-*.mjs) has a `ctx.module === "cm"` branch that
 *   only recognises po/pto/pgo/do/eeo/iodc/iodcp (or a numeric index) and
 *   throws `unknown cm gate selector "<selector>"` for anything else — the
 *   'ics'/'idvtc' handling that follows in the source is unreachable when
 *   module is 'cm'. Calling `forkActionService.setGateAddrs('ics', address)`
 *   from this file's fixtures would throw, not silently no-op.
 * - UI layer: the CM widget's `OPERATOR_TYPE` enum has no CM_ICS/CM_IDVTC
 *   member (only CSM_ICS/CSM_IDVTC exist, mapped to MODULE_NAME.CSM), and
 *   its ICS pages (pages/type/ics-apply.tsx, pages/type/ics-claim.tsx) are
 *   hard-gated behind `rule="IS_CSM"` with a redirect home — there is no CM
 *   route that would show an ICS apply/claim flow even if the tree were set.
 *
 * Real ICS gate-tree coverage already exists end-to-end — setGateAddrs('ics',
 * address) followed by the claim/create-operator flow — in
 * tests/csm-widget/tests/operatorWithValidator/operatorType/idvtc/
 * claimOrCreateIcs.spec.ts and applyApplication/*.spec.ts, using the CSM
 * module's own forkActionService context (module: 'csm'). This spec covers
 * the half that IS reachable from cm-widget: the CM curated gate.
 */
test.describe(
  'sm-lab gate address-tree coverage: curated gate eligibility',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeAll(
      async ({ evmNode, forkActionService, widgetService, secretPhrase }) => {
        snapshotId = await evmNode.snapshot();
        const address = mnemonicToAccount(secretPhrase).address;

        await test.step(
          'Fresh address is not yet in any curated gate tree: ' +
            '/create redirects to the not-eligible welcome banner',
          async () => {
            await widgetService.createNodeOperatorPage.open();
            await expect(widgetService.page).toHaveURL('/');
            await expect(
              widgetService.notEligiblePage.notEligibleSection,
            ).toBeVisible({ timeout: PAGE_WAIT_TIMEOUT });
          },
        );

        await test.step(
          '[Fork] Replace the gate tree with one that includes the address, ' +
            'pinned to the real ipfs-mock',
          async () => {
            expect(
              process.env.IPFS_API_URL,
              'IPFS_API_URL must be set for @forked runs (ipfs-mock)',
            ).toBeTruthy();
            await forkActionService.setGateAddrs(GATE_SELECTOR, address);
          },
        );

        // Reopen so the widget reflects the newly pinned tree.
        await widgetService.createNodeOperatorPage.open();
      },
    );

    test.afterAll(async ({ evmNode }) => {
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test(`Should show ${GATE_SHORT} gate as eligible and selectable after the tree update`, async ({
      widgetService,
    }) => {
      const { step1 } = widgetService.createNodeOperatorPage;
      const gate = step1.getGateInput(GATE_TYPE);

      await test.step('"/create" is reachable and the gate card is shown', async () => {
        await expect(widgetService.page).toHaveURL(/\/create/);
        await expect(gate.card).toBeVisible({ timeout: PAGE_WAIT_TIMEOUT });
        await expect(gate.title).toHaveText(
          OPERATOR_TYPE_METADATA[GATE_TYPE].name,
        );
      });

      await test.step('Selecting the gate checks it and enables Continue', async () => {
        await gate.click();
        await expect(gate.input).toBeChecked();
        await expect(gate.checkIcon).toBeVisible();
        await expect(step1.continueButton).toBeEnabled();
      });
    });
  },
);
