import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { test } from '../../../test.fixture';
import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup';
import { Tags } from 'tests/shared/consts/common.const';
import { STAKE_TOOLTIPS } from 'shared/components/stake-allocation/labels';
import { MatomoService } from 'tests/shared/services/matomo.service';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.dashboard,
    feature: 'Keys',
    story: 'Stake & keys',
  }),
  () => {
    let matomoEventService: MatomoService;

    test.beforeEach(async ({ widgetConfig, widgetService }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.dashboardPage.open();
    });

    test(
      qase(150, 'Should display Stake title with Keys link'),
      async ({ widgetService }) => {
        const { stakeCard } = widgetService.dashboardPage;

        await test.step('Check card title is visible', async () => {
          await expect(stakeCard.root).toBeVisible();
          await expect(stakeCard.root).toContainText('Stake');
        });

        await test.step('Check Keys link is present', async () => {
          await expect(stakeCard.link).toBeVisible();
          await expect(stakeCard.link).toContainText('Keys');
        });
      },
    );

    test(
      qase(151, 'Should display all three stake columns with correct labels'),
      async ({ widgetService }) => {
        const { stakeCard } = widgetService.dashboardPage;

        const columns = [
          { locator: stakeCard.stakeColumnActive, label: 'Active, ETH' },
          {
            locator: stakeCard.stakeColumnDepositable,
            label: 'Depositable, ETH',
          },
          { locator: stakeCard.stakeColumnTsa, label: 'TSA, ETH' },
        ];

        for (const { locator, label } of columns) {
          await test.step(`Check "${label}" column`, async () => {
            await expect(locator).toBeVisible();
            await expect(locator).toContainText(label);
          });
        }
      },
    );

    test(
      qase(152, 'Should display stake column tooltips'),
      async ({ widgetService }) => {
        const { stakeCard } = widgetService.dashboardPage;

        const columns = [
          {
            info: stakeCard.stakeColumnActiveInfo,
            label: 'Active',
            tooltip: STAKE_TOOLTIPS.active,
          },
          {
            info: stakeCard.stakeColumnDepositableInfo,
            label: 'Depositable',
            tooltip: STAKE_TOOLTIPS.depositable,
          },
          {
            info: stakeCard.stakeColumnTsaInfo,
            label: 'TSA',
            tooltip: STAKE_TOOLTIPS.tsa,
          },
        ];

        for (const { info, label, tooltip } of columns) {
          await test.step(`Check tooltip for "${label}" column`, async () => {
            await info.hover();
            await expect(widgetService.page.getByRole('tooltip')).toContainText(
              tooltip,
            );
            await widgetService.dashboardPage.closeTooltip();
          });
        }
      },
    );

    test(
      qase(153, 'Should display correct depositable keys count from chain'),
      { tag: [Tags.smoke] },
      async ({ widgetService, cmSDK }) => {
        const { stakeCard } = widgetService.dashboardPage;

        const nodeOperatorId = await widgetService.extractNodeOperatorId();
        const { depositableKeys } =
          await cmSDK.getNodeOperatorInfo(nodeOperatorId);
        const expectedText =
          depositableKeys === 1 ? '1 key' : `${depositableKeys} keys`;

        await expect(
          stakeCard.stakeColumnDepositableKeys,
          `Depositable keys count should show "${expectedText}"`,
        ).toHaveText(expectedText);
      },
    );

    test(
      qase(154, 'Should navigate to keys page on card link click'),
      async ({ widgetService }) => {
        const { stakeCard } = widgetService.dashboardPage;

        await test.step('Click section header link and check Matomo event', async () => {
          await Promise.all([
            matomoEventService.waitForEvent(
              'e_n',
              'cm_widget_dashboard_keys_section',
            ),
            stakeCard.link.click(),
          ]);
        });

        await test.step('Check navigation to keys page', async () => {
          await expect(
            widgetService.page,
            'Should navigate to keys page',
          ).toHaveURL(/\/keys/);
        });
      },
    );
  },
);
