import { expect } from '@playwright/test';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Tags } from 'tests/shared/consts/common.const';
import { OFAC_MODAL_TEXT } from 'tests/shared/consts/texts.const';
import { TxModal } from 'tests/cm-widget/pages/elements/common/element.txProgressModal';
import { test } from '../test.fixture';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.EMPTY_OPERATOR_WITH_ALL_GATES.secretPhrase });

const VALID_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const OPERATOR_NAME = 'Test Operator';
const OPERATOR_DESCRIPTION = 'Test description';

test.describe(
  'Operator without validator. Address blacklist validation',
  { tag: [Tags.forked] },
  () => {
    let txModal: TxModal;

    test.beforeAll(async ({ widgetService }) => {
      txModal = new TxModal(widgetService.page);

      await test.step('Mock blacklisted wallet address', async () => {
        await widgetService.mockValidationAddressRequest();
      });
    });

    test.afterAll(async ({ widgetService }) => {
      await widgetService.page.unrouteAll();
    });

    test('Should show access denied modal when Node Operator is created', async ({
      widgetService,
    }) => {
      const { createNodeOperatorPage } = widgetService;

      await test.step('Go through the creation wizard', async () => {
        await createNodeOperatorPage.open();
        await createNodeOperatorPage.step1.fillForm(OPERATOR_TYPE.CM_PTO);
        await createNodeOperatorPage.step2.fillForm(
          VALID_ADDRESS,
          VALID_ADDRESS,
        );
        await createNodeOperatorPage.step3.fillForm(
          OPERATOR_NAME,
          OPERATOR_DESCRIPTION,
        );
      });

      await test.step('Click "Create Node Operator"', async () => {
        await createNodeOperatorPage.step4.createButton.click();
      });

      await test.step('Access denied modal is shown', async () => {
        await expect(txModal.modal).toContainText(OFAC_MODAL_TEXT);
      });
    });
  },
);
