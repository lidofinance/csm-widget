import { test } from './test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { expect, Page } from '@playwright/test';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Tags } from 'tests/shared/consts/common.const';
import { OPERATOR_TYPE_METADATA } from 'tests/shared/consts/operatorTypes.const';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { MatomoService } from 'tests/shared/services/matomo.service';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

const DEF = OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_DEF];
const ICS = OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_ICS];
const IDVTC = OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_IDVTC];

const OPERATOR_TYPES_DOCS_URL =
  'https://docs.lido.fi/staking-modules/csm/join-csm/';

test.describe('New operator. Operator type modal', async () => {
  let openedPage: Page | undefined;

  test.beforeAll(async ({ widgetService }) => {
    await test.step('Enable applications feature flag', async () => {
      await widgetService.setFeatureFlag('icsApplyForm', true);
    });
  });

  test.afterAll(async ({ widgetService }) => {
    await widgetService.setFeatureFlag('icsApplyForm', false);
  });

  test.afterEach(async () => {
    await openedPage?.close();
  });

  test(
    qase(471, 'Should show type cards with correct content'),
    async ({ widgetService }) => {
      const modal = widgetService.mainPage.operatorTypeModal;
      await widgetService.mainPage.openOperatorTypeModal();

      await test.step('Verify modal header', async () => {
        await expect(modal.title).toBeVisible();
        await expect(modal.modal).toContainText('Check out details about');
        await expect(modal.parametersDocsLink).toBeVisible();
      });

      await test.step('Verify DEF card', async () => {
        await expect(modal.defCard).toBeVisible();
        await expect(modal.defCard).toContainText(DEF.short);
        await expect(modal.defCard).toContainText(DEF.name);
        await expect(modal.getCardButton('def')).toContainText('Join now');
      });

      await test.step('Verify ICS card', async () => {
        await expect(modal.icsCard).toBeVisible();
        await expect(modal.icsCard).toContainText(ICS.short);
        await expect(modal.icsCard).toContainText(ICS.name);
        await expect(modal.getCardButton('ics')).toContainText(
          `Apply for ${ICS.short}`,
        );
      });

      await test.step('Verify IDVTC card', async () => {
        await expect(modal.idvtcCard).toBeVisible();
        await expect(modal.idvtcCard).toContainText(IDVTC.short);
        await expect(modal.idvtcCard).toContainText(IDVTC.name);
        await expect(modal.getCardButton('idvtc')).toContainText(
          `Apply for ${IDVTC.short}`,
        );
      });
    },
  );

  test(
    qase(472, 'Should navigate to the correct flow from each card'),
    async ({ widgetService }) => {
      const modal = widgetService.mainPage.operatorTypeModal;

      await test.step('DEF card opens the create flow', async () => {
        await widgetService.mainPage.openOperatorTypeModal();
        await modal.getCardButton('def').click();
        await expect(widgetService.page).toHaveURL(/\/create/);
        await expect(
          widgetService.page.getByText('Choose bond token'),
        ).toBeVisible();
      });

      await test.step('ICS card opens the ICS apply page', async () => {
        await widgetService.mainPage.openOperatorTypeModal();
        await modal.getCardButton('ics').click();
        await expect(widgetService.page).toHaveURL(/\/type\/ics-apply/);
        await expect(widgetService.operatorType.pageTitle).toHaveText(
          'Apply for Identified Community Stakers List',
        );
      });

      await test.step('IDVTC card opens the IDVTC apply page', async () => {
        await widgetService.mainPage.openOperatorTypeModal();
        await modal.getCardButton('idvtc').click();
        await expect(widgetService.page).toHaveURL(/\/type\/idvtc-apply/);
        await expect(widgetService.operatorType.pageTitle).toHaveText(
          'Apply for Identified DVT Cluster',
        );
      });
    },
  );

  test(
    'Should open operator types docs',
    { tag: [Tags.matomo] },
    async ({ widgetService, widgetConfig }) => {
      const modal = widgetService.mainPage.operatorTypeModal;
      const matomoEventService = new MatomoService(
        widgetService.page,
        widgetConfig,
      );

      await widgetService.mainPage.openOperatorTypeModal();

      await test.step('Link is visible with correct href', async () => {
        await expect(modal.parametersDocsLink).toBeVisible();
        await expect(modal.parametersDocsLink).toHaveAttribute(
          'href',
          `${OPERATOR_TYPES_DOCS_URL}#node-operator-types`,
        );
      });

      await test.step('Click to link and waiting for open resource', async () => {
        const [newPage] = await Promise.all([
          widgetService.mainPage.waitForPage(PAGE_WAIT_TIMEOUT),
          matomoEventService.waitForEvent(
            'e_n',
            'csm_widget_operator_types_docs_link',
          ),
          modal.parametersDocsLink.click(),
        ]);
        openedPage = newPage;

        expect(newPage.url()).toContain(OPERATOR_TYPES_DOCS_URL);
      });
    },
  );
});
