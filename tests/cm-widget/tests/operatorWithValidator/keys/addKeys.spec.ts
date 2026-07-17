import { expect } from '@playwright/test';
import { Tags, TokenSymbol } from 'tests/shared/consts/common.const';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { KeysGeneratorService } from 'tests/shared/services/keysGenerator.service';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../../test.fixture';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.ONLY_OPERATOR.secretPhrase });

test.describe(
  'Operator with validator. Keys. Add keys.',
  { tag: [Tags.forked, Tags.performTX] },
  () => {
    let snapshotId: string;
    let matomoEventService: MatomoService;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeEach(async ({ cmSDK, widgetConfig, widgetService }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      snapshotId = await cmSDK.evmSnapshot();
      await widgetService.keysPage.submitPage.open();
    });

    test.afterEach(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test('Should add keys successfully', async ({ widgetService }) => {
      const { submitPage } = widgetService.keysPage;
      const keys = await new KeysGeneratorService({
        isCM: true,
      }).generateKeys();

      await test.step('Submit keys and check Matomo start event', async () => {
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'cm_widget_submit_form_add_keys_start',
          ),
          submitPage.submitKeys(keys, TokenSymbol.ETH),
        ]);
      });

      await test.step('Confirm transaction and check Matomo success event', async () => {
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'cm_widget_submit_form_add_keys_success',
            { timeout: STAGE_WAIT_TIMEOUT },
          ),
          widgetService.walletPage.confirmTx(),
        ]);
      });

      await test.step('Success message is shown', async () => {
        await expect(
          widgetService.page.getByText('Uploading operation was successful.'),
        ).toBeVisible({ timeout: STAGE_WAIT_TIMEOUT });
      });
    });
  },
);
