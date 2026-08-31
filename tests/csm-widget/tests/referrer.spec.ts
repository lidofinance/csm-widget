import { expect } from '@playwright/test';
import { REF_MAPPING } from 'consts/ref-mapping';
import { Tags } from 'tests/shared/consts/common.const';
import { WelcomePage } from 'tests/csm-widget/pages';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from './test.fixture';

const [DAPPNODE, STEREUM] = REF_MAPPING;

type ReferrerCase = {
  name: string;
  ref: string;
  expectedAddress: string;
};

const REFERRER_CASES: ReferrerCase[] = [
  {
    name: 'an address',
    ref: STEREUM.address,
    expectedAddress: STEREUM.address,
  },
  {
    name: `"${DAPPNODE.ref}"`,
    ref: DAPPNODE.ref,
    expectedAddress: DAPPNODE.address,
  },
];

test.describe('Visit with referrer', { tag: [Tags.matomo] }, async () => {
  let matomoEventService: MatomoService;

  test.beforeEach(async ({ page, widgetConfig }) => {
    matomoEventService = new MatomoService(page, widgetConfig);
  });

  REFERRER_CASES.forEach(({ name, ref, expectedAddress }) => {
    test(`Should send event when passed as ${name}`, async ({ page }) => {
      const homePage = new WelcomePage(page);

      await Promise.all([
        matomoEventService.waitForEvent('e_n', 'csm_widget_visit_referrer'),
        homePage.goto(`/?ref=${ref}`),
      ]);

      expect(await homePage.getSessionStorageData('referrer')).toBe(
        JSON.stringify(expectedAddress),
      );
    });
  });
});
