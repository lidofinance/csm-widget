import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { expect } from '@playwright/test';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';
import { Tags } from 'tests/shared/consts/common.const';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.ONLY_OPERATOR.secretPhrase });

const OPERATOR_NAME = 'Second Operator';
const OPERATOR_DESCRIPTION = 'Created by the second operator test';

test.describe(
  'Operator with free gates. Create a second operator (forked)',
  { tag: [Tags.forked, Tags.performTX] },
  () => {
    let snapshotId: string;
    let firstOperatorId: number;
    let secondOperatorId: number;

    test.beforeAll(async ({ useFork, evmNode, cmSDK }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
      snapshotId = await evmNode.snapshot();
      await evmNode.setBalance(PRESETS.ONLY_OPERATOR.address, 100);

      const operators = await cmSDK.getNodeOperatorsByAddress(
        PRESETS.ONLY_OPERATOR.address,
      );
      const ids = operators.map((operator) => Number(operator.nodeOperatorId));
      expect(
        ids,
        'ONLY_OPERATOR preset must own exactly one operator',
      ).toHaveLength(1);
      firstOperatorId = ids[0];
    });

    test.afterAll(async ({ evmNode, widgetService }) => {
      if (snapshotId) await evmNode.revert(snapshotId);
      await widgetService.selectOperatorModal.forgetSelectionAndReload();
    });

    test('Should offer and perform a switch to the created operator', async ({
      widgetService,
      cmSDK,
    }) => {
      const txModal = widgetService.txModal;
      const header = widgetService.header;

      await test.step('Walk the wizard keeping our own addresses', async () => {
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

      await test.step('The success screen names the new operator', async () => {
        const operators = await cmSDK.getNodeOperatorsByAddress(
          PRESETS.ONLY_OPERATOR.address,
        );
        const ids = operators.map((operator) =>
          Number(operator.nodeOperatorId),
        );
        const created = ids.filter((id) => id !== firstOperatorId);
        expect(
          created,
          `the create must add exactly one operator, wallet owns ${ids.join(', ')}`,
        ).toHaveLength(1);
        secondOperatorId = created[0];

        await expect(txModal.description).toContainText(
          `Node Operator ID is ${secondOperatorId}`,
        );
      });

      await test.step('It offers a switch to that operator', async () => {
        await expect(txModal.switchToOperatorBtn).toHaveText(
          `Switch to Node Operator #${secondOperatorId}`,
        );
      });

      await test.step('Add keys is prefixed with Switch', async () => {
        await expect(
          txModal.footer.getByRole('button', { name: 'Switch and Add keys' }),
        ).toBeVisible();
      });

      await test.step('The first operator stays active until the switch', async () => {
        expect(await widgetService.extractNodeOperatorId()).toBe(
          firstOperatorId,
        );
      });

      await test.step('Take the offer', async () => {
        await txModal.switchToOperatorBtn.click();
        await expect(txModal.modal).toBeHidden();
        expect(await widgetService.extractNodeOperatorId()).toBe(
          secondOperatorId,
        );
      });

      await test.step('Both operators are listed in the switch modal', async () => {
        await header.switchOperatorButton.click();
        await expect(header.operatorSwitchModal).toBeVisible();
        await expect(header.switchModalRows).toHaveCount(2);
        await expect(header.switchModalRowById(firstOperatorId)).toBeVisible();
        await expect(header.switchModalRowById(secondOperatorId)).toBeVisible();
      });

      await test.step('The active one is marked as current', async () => {
        await expect(
          header.switchModalRowById(secondOperatorId).getByRole('button', {
            name: 'Current',
          }),
        ).toBeVisible();
      });
    });
  },
);
