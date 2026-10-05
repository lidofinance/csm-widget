import { expect } from '@playwright/test';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const VANOM_DASHBOARD_URL =
  'https://app.hex.tech/8dedcd99-17f4-49d8-944e-4857a355b90a/app/3f7d6967-3ef6-4e69-8f7b-d02d903f045b/latest';
const VANOM_HOST = 'app.hex.tech';

test.describe(
  ...suite({
    epic: EPIC.surveys,
    story: 'Sign in',
    tag: [Tags.matomo],
  }),
  () => {
    let matomoEventService: MatomoService;

    test.beforeAll(async ({ widgetService }) => {
      await test.step('Enable surveys feature flag', async () => {
        await widgetService.setFeatureFlag('surveysSetupEnabled', true);
      });
    });

    test.afterAll(async ({ widgetService }) => {
      await widgetService.setFeatureFlag('surveysSetupEnabled', false);
    });

    test.beforeEach(async ({ widgetService, widgetConfig }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      await widgetService.surveysPage.open();
    });

    test('Should open VaNOM dashboard', async ({ widgetService }) => {
      const { surveysPage } = widgetService;

      await test.step('Verify link', async () => {
        await expect(surveysPage.vanomDashboardLink).toHaveAttribute(
          'href',
          VANOM_DASHBOARD_URL,
        );
      });

      await test.step('Open resource and send tracking event', async () => {
        const [openedPage] = await Promise.all([
          surveysPage.waitForPage(PAGE_WAIT_TIMEOUT),
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_vanom_dashboard_link',
          ),
          surveysPage.vanomDashboardLink.click(),
        ]);

        expect(openedPage.url()).toContain(VANOM_HOST);
        await openedPage.close();
      });
    });
  },
);
