import { test } from '../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { qase } from 'playwright-qase-reporter/playwright';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.dashboard,
    feature: 'Bond & Rewards',
    story: 'Section navigation',
  }),
  async () => {
    let matomoEventService: MatomoService;

    test.beforeEach(async ({ widgetService, widgetConfig }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.dashboardPage.open();
    });

    test(
      qase(138, 'Should open Bond & Rewards page after click to section arrow'),
      async ({ widgetService }) => {
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_dashboard_bond_section',
          ),
          widgetService.page.waitForURL('**/bond/claim'),
          widgetService.dashboardPage.bondRewards.sectionHeaderLink.click(),
        ]);
      },
    );
  },
);
