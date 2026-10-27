import { test } from '../../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { expect } from '@playwright/test';
import { WidgetService } from 'tests/csm-widget/services/widget.service';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';

test.use({ secretPhrase: PRESETS.EMPTY_OPERATOR.secretPhrase });

const address = PRESETS.EMPTY_OPERATOR.address;
const icsNoId = PRESETS.EMPTY_OPERATOR.noId as number;
const defNoId = PRESETS.FULL_OPERATOR.noId as number;

const selectOperator = async (widgetService: WidgetService, noId: number) => {
  await test.step(`Select Node Operator #${noId}`, async () => {
    await widgetService.page.evaluate(
      ([key, id]) =>
        localStorage.setItem(key, JSON.stringify({ id, module: 'CSM' })),
      [`sm-no-${address}`, String(noId)],
    );
  });
};

test.describe(
  ...suite({
    epic: EPIC.operatorType,
    feature: 'ICS',
    story: 'Type status. Used proof',
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ evmNode, forkActionService, widgetService }) => {
      snapshotId = await evmNode.snapshot();

      await test.step('Claim ICS onto the first operator', async () => {
        await forkActionService.setGateAddrs('ics', address);
        await forkActionService.claimGateCurve('ics', icsNoId, address);
      });

      await test.step('Make the wallet owner of the second operator', async () => {
        await forkActionService.proposeReward(defNoId, address);
        await forkActionService.confirmReward(defNoId);
      });

      await widgetService.setFeatureFlag('icsApplyForm', true);
    });

    test.afterAll(async ({ evmNode, widgetService }) => {
      await widgetService.setFeatureFlag('icsApplyForm', false);
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test('Should show Used on another operator', async ({ widgetService }) => {
      const operatorType = widgetService.operatorType;
      const form = operatorType.applicationForm;

      await selectOperator(widgetService, defNoId);
      await operatorType.openTypePage();

      await test.step('ICS card shows the used proof', async () => {
        expect(await widgetService.extractNodeOperatorId()).toBe(defNoId);
        await expect(operatorType.icsCardChip).toHaveText('Used');
        await expect(operatorType.icsApplyButton).toHaveText('View ICS status');
        await expect(operatorType.claimIcsAlert).toBeHidden();
      });

      await form.open();

      await test.step('Hint says the proof went to another operator', async () => {
        await expect(form.operatorTypeChip).toHaveText('Used');
        await expect(
          form.page.getByText(
            'Your address has already used its ICS proof on another Node Operator',
          ),
        ).toBeVisible();
        await expect(form.signInForm.form).toBeHidden();
      });
    });

    test('Should show Claimed on the ICS operator', async ({
      widgetService,
    }) => {
      const operatorType = widgetService.operatorType;
      const form = operatorType.applicationForm;

      await selectOperator(widgetService, icsNoId);
      await operatorType.openTypePage();

      await test.step('ICS card shows the claimed type', async () => {
        expect(await widgetService.extractNodeOperatorId()).toBe(icsNoId);
        await expect(operatorType.icsCardChip).toHaveText('Claimed');
      });

      await form.open();

      await test.step('Apply page shows the claimed status', async () => {
        await expect(form.operatorTypeChip).toHaveText('Claimed');
        await expect(
          form.page.getByText('Your Node Operator already has ICS type'),
        ).toBeVisible();
        await expect(
          form.page.getByText(/already used its ICS proof/),
        ).toBeHidden();
      });
    });
  },
);
