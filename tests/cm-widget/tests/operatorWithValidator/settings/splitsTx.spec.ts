import { expect } from '@playwright/test';
import { Tags } from 'tests/shared/consts/common.const';
import {
  LOW_TIMEOUT,
  PAGE_WAIT_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
} from 'tests/shared/consts/timeouts';
import { generateAddress } from 'tests/shared/helpers/accountData';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../../test.fixture';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  'Settings. Splits. Transaction.',
  { tag: [Tags.forked, Tags.performTX] },
  () => {
    let snapshotId: string;
    let matomoEventService: MatomoService;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await test.step('Set up: add excess bond and report rewards', async () => {
        await widgetService.settingsPage.splitsPage.open();
        const noId = await widgetService.extractNodeOperatorId();
        await forkActionService.addBond(noId, '2');
        await forkActionService.reportRewards();
      });
    });

    test.beforeEach(async ({ widgetConfig, widgetService }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.settingsPage.splitsPage.open();
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test('Should save splits and send Matomo form events', async ({
      widgetService,
    }) => {
      const { splitsPage } = widgetService.settingsPage;

      await test.step('Configure a single 100% split', async () => {
        await splitsPage.clickSetupSplits();
        await splitsPage.addSplit(0, {
          address: generateAddress(),
          share: '100',
        });
        // share is stored as bigint and totalShare recomputed in async effect
        await widgetService.page.waitForTimeout(LOW_TIMEOUT);
      });

      await test.step('Save splits and check Matomo start event', async () => {
        await expect(splitsPage.saveSplitsButton).toBeEnabled();
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'cm_widget_submit_form_splits_start',
          ),
          splitsPage.saveSplitsButton.click(),
        ]);
      });

      await test.step('Confirm splitter configuration in modal', async () => {
        await widgetService.page
          .getByRole('button', { name: 'Confirm', exact: true })
          .click();
      });

      await test.step('Confirm transaction and check Matomo success event', async () => {
        await widgetService.page.waitForSelector(
          'text=Confirm this transaction in your wallet',
          { timeout: PAGE_WAIT_TIMEOUT },
        );
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'cm_widget_submit_form_splits_success',
            { timeout: STAGE_WAIT_TIMEOUT },
          ),
          widgetService.walletPage.confirmTx(),
        ]);
      });

      await test.step('Success message is shown', async () => {
        await expect(
          widgetService.page.getByText(
            'Fee splitter configuration has been updated',
          ),
        ).toBeVisible({ timeout: STAGE_WAIT_TIMEOUT });
      });
    });
  },
);
