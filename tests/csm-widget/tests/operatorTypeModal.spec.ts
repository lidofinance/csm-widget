import { test } from './test.fixture';
import { expect } from '@playwright/test';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { OPERATOR_TYPE_METADATA } from 'tests/shared/consts/operatorTypes.const';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

const DEF = OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_DEF];
const ICS = OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_ICS];
const IDVTC = OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_IDVTC];

test.describe('New operator. Operator type modal', async () => {
  test.beforeAll(async ({ widgetService }) => {
    await test.step('Enable applications feature flag', async () => {
      await widgetService.setFeatureFlag('icsApplyForm', true);
    });
  });

  test.afterAll(async ({ widgetService }) => {
    await widgetService.setFeatureFlag('icsApplyForm', false);
  });

  test('Should show three type cards with correct content', async ({
    widgetService,
  }) => {
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
  });

  test('Should navigate to the correct flow from each card', async ({
    widgetService,
  }) => {
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
  });
});
