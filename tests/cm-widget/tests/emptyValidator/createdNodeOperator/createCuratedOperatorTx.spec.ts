import { expect } from '@playwright/test';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Tags } from 'tests/shared/consts/common.const';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { MatomoService } from 'tests/shared/services/matomo.service';
import { test } from '../../test.fixture';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';

test.use({ secretPhrase: PRESETS.EMPTY_OPERATOR_WITH_ALL_GATES.secretPhrase });

const VALID_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const OPERATOR_NAME = 'Test Operator';
const OPERATOR_DESCRIPTION = 'Test description';

test.describe(
  'Create curated operator. Transaction.',
  { tag: [Tags.forked, Tags.smoke] },
  () => {
    let snapshotId: string;
    let matomoEventService: MatomoService;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeEach(async ({ evmNode, widgetConfig, widgetService }) => {
      matomoEventService = new MatomoService(widgetService.page, widgetConfig);
      snapshotId = await evmNode.snapshot();

      await test.step('Fund the account so it has ETH for gas', async () => {
        await evmNode.setBalance(
          PRESETS.EMPTY_OPERATOR_WITH_ALL_GATES.address,
          100,
        );
      });

      await test.step('Go through the creation wizard', async () => {
        await widgetService.createNodeOperatorPage.open();
        await widgetService.createNodeOperatorPage.step1.fillForm(
          OPERATOR_TYPE.CM_PTO,
        );
        await widgetService.createNodeOperatorPage.step2.fillForm(
          VALID_ADDRESS,
          VALID_ADDRESS,
        );
        await widgetService.createNodeOperatorPage.step3.fillForm(
          OPERATOR_NAME,
          OPERATOR_DESCRIPTION,
        );
      });
    });

    test.afterEach(async ({ evmNode }) => {
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test('Should create curated operator and send Matomo form events', async ({
      widgetService,
    }) => {
      const { step4 } = widgetService.createNodeOperatorPage;

      await test.step('Click "Create Node Operator" and check Matomo start event', async () => {
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'cm_widget_submit_form_create_curated_operator_start',
          ),
          step4.createButton.click(),
        ]);
      });

      await test.step('Confirm transaction and check Matomo success event', async () => {
        await widgetService.page.waitForSelector(
          'text=Creating Curated Node Operator',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
        await Promise.all([
          matomoEventService.waitForEvent(
            'e_n',
            'cm_widget_submit_form_create_curated_operator_success',
            { timeout: STAGE_WAIT_TIMEOUT },
          ),
          widgetService.walletPage.confirmTx(),
        ]);
      });

      await test.step('Success message is shown', async () => {
        await expect(
          widgetService.page.getByText('Node Operator has been created'),
        ).toBeVisible({ timeout: STAGE_WAIT_TIMEOUT });
      });
    });

    test('Should not offer a switch for the first operator', async ({
      widgetService,
    }) => {
      const txModal = widgetService.txModal;

      await test.step('Fill the creation form with the connected addresses', async () => {
        await widgetService.createNodeOperatorPage.open();
        await widgetService.createNodeOperatorPage.step1.fillForm(
          OPERATOR_TYPE.CM_PTO,
        );
        await widgetService.createNodeOperatorPage.step2.managerAddressConnectedButton.click();
        await widgetService.createNodeOperatorPage.step2.rewardAddressConnectedButton.click();
        await widgetService.createNodeOperatorPage.step2.continueButton.click();
        await widgetService.createNodeOperatorPage.step3.fillForm(
          OPERATOR_NAME,
          OPERATOR_DESCRIPTION,
        );
      });

      await test.step('Send the create transaction', async () => {
        await widgetService.createNodeOperatorPage.step4.createButton.click();
        await widgetService.page.waitForSelector(
          'text=Creating Curated Node Operator',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
        await widgetService.walletPage.confirmTx();
        await widgetService.page.waitForSelector(
          'text=Node Operator has been created',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
      });

      await test.step('The success screen offers no switch, and Add keys carries no Switch prefix', async () => {
        await expect(txModal.switchToOperatorBtn).toBeHidden();
        await expect(
          txModal.footer.getByRole('button', { name: 'Add keys', exact: true }),
        ).toBeVisible();
      });

      await test.step('The created operator is already active', async () => {
        const description = await txModal.description.innerText();
        const idMatch = description.match(/Node Operator ID is (\d+)/);
        expect(
          idMatch,
          `success description must name the new operator, got: ${description}`,
        ).not.toBeNull();

        await txModal.closeModal();
        await expect(txModal.modal).toBeHidden();
        expect(await widgetService.extractNodeOperatorId()).toBe(
          Number(idMatch?.[1]),
        );
      });
    });
  },
);
