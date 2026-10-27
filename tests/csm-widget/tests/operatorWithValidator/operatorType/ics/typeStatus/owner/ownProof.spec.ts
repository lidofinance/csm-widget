import { test } from '../../../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { expect } from '@playwright/test';
import { qase } from 'playwright-qase-reporter/playwright';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { generateAddress } from 'tests/shared/helpers/accountData';

test.use({ secretPhrase: PRESETS.EMPTY_OPERATOR.secretPhrase });

const noId = PRESETS.EMPTY_OPERATOR.noId as number;
const owner = PRESETS.EMPTY_OPERATOR.address;
const manager = generateAddress(true);

test.describe(
  ...suite({
    epic: EPIC.operatorType,
    feature: 'ICS',
    story: 'Type status. Owner. Own proof',
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ evmNode, forkActionService, widgetService }) => {
      snapshotId = await evmNode.snapshot();

      await test.step('Move the manager role to another address', async () => {
        await forkActionService.proposeManager(noId, manager);
        await forkActionService.confirmManager(noId);
      });

      await test.step('Issue ICS status to the owner', async () => {
        await forkActionService.setGateAddrs('ics', owner);
      });

      await widgetService.setFeatureFlag('icsApplyForm', true);
    });

    test.afterAll(async ({ evmNode, widgetService }) => {
      await widgetService.setFeatureFlag('icsApplyForm', false);
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test(qase(655, 'Should offer the claim'), async ({ widgetService }) => {
      const operatorType = widgetService.operatorType;
      await operatorType.openTypePage();

      await test.step('ICS card is claimable', async () => {
        await expect(operatorType.icsCardChip).toHaveText('Issued');
        await expect(operatorType.icsApplyButton).toHaveText('Claim ICS type');
      });

      await test.step('Claim notification is shown', async () => {
        await expect(operatorType.claimIcsAlert).toContainText(
          'The Identified Community Staker type is now available to be claimed for your node operator',
        );
      });

      await test.step('Claim page opens from the card', async () => {
        await operatorType.icsApplyButton.click();
        await widgetService.page.waitForURL(/\/type\/ics-claim/);
        await expect(operatorType.claimIcs.claimButton).toBeVisible();
      });
    });
  },
);
