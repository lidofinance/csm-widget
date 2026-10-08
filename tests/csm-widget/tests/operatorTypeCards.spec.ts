import { test } from './test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { OPERATOR_TYPE_METADATA } from 'tests/shared/consts/operatorTypes.const';
import { Tags } from 'tests/shared/consts/common.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';

test.use({ secretPhrase: PRESETS.EMPTY_ADDRESS.secretPhrase });

const CSM01 = OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_DEF];
const ICS = OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_ICS];
const IDVTC = OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_IDVTC];
const OPERATOR_TYPES_DOCS_URL =
  'https://docs.lido.fi/staking-modules/csm/join-csm/#node-operator-types';
// Lido Docs redirects the legacy CSM page to the shared Node Operators page.
const OPERATOR_TYPES_DOCS_DESTINATION =
  /^https:\/\/docs\.lido\.fi\/staking-modules\/node-operators\/?#node-operator-types$/;

test.describe(
  ...suite({
    epic: EPIC.operatorType,
    // Cards cover all operator types, not a single feature
    feature: null,
    story: 'Type cards',
  }),
  async () => {
    let matomoEventService: MatomoService;

    test.beforeAll(async ({ widgetService }) => {
      await test.step('Enable applications feature flag', async () => {
        await widgetService.setFeatureFlag('icsApplyForm', true);
      });
    });

    test.afterAll(async ({ widgetService }) => {
      await widgetService.setFeatureFlag('icsApplyForm', false);
    });

    test.beforeEach(async ({ widgetService, widgetConfig }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
    });

    test(
      qase(471, 'Should show type cards with correct content'),
      async ({ widgetService }) => {
        const cards = widgetService.mainPage.operatorTypeCards;
        await widgetService.mainPage.openCreateOperator();

        await test.step('Verify page header', async () => {
          await expect(
            widgetService.page.getByText('Check out details about'),
          ).toBeVisible();
          await expect(cards.parametersDocsLink).toBeVisible();
        });

        await test.step('Verify 0x01 card', async () => {
          await expect(cards.csm01Card).toBeVisible();
          await expect(cards.csm01Card).toContainText(CSM01.short);
          await expect(cards.csm01Card).toContainText(CSM01.name);
          await expect(cards.getCardButton('0x01')).toContainText('Join now');
        });

        await test.step('Verify ICS card', async () => {
          await expect(cards.icsCard).toBeVisible();
          await expect(cards.icsCard).toContainText(ICS.short);
          await expect(cards.icsCard).toContainText(ICS.name);
          await expect(cards.getCardButton('ics')).toContainText(
            `Apply for ${ICS.short}`,
          );
        });

        await test.step('Verify IDVTC card', async () => {
          await expect(cards.idvtcCard).toBeVisible();
          await expect(cards.idvtcCard).toContainText(IDVTC.short);
          await expect(cards.idvtcCard).toContainText(IDVTC.name);
          await expect(cards.getCardButton('idvtc')).toContainText(
            `Apply for ${IDVTC.short}`,
          );
        });
      },
    );

    test(
      qase(472, 'Should navigate to the correct flow from each card'),
      async ({ widgetService }) => {
        const cards = widgetService.mainPage.operatorTypeCards;

        await test.step('0x01 card opens the create flow', async () => {
          await widgetService.mainPage.openCreateOperator();
          await cards.getCardButton('0x01').click();
          await expect(widgetService.page).toHaveURL(/\/create/);
          await expect(
            widgetService.page.getByText('Choose bond token'),
          ).toBeVisible();
        });

        await test.step('ICS card opens the ICS apply page', async () => {
          await widgetService.mainPage.openCreateOperator();
          await cards.getCardButton('ics').click();
          await expect(widgetService.page).toHaveURL(/\/type\/ics-apply/);
          await expect(widgetService.operatorType.pageTitle).toHaveText(
            'Apply for Identified Community Stakers List',
          );
        });

        await test.step('IDVTC card opens the IDVTC apply page', async () => {
          await widgetService.mainPage.openCreateOperator();
          await cards.getCardButton('idvtc').click();
          await expect(widgetService.page).toHaveURL(/\/type\/idvtc-apply/);
          await expect(widgetService.operatorType.pageTitle).toHaveText(
            'Apply for Identified DVT Cluster',
          );
        });
      },
    );

    test(
      qase(564, 'Should open operator types docs'),
      { tag: [Tags.matomo] },
      async ({ widgetService }) => {
        const cards = widgetService.mainPage.operatorTypeCards;

        await widgetService.mainPage.openCreateOperator();

        await test.step('Verify link', async () => {
          await expect(cards.parametersDocsLink).toHaveAttribute(
            'href',
            OPERATOR_TYPES_DOCS_URL,
          );
        });

        await test.step('Open resource and send tracking event', async () => {
          const [openedPage] = await Promise.all([
            widgetService.mainPage.waitForPage(PAGE_WAIT_TIMEOUT),
            matomoEventService.waitForEvent(
              'e_n',
              'csm_widget_operator_types_docs_link',
            ),
            cards.parametersDocsLink.click(),
          ]);

          try {
            await expect(openedPage).toHaveURL(OPERATOR_TYPES_DOCS_DESTINATION);
          } finally {
            await openedPage.close();
          }
        });
      },
    );
  },
);
