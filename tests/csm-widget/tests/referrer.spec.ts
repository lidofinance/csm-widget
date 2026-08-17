import { expect } from '@playwright/test';
import { REF_MAPPING } from 'consts/ref-mapping';
import { WelcomePage } from 'tests/csm-widget/pages';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from './test.fixture';

const [DAPPNODE, STEREUM] = REF_MAPPING;

test.describe('Visit with referrer', async () => {
  let matomoEventService: MatomoService;

  test.beforeEach(async ({ page, widgetConfig }) => {
    matomoEventService = new MatomoService(page, widgetConfig);
  });

  test('Should send Matomo event for an address and a partner ref', async ({
    page,
  }) => {
    const homePage = new WelcomePage(page);

    await test.step('Referrer passed as an address', async () => {
      await Promise.all([
        matomoEventService.waitForEvent('e_n', 'csm_widget_visit_referrer'),
        homePage.goto(`/?ref=${STEREUM.address}`),
      ]);

      expect(await homePage.getSessionStorageData('referrer')).toBe(
        JSON.stringify(STEREUM.address),
      );
    });

    await test.step(`Referrer passed as "${DAPPNODE.ref}"`, async () => {
      await Promise.all([
        matomoEventService.waitForEvent('e_n', 'csm_widget_visit_referrer'),
        homePage.goto(`/?ref=${DAPPNODE.ref}`),
      ]);

      expect(await homePage.getSessionStorageData('referrer')).toBe(
        JSON.stringify(DAPPNODE.address),
      );
    });
  });
});
