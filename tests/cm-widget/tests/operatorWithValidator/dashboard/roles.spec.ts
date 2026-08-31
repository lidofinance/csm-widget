/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { test } from '../../test.fixture';
import { mnemonicToAccount } from 'viem/accounts';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { Tags } from 'tests/shared/consts/common.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';
import { MatomoService } from 'tests/shared/services/matomo.service';

test.use({ secretPhrase: PRESETS.ONLY_OPERATOR.secretPhrase });

test.describe('Dashboard. Roles.', { tag: [Tags.forked] }, () => {
  let matomoEventService: MatomoService;

  test.beforeEach(async ({ widgetConfig, widgetService }) => {
    matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    await widgetService.dashboardPage.open();
  });

  test(
    qase(127, 'Should correct display reward address information'),
    { tag: [Tags.matomo] },
    async ({ widgetService, widgetConfig, secretPhrase }) => {
      const rewardAddressRow =
        widgetService.dashboardPage.rolesSection.rewardAddressRow;
      const currentAddress = mnemonicToAccount(secretPhrase).address;

      await test.step('Check reward address information', async () => {
        await expect(rewardAddressRow.locator('p')).toContainText(
          'Rewards Address',
        );
        await expect(rewardAddressRow.getByTestId('youChip')).toBeVisible();
        await expect(
          rewardAddressRow.getByTestId('ownerChip'),
        ).not.toBeVisible();
        await expect(
          rewardAddressRow.getByTestId('addressContainer'),
        ).toContainText(currentAddress);
      });

      await test.step('Check reward address etherscan link and Matomo event', async () => {
        const [etherscanPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          matomoEventService.waitForEvent(
            'e_n',
            'cm_widget_etherscan_address_link',
          ),
          rewardAddressRow.getByTestId('etherscanLink').click(),
        ]);
        expect(etherscanPage.url()).toContain(
          `${widgetConfig.standConfig.networkConfig.scan}address/${currentAddress}`,
        );
      });
    },
  );

  test(
    qase(128, 'Should correct display manager address information'),
    { tag: [Tags.matomo] },
    async ({ widgetService, widgetConfig, secretPhrase }) => {
      const managerAddressRow =
        widgetService.dashboardPage.rolesSection.managerAddressRow;
      const currentAddress = mnemonicToAccount(secretPhrase).address;

      await test.step('Check manager address information', async () => {
        await expect(managerAddressRow.locator('p')).toContainText(
          'Manager Address',
        );
        await expect(managerAddressRow.getByTestId('youChip')).toBeVisible();
        await expect(managerAddressRow.getByTestId('ownerChip')).toBeVisible();
        await expect(
          managerAddressRow.getByTestId('addressContainer'),
        ).toContainText(currentAddress);
      });

      await test.step('Check manager address etherscan link and Matomo event', async () => {
        const [etherscanPage] = await Promise.all([
          widgetService.dashboardPage.waitForPage(PAGE_WAIT_TIMEOUT),
          matomoEventService.waitForEvent(
            'e_n',
            'cm_widget_etherscan_address_link',
          ),
          managerAddressRow.getByTestId('etherscanLink').click(),
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
      const claimerAddressRow =
        widgetService.dashboardPage.rolesSection.claimerAddressRow;
      await test.step('Check reward claimer information', async () => {
        await expect(claimerAddressRow.locator('p')).toContainText(
          'Rewards claimer',
        );
        await expect(
          claimerAddressRow.getByRole('button', { name: 'Set up' }),
        ).toBeVisible();
      });

      await test.step('Check reward address etherscan link', async () => {
        await claimerAddressRow.getByRole('button', { name: 'Set up' }).click();
        await widgetService.page.waitForURL('**/settings/claimer', {
          timeout: PAGE_WAIT_TIMEOUT,
        });
      });
    },
  );

  test(
    qase(130, 'Should correct display empty rewards splitter'),
    async ({ widgetService }) => {
      const feeSplitsRow =
        widgetService.dashboardPage.rolesSection.feeSplitsRow;
      await test.step('Check reward splitter information', async () => {
        await expect(feeSplitsRow.locator('p').first()).toContainText(
          'Rewards splitter',
        );
        await expect(
          feeSplitsRow.getByRole('button', { name: 'Set up' }),
        ).toBeVisible();
      });

      await test.step('Check reward address etherscan link', async () => {
        await feeSplitsRow.getByRole('button', { name: 'Set up' }).click();
        await widgetService.page.waitForURL('**/settings/splits', {
          timeout: PAGE_WAIT_TIMEOUT,
        });
      });
    },
  );

  test(
    'Should navigate to roles settings on header link click',
    { tag: [Tags.matomo] },
    async ({ widgetService }) => {
      const { rolesSection } = widgetService.dashboardPage;

      await test.step('Click section header link and check Matomo event', async () => {
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'cm_widget_dashboard_roles_section',
          ),
          rolesSection.sectionHeaderLink.click(),
        ]);
      });

      await test.step('Check navigation to roles settings page', async () => {
        await expect(
          widgetService.page,
          'Should navigate to roles settings page',
        ).toHaveURL(/\/settings\/roles/);
      });
    },
  );
});
