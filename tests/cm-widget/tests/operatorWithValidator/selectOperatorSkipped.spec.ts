import { expect } from '@playwright/test';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.ONLY_OPERATOR.secretPhrase });

const EXPECTED_ID = PRESETS.ONLY_OPERATOR.noIds[0];

test.describe(
  'Operator with validator. Select modal.',
  { tag: [Tags.forked] },
  () => {
    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test('Should skip operator selection', async ({ widgetService }) => {
      await test.step('Drop the cached selection and reload', async () => {
        await widgetService.selectOperatorModal.forgetSelectionAndReload();
      });

      await test.step('The widget resolves the operator on its own', async () => {
        await expect(widgetService.header.switchOperatorButton).toBeVisible({
          timeout: PAGE_WAIT_TIMEOUT,
        });
        await expect(widgetService.selectOperatorModal.modal).toBeHidden();
        expect(await widgetService.extractNodeOperatorId()).toBe(EXPECTED_ID);
      });
    });
  },
);
