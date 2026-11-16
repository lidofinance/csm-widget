/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { qase } from 'playwright-qase-reporter/playwright';
import { Tags } from 'tests/shared/consts/common.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup';
import { MatomoService } from 'tests/shared/services/matomo.service';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.dashboard,
    feature: 'Bond & Rewards',
    story: 'Bond balance',
  }),
  () => {
    let snapshotId: string;
    let noId: number;
    let matomoEventService: MatomoService;

    test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await test.step('Set up: add excess bond and report rewards', async () => {
        await widgetService.dashboardPage.open();
        noId = await widgetService.extractNodeOperatorId();
        await forkActionService.addBond(noId, '2');
      });
    });

    test.beforeEach(async ({ widgetConfig, widgetService }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.dashboardPage.open();
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    test(
      qase(134, 'Should show SDK bond on balance card'),
      { tag: [Tags.smoke] },
      async ({ widgetService, cmSDK }) => {
        const { balanceCard } = widgetService.dashboardPage;

        const bondSummary = await cmSDK.getBondSummary(noId);

        await test.step('Verify total bond stETH value', async () => {
          await expect(balanceCard.commonBalance).toHaveText(/\d/, {
            timeout: 20000,
          });
          const text = await balanceCard.commonBalance.textContent();
          expect(parseFloat((text ?? '0').replace(/,/g, ''))).toBeCloseTo(
            parseFloat(bondSummary.current),
            3,
          );
        });

        await test.step('Verify USD value is shown', async () => {
          await expect(balanceCard.root).toContainText(/\$\d[\d,]*(\.\d{2})?/);
        });
      },
    );

    test(
      qase(472, 'Should navigate to bond page on card link click'),
      async ({ widgetService }) => {
        const { balanceCard } = widgetService.dashboardPage;

        await test.step('Click section header link and check Matomo event', async () => {
          await Promise.all([
            matomoEventService.waitForEvent(
              'e_n',
              'cm_widget_dashboard_bond_section',
            ),
            balanceCard.link.click(),
          ]);
        });

        await test.step('Check navigation to bond page', async () => {
          await expect(
            widgetService.page,
            'Should navigate to bond page',
          ).toHaveURL(/\/bond/);
        });
      },
    );
  },
);
