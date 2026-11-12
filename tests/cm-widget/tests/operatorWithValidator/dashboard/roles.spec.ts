import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { test } from '../../test.fixture';
import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { mnemonicToAccount } from 'viem/accounts';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { PRESETS } from 'tests/cm-widget/config/walletSetup';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { Tags } from 'tests/shared/consts/common.const';

test.use({ secretPhrase: PRESETS.ONLY_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.dashboard,
    feature: 'Operator',
    story: 'Operator header',
  }),
  () => {
    let matomoEventService: MatomoService;

    test.beforeEach(async ({ widgetConfig, widgetService }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.dashboardPage.open();
    });

    test(
      qase(127, 'Should correct display reward address information'),
      { tag: Tags.smoke },
      async ({ widgetService, widgetConfig, secretPhrase }) => {
        const { rewardsAddress } = widgetService.dashboardPage.operatorHeader;
        const currentAddress = mnemonicToAccount(secretPhrase).address;

        await test.step('Check reward address information', async () => {
          await expect(rewardsAddress).toContainText('Rewards:');
          await expect(rewardsAddress).toContainText(
            currentAddress.slice(0, 4),
          );
          await expect(rewardsAddress).toContainText(currentAddress.slice(-4));
        });

        await test.step('Check reward address etherscan link and Matomo event', async () => {
          const [etherscanPage] = await Promise.all([
            widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
            matomoEventService.waitForEvent(
              'e_n',
              'cm_widget_etherscan_address_link',
            ),
            rewardsAddress.getByTitle('View on etherscan').click(),
          ]);
          expect(etherscanPage.url()).toContain(
            `${widgetConfig.standConfig.networkConfig.scan}address/${currentAddress}`,
          );
        });
      },
    );

    test(
      qase(128, 'Should correct display manager address information'),
      async ({ widgetService, widgetConfig, secretPhrase }) => {
        const { managerAddress } = widgetService.dashboardPage.operatorHeader;
        const currentAddress = mnemonicToAccount(secretPhrase).address;

        await test.step('Check manager address information', async () => {
          await expect(managerAddress).toContainText('Manager:');
          await expect(managerAddress).toContainText(
            currentAddress.slice(0, 4),
          );
          await expect(managerAddress).toContainText(currentAddress.slice(-4));
        });

        await test.step('Check manager address etherscan link and Matomo event', async () => {
          const [etherscanPage] = await Promise.all([
            widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
            matomoEventService.waitForEvent(
              'e_n',
              'cm_widget_etherscan_address_link',
            ),
            managerAddress.getByTitle('View on etherscan').click(),
          ]);
          expect(etherscanPage.url()).toContain(
            `${widgetConfig.standConfig.networkConfig.scan}address/${currentAddress}`,
          );
        });
      },
    );

    test(
      qase(129, 'Should correct display empty rewards claimer'),
      async ({ widgetService }) => {
        const { claimerFlag } = widgetService.dashboardPage.operatorHeader;

        await test.step('Check claimer flag is absent', async () => {
          await widgetService.page.waitForLoadState('networkidle');
          await expect(claimerFlag).toHaveCount(0);
        });
      },
    );

    test(
      qase(130, 'Should correct display empty rewards splitter'),
      async ({ widgetService }) => {
        const { splittersFlag } = widgetService.dashboardPage.operatorHeader;

        await test.step('Check splitters flag is absent', async () => {
          await widgetService.page.waitForLoadState('networkidle');
          await expect(splittersFlag).toHaveCount(0);
        });
      },
    );

    test(
      qase(465, 'Should navigate to settings on header link click'),
      async ({ widgetService }) => {
        const { settingsLink } = widgetService.dashboardPage.operatorHeader;

        await test.step('Click settings link and check Matomo event', async () => {
          await Promise.all([
            matomoEventService.waitForEvent(
              'e_n',
              'cm_widget_dashboard_roles_section',
            ),
            settingsLink.click(),
          ]);
        });

        await test.step('Check navigation to settings page', async () => {
          await expect(
            widgetService.page,
            'Should navigate to settings page',
          ).toHaveURL(/\/settings$/);
        });
      },
    );
  },
);
