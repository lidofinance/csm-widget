import { test } from '../../../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { generateAddress } from 'tests/shared/helpers/accountData';

test.use({ secretPhrase: PRESETS.EMPTY_OPERATOR.secretPhrase });

const noId = PRESETS.EMPTY_OPERATOR.noId as number;
const manager = generateAddress(true);

test.describe(
  ...suite({
    epic: EPIC.operatorType,
    feature: 'ICS',
    story: 'Type status. Owner. Manager proof',
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ evmNode, forkActionService, widgetService }) => {
      snapshotId = await evmNode.snapshot();

      await test.step('Move the manager role to another address', async () => {
        await forkActionService.proposeManager(noId, manager);
        await forkActionService.confirmManager(noId);
      });

      await test.step('Issue ICS status to the manager only', async () => {
        await forkActionService.setGateAddrs('ics', manager);
      });

      await widgetService.setFeatureFlag('icsApplyForm', true);
    });

    test.afterAll(async ({ evmNode, widgetService }) => {
      await widgetService.setFeatureFlag('icsApplyForm', false);
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test(
      qase(654, 'Should show the other-address hint'),
      async ({ widgetService }) => {
        const operatorType = widgetService.operatorType;
        const form = operatorType.applicationForm;

        await operatorType.openTypePage();

        await test.step('ICS card is issued but not claimable', async () => {
          await expect(operatorType.icsCardChip).toHaveText('Issued');
          await expect(operatorType.icsApplyButton).toHaveText(
            'View ICS status',
          );
          await expect(operatorType.claimIcsAlert).toBeHidden();
        });

        await form.open();

        await test.step('Hint points to the other role address', async () => {
          await expect(form.operatorTypeChip).toHaveText('Issued');
          await expect(
            form.page.getByText(
              'Another address of your Node Operator is already eligible to claim ICS type',
            ),
          ).toBeVisible();
          await expect(
            form.page.getByText(
              'To claim, it should be set as your Node Operator owner',
            ),
          ).toBeVisible();
          await expect(form.signInForm.form).toBeHidden();
        });
      },
    );
  },
);
