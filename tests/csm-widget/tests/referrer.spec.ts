import { expect } from '@playwright/test';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { WelcomePage } from 'tests/csm-widget/pages';
import { Tags } from 'tests/shared/consts/common.const';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from './test.fixture';

const DAPPNODE_REF = 'dappnode';
const DAPPNODE_ADDRESS = '0x53390590476dC98860316e4B46Bb9842AF55efc4';
const STEREUM_ADDRESS = '0x3C3FF4C9d4390b6000743e0E00d8506e6566d96d';

type ReferrerCase = {
  name: string;
  referrer: string;
  expectedAddress: string;
};

const REFERRER_CASES: ReferrerCase[] = [
  {
    name: 'an address',
    referrer: STEREUM_ADDRESS,
    expectedAddress: STEREUM_ADDRESS,
  },
  {
    name: `"${DAPPNODE_REF}"`,
    referrer: DAPPNODE_REF,
    expectedAddress: DAPPNODE_ADDRESS,
  },
];

test.describe(
  ...suite({
    epic: EPIC.landing,
    story: 'Referrer',
    tag: [Tags.matomo],
  }),
  () => {
    let matomoEventService: MatomoService;

    test.beforeEach(async ({ page, widgetConfig }) => {
      matomoEventService = new MatomoService(page, widgetConfig);
    });

    REFERRER_CASES.forEach(({ name, referrer, expectedAddress }) => {
      test(`Should store ${name}`, async ({ page }) => {
        const welcomePage = new WelcomePage(page);

        await test.step('Open widget and send tracking event', async () => {
          await Promise.all([
            matomoEventService.waitForEvent('e_n', 'csm_widget_visit_referrer'),
            welcomePage.goto(`/?ref=${referrer}`),
          ]);
        });

        await test.step('Verify stored referrer', async () => {
          expect(await welcomePage.getSessionStorageData('referrer')).toBe(
            JSON.stringify(expectedAddress),
          );
        });
      });
    });
  },
);
