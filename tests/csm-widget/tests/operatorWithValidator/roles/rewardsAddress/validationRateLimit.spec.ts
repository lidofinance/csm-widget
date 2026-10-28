import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { TxModal } from 'tests/csm-widget/pages/elements/common/element.txProgressModal';
import { generateAddress } from 'tests/shared/helpers/accountData';
import { OFAC_MODAL_TEXT } from 'tests/shared/consts/texts.const';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { qase } from 'playwright-qase-reporter/playwright';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const noId = PRESETS.FULL_OPERATOR.noId as number;

test.describe(
  ...suite({
    epic: EPIC.roles,
    feature: 'Rewards address',
    story: 'Address validation rate limit',
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ evmNode }) => {
      snapshotId = await evmNode.snapshot();
    });

    test.afterAll(async ({ evmNode, widgetService }) => {
      await widgetService.page.unrouteAll();
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.page.unrouteAll();
    });

    test(
      qase(658, 'Should block propose on 429'),
      async ({ widgetService, forkActionService }) => {
        const page = widgetService.settingsPage.rewardsAddressPage;
        const proposedBefore =
          await forkActionService.getProposedRewardAddress(noId);

        await widgetService.mockValidationAddressRequest(true, 429);
        // full reload: validation results are cached per address
        await page.open();

        await test.step('Submit a new rewards address', async () => {
          await page.addressInput.fill(generateAddress());
          await page.addressValidIcon.waitFor({ state: 'visible' });
          await page.proposeButton.click();
        });

        await test.step('Access denied modal is shown', async () => {
          await expect(new TxModal(widgetService.page).modal).toContainText(
            OFAC_MODAL_TEXT,
          );
        });

        await test.step('Nothing is proposed on chain', async () => {
          expect(await forkActionService.getProposedRewardAddress(noId)).toBe(
            proposedBefore,
          );
        });
      },
    );

    test(
      qase(659, 'Should propose on other API errors'),
      async ({ widgetService, forkActionService }) => {
        const page = widgetService.settingsPage.rewardsAddressPage;
        const newAddress = generateAddress(true);

        await widgetService.mockValidationAddressRequest(true, 500);
        // full reload: validation results are cached per address
        await page.open();
        await page.revokePendingRole();

        await page.proposeNewAddress(newAddress);

        await test.step('New address is proposed on chain', async () => {
          expect(await forkActionService.getProposedRewardAddress(noId)).toBe(
            newAddress,
          );
        });
      },
    );
  },
);
