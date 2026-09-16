import { test } from '../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { qase } from 'playwright-qase-reporter/playwright';
import { MatomoService } from 'tests/shared/services/matomo.service';

test.describe(
  ...suite({
    epic: EPIC.dashboard,
    // a single spec on its own section, so no feature level
    feature: null,
    story: 'Keys section',
  }),
  async () => {
    let matomoEventService: MatomoService;

    test.beforeEach(async ({ widgetService, widgetConfig }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.dashboardPage.open();
    });

    test(
      qase(422, 'Should open Keys page after click to section arrow'),
      async ({ widgetService }) => {
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_dashboard_keys_section',
          ),
          widgetService.page.waitForURL('**/keys/view'),
          widgetService.dashboardPage.keysSection.sectionHeaderLink.click(),
        ]);
      },
    );
  },
);
