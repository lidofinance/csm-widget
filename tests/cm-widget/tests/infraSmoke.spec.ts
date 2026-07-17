import { expect } from '@playwright/test';
import { test } from './test.fixture';
import { Tags } from 'tests/shared/consts/common.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe('sm-lab infra smoke', { tag: [Tags.forked] }, () => {
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

  test('Should add keys via recipes', async ({
    forkActionService,
    widgetService,
  }) => {
    const noId = await test.step('Get operator id', async () => {
      await widgetService.keysPage.submitPage.open();
      return widgetService.extractNodeOperatorId();
    });

    await test.step('Add 2 keys and get pubkeys back', async () => {
      const pubkeys = await forkActionService.addKeys(noId, 2);
      expect(pubkeys).toHaveLength(2);
      expect(pubkeys[0]).toMatch(/^0x[0-9a-f]{96}$/);
    });
  });
});
