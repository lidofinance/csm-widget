import { test } from '../../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { expect } from '@playwright/test';
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
    story: 'Type status. Non-owner',
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ evmNode, forkActionService, widgetService }) => {
      snapshotId = await evmNode.snapshot();

      await test.step('Move the rewards address to another owner', async () => {
        await forkActionService.proposeReward(noId, owner);
        await forkActionService.confirmReward(noId);
      });

      await widgetService.setFeatureFlag('icsApplyForm', true);
    });

    test.afterAll(async ({ evmNode, widgetService }) => {
      await widgetService.setFeatureFlag('icsApplyForm', false);
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test.describe('Own proof', () => {
      test.beforeAll(async ({ forkActionService }) => {
        await test.step('Issue ICS status to the manager', async () => {
          await forkActionService.setGateAddrs('ics', manager);
        });
      });

      test('Should show Issued without a claim offer', async ({
        widgetService,
      }) => {
        const operatorType = widgetService.operatorType;
        await operatorType.openTypePage();

        await test.step('ICS card is issued but not claimable', async () => {
          await expect(operatorType.icsCardChip).toHaveText('Issued');
          await expect(operatorType.icsApplyButton).toHaveText(
            'View ICS status',
          );
        });

        await test.step('No claim notification and nav counter', async () => {
          await expect(operatorType.claimIcsAlert).toBeHidden();
          await expect(operatorType.navClaimCounter).toBeHidden();
        });
      });

      test('Should show the not-owner hint without sign-in', async ({
        widgetService,
      }) => {
        const form = widgetService.operatorType.applicationForm;
        await form.open();

        await test.step('Operator type status is Issued', async () => {
          await expect(form.operatorTypeChip).toHaveText('Issued');
        });

        await test.step('Hint asks to become the owner', async () => {
          await expect(
            form.page.getByText("You're already eligible to claim ICS type"),
          ).toBeVisible();
          await expect(
            form.page.getByText(
              'To claim, your current address should be set as your Node Operator owner',
            ),
          ).toBeVisible();
        });

        await test.step('Sign-in is not requested', async () => {
          await expect(form.signInForm.form).toBeHidden();
        });
      });

      test('Should show the owner-only notice on the claim page', async ({
        widgetService,
      }) => {
        const claim = widgetService.operatorType.claimIcs;

        await test.step('Open the ICS claim page directly', async () => {
          await widgetService.page.goto('/type/ics-claim');
          await expect(claim.formTitle).toContainText(
            'Claim Identified Community Staker operator type',
          );
        });

        await test.step('Only the owner can claim', async () => {
          await expect(
            claim.page.getByText(
              'This action can only be performed by the Rewards Address of the Node Operator',
            ),
          ).toBeVisible();
          await expect(claim.claimButton).toBeHidden();
        });
      });
    });

    test.describe('Owner proof', () => {
      test.beforeAll(async ({ forkActionService }) => {
        await test.step('Issue ICS status to the owner only', async () => {
          await forkActionService.setGateAddrs('ics', owner);
        });
      });

      test('Should show the owner-eligible hint', async ({ widgetService }) => {
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

        await test.step('Hint points to the owner address', async () => {
          await expect(form.operatorTypeChip).toHaveText('Issued');
          await expect(
            form.page.getByText(
              "Node Operator's owner address is already eligible to claim ICS type",
            ),
          ).toBeVisible();
          await expect(
            form.page.getByText(
              "Connect with your Node Operator's owner address to claim ICS type",
            ),
          ).toBeVisible();
          await expect(form.signInForm.form).toBeHidden();
        });
      });
    });

    test.describe('Operator already ICS', () => {
      test.beforeAll(async ({ forkActionService }) => {
        // Manager keeps a live proof: Claimed must still win over it
        await test.step('Owner claims ICS onto the operator', async () => {
          await forkActionService.setGateAddrs('ics', owner, manager);
          await forkActionService.claimGateCurve('ics', noId, owner, [
            owner,
            manager,
          ]);
        });
      });

      test('Should show Claimed to the manager', async ({ widgetService }) => {
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
      });
    });
  },
);
