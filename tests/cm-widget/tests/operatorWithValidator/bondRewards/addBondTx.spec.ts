import { expect } from '@playwright/test';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { Tags } from 'tests/shared/consts/common.const';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../../test.fixture';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.ONLY_OPERATOR.secretPhrase });

test.describe(
  'Bond & Rewards. Add bond. Transaction.',
  { tag: [Tags.forked, Tags.matomo] },
  () => {
    let snapshotId: string;
    let matomoEventService: MatomoService;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeEach(async ({ cmSDK, widgetConfig, widgetService }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      snapshotId = await cmSDK.evmSnapshot();
      await widgetService.bondRewardsPage.addBond.open();
    });

    test.afterEach(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test(
      'Should add bond and send form events',
      { tag: [Tags.smoke] },
      async ({ widgetService }) => {
        const { addBond } = widgetService.bondRewardsPage;

        await test.step('Choose ETH and fill amount', async () => {
          await addBond.selectBondToken(TOKENS.eth).click();
          await addBond.amountInput.fill('0.1');
          await expect(addBond.addBondButton).toBeEnabled();
        });

        await test.step('Add bond and check Matomo start event', async () => {
          await Promise.all([
            matomoEventService.waitForEvent(
              'e_n',
              'cm_widget_submit_form_add_bond_start',
            ),
            addBond.addBondButton.click(),
          ]);
        });

        await widgetService.confirmOperatorModal.confirm();

        await test.step('Confirm transaction and check Matomo success event', async () => {
          await widgetService.page.waitForSelector(
            'text=Confirm this transaction in your wallet',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
          await Promise.all([
            matomoEventService.waitForEvent(
              'e_n',
              'cm_widget_submit_form_add_bond_success',
              { timeout: STAGE_WAIT_TIMEOUT },
            ),
            widgetService.walletPage.confirmTx(),
          ]);
        });

        await test.step('Success message is shown', async () => {
          await expect(
            widgetService.page.getByText(
              'Adding Bond operation was successful',
            ),
          ).toBeVisible({ timeout: STAGE_WAIT_TIMEOUT });
        });
      },
    );
  },
);
