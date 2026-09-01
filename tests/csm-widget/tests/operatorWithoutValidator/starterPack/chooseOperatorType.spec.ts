import { expect } from '@playwright/test';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { qase } from 'playwright-qase-reporter/playwright';
import { OPERATOR_TYPE_METADATA } from 'tests/shared/consts/operatorTypes.const';
import { test } from '../../test.fixture';
import { PAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';

test.use({ secretPhrase: process.env.EMPTY_SECRET_PHRASE });

const DEF = OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_DEF];
const ICS = OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_ICS];
const IDVTC = OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_IDVTC];
// @todo: add 0x02 operator type metadata when it will be available in the SDK

const CARDS = ['def', 'ics', 'idvtc', '0x02'] as const;

const CARD_PARAMETERS: Record<(typeof CARDS)[number], RegExp[]> = {
  def: [
    /Node Operator reward:\s*All keys\s*3\.5%/,
    /Bond:\s*First key\s*2\.4\sETH\s*Subsequent keys\s*1\.3\sETH/,
    /Capital multiplier\s*up to 1\.75x/,
    /Withdrawal credential type\s*0x01/,
  ],
  ics: [
    /Node Operator reward:\s*First 16 keys\s*6%\s*Subsequent keys\s*3\.5%/,
    /Bond:\s*First key\s*1\.5\sETH\s*Subsequent keys\s*1\.3\sETH/,
    /Capital multiplier\s*up to 2\.36x/,
    /Withdrawal credential type\s*0x01/,
  ],
  idvtc: [
    /Node Operator reward:\s*First 64 keys\s*3\.5%\s*Subsequent keys\s*2%/,
    /Bond:\s*First key\s*1\.5\sETH\s*Subsequent keys\s*0\.5\sETH/,
    /Capital multiplier\s*up to 3x/,
    /Withdrawal credential type\s*0x01/,
  ],
  '0x02': [
    /Node Operator reward:\s*All keys\s*2%/,
    /Bond:\s*First key\s*32\.0\sETH\s*Subsequent keys\s*30\.0\sETH/,
    /Capital multiplier\s*up to 2\.6x/,
    /Withdrawal credential type\s*0x02/,
  ],
};

test.describe('New operator. Operator type modal', async () => {
  test.beforeAll(async ({ widgetService }) => {
    await test.step('Enable applications feature flag', async () => {
      await widgetService.setFeatureFlag('icsApplyForm', true);
    });
  });

  test.afterAll(async ({ widgetService }) => {
    await widgetService.setFeatureFlag('icsApplyForm', false);
  });

  test(
    qase(471, 'Should show four type cards with correct content'),
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

      await test.step('Verify 0x02 card', async () => {
        await expect(modal.wc02Card).toBeVisible();
        await expect(modal.wc02Card).toContainText('0x02');
        await expect(modal.wc02Card).toContainText('CSM 0x02');
        await expect(modal.getCardButton('0x02')).toContainText('Join now');
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
        await expect(widgetService.header.operatorTypeBadge).toContainText(
          DEF.short,
        );
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

      await test.step('0x02 card opens the create flow', async () => {
        await widgetService.mainPage.openOperatorTypeModal();
        await modal.getCardButton('0x02').click();
        await expect(widgetService.page).toHaveURL(/\/create\?type=0x02/);
        await expect(
          widgetService.page.getByText('Choose bond token'),
        ).toBeVisible();
        await expect(widgetService.header.operatorTypeBadge).toContainText(
          '0x02',
        );
      });
    },
  );

  // @todo: add a qase id when the case is created
  test('Should show 0x02 card content', async ({ widgetService }) => {
    const modal = widgetService.mainPage.operatorTypeModal;
    await widgetService.mainPage.openOperatorTypeModal();

    await test.step('Verify badge and name', async () => {
      await expect(modal.wc02Card).toBeVisible();
      await expect(modal.wc02Card).toContainText('0x02');
      await expect(modal.wc02Card).toContainText('CSM 0x02');
    });

    await test.step('Verify description', async () => {
      await expect(modal.wc02Card).toContainText(
        'Unlock the power of 0x02 withdrawal credentials to run validators with balances of up to 2048 ETH.',
      );
      await expect(modal.wc02Card).toContainText(
        'Run 0x02 alongside any other type (Default, ICS, or IDVTC) to stack their benefits.',
      );
    });

    await test.step('Verify button', async () => {
      await expect(modal.getCardButton('0x02')).toContainText('Join now');
    });
  });

  // @todo: add a qase id when the case is created
  test('Should show parameters on each card', async ({ widgetService }) => {
    const modal = widgetService.mainPage.operatorTypeModal;
    await widgetService.mainPage.openOperatorTypeModal();

    for (const type of CARDS) {
      await test.step(`Verify ${type} parameters`, async () => {
        const card = modal.getCard(type);

        for (const parameter of CARD_PARAMETERS[type]) {
          // Parameters are read from the contract, so wait for them to load
          await expect(card).toContainText(parameter, {
            timeout: PAGE_WAIT_TIMEOUT,
          });
        }
      });
    }
  });
});
