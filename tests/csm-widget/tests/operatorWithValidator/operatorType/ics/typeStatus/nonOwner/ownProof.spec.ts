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
    story: 'Type status. Non-owner. Own proof',
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ evmNode, forkActionService, widgetService }) => {
      snapshotId = await evmNode.snapshot();

      await test.step('Move the rewards address to another owner', async () => {
        await forkActionService.proposeReward(noId, owner);
        await forkActionService.confirmReward(noId);
      });

      await test.step('Issue ICS status to the manager', async () => {
        await forkActionService.setGateAddrs('ics', manager);
      });

      await widgetService.setFeatureFlag('icsApplyForm', true);
    });

    test.afterAll(async ({ evmNode, widgetService }) => {
      await widgetService.setFeatureFlag('icsApplyForm', false);
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test(
      qase(649, 'Should show Issued without a claim offer'),
      async ({ widgetService }) => {
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
      },
    );

    test(
      qase(650, 'Should show the not-owner hint without sign-in'),
      async ({ widgetService }) => {
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
      },
    );

    test(
      qase(651, 'Should show the owner-only notice on the claim page'),
      async ({ widgetService }) => {
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
      },
    );
  },
);
