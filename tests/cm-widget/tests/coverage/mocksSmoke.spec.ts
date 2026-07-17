import { expect } from '@playwright/test';
import { test } from '../test.fixture';
import { Tags } from 'tests/shared/consts/common.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

// Executable CI verification for sm-lab Phase B (offline test bed) Tasks 2-6:
// proves the cl-mock, ipfs-mock and @sm-lab/recipes are wired together
// coherently (not just individually reachable).
test.describe(
  'sm-lab offline-bed infra coherence smoke',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeAll(async ({ evmNode }) => {
      snapshotId = await evmNode.snapshot();
    });

    test.afterAll(async ({ evmNode }) => {
      await evmNode.revert(snapshotId);
    });

    test('Should pin rewards report to a real ipfs-mock CID', async ({
      forkActionService,
    }) => {
      const report =
        await test.step('[Fork] Make + submit rewards report', async () =>
          forkActionService.reportRewards());

      await test.step('Assert treeCid is a real pinned CID, not the Phase A fake sentinel', async () => {
        expect(report.treeCid).toBeTruthy();
        expect(report.treeCid).not.toMatch(/^fork-/);
      });
    });

    test('Should reflect an exit-request validator status on the cl-mock', async ({
      forkActionService,
      widgetService,
    }) => {
      const noId = await test.step('Get operator id', async () => {
        await widgetService.keysPage.submitPage.open();
        return widgetService.extractNodeOperatorId();
      });

      const result =
        await test.step("[Fork] Exit request for the operator's first key", async () =>
          forkActionService.exitRequest(noId, 0));

      await test.step('Assert the cl-mock reflects the new status', async () => {
        // exitRequest only reports clStatus when ctx.clMockUrl was set (Task 1/3 wiring) —
        // asserting it proves the recipe layer and the mock lifecycle are actually connected.
        expect(result.clStatus).toBe('active_exiting');
        expect(process.env.CL_MOCK_URL).toBeTruthy();

        const res = await fetch(
          `${process.env.CL_MOCK_URL}/eth/v1/beacon/states/head/validators?id=${result.pubkey}`,
        );
        const body = await res.json();
        expect(body.data[0]?.status).toBe('active_exiting');
      });
    });
  },
);
