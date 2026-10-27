import { test } from '../../../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { generateAddress } from 'tests/shared/helpers/accountData';

test.use({ secretPhrase: PRESETS.EMPTY_OPERATOR.secretPhrase });

const noId = PRESETS.EMPTY_OPERATOR.noId as number;
const manager = PRESETS.EMPTY_OPERATOR.address;
const owner = generateAddress(true);

test.describe(
  ...suite({
    epic: EPIC.operatorType,
    feature: 'ICS',
    story: 'Type status. Non-owner. Operator already ICS',
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ evmNode, forkActionService, widgetService }) => {
      snapshotId = await evmNode.snapshot();

      await test.step('Move the rewards address to another owner', async () => {
        await forkActionService.proposeReward(noId, owner);
        await forkActionService.confirmReward(noId);
      });

      // Manager keeps a live proof: Claimed must still win over it
      await test.step('Owner claims ICS onto the operator', async () => {
        await forkActionService.setGateAddrs('ics', owner, manager);
        await forkActionService.claimGateCurve('ics', noId, owner, [
          owner,
          manager,
        ]);
      });

      await widgetService.setFeatureFlag('icsApplyForm', true);
    });

    test.afterAll(async ({ evmNode, widgetService }) => {
      await widgetService.setFeatureFlag('icsApplyForm', false);
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test(
      qase(653, 'Should show Claimed to the manager'),
      async ({ widgetService }) => {
        const operatorType = widgetService.operatorType;
        const form = operatorType.applicationForm;

        await operatorType.openTypePage();

        await test.step('Header and ICS card show the claimed type', async () => {
          await expect(widgetService.header.operatorTypeCurve).toContainText(
            'ICS',
          );
          await expect(operatorType.icsCardChip).toHaveText('Claimed');
          await expect(operatorType.icsApplyButton).toHaveText(
            'View ICS status',
          );
          await expect(operatorType.claimIcsAlert).toBeHidden();
        });

        await form.open();

        await test.step('Apply page shows the claimed status', async () => {
          await expect(form.operatorTypeChip).toHaveText('Claimed');
          await expect(
            form.page.getByText('Your Node Operator already has ICS type'),
          ).toBeVisible();
          await expect(form.signInForm.form).toBeHidden();
        });
      },
    );
  },
);
