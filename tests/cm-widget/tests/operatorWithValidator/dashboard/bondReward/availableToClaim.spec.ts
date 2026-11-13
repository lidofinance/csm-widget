/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { qase } from 'playwright-qase-reporter/playwright';
import { PRESETS } from 'tests/cm-widget/config/walletSetup';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.dashboard,
    feature: 'Bond & Rewards',
    story: 'Available to claim',
  }),
  () => {
    let snapshotId: string;
    let noId: number;

    test.beforeAll(async ({ cmSDK, forkActionService, widgetService }) => {
      snapshotId = await cmSDK.evmSnapshot();

      await test.step('Set up: add excess bond and report rewards', async () => {
        await widgetService.dashboardPage.open();
        noId = await widgetService.extractNodeOperatorId();
        await forkActionService.addBond(noId, '2');
        await forkActionService.reportRewards();
      });
    });

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.dashboardPage.open();
    });

    test.afterAll(async ({ cmSDK }) => {
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });
    test(
      qase(131, 'Should show SDK claimable amount on claim card'),
      async ({ widgetService, cmSDK }) => {
        const { claimCard } = widgetService.dashboardPage;

        const expectedTotal = await cmSDK.getAvailableToClaim(noId);

        await test.step('Verify available to claim stETH value', async () => {
          await expect(claimCard.availableToClaimBalance).toHaveText(/\d/, {
            timeout: 20000,
          });
          const text = await claimCard.availableToClaimBalance.textContent();
          expect(parseFloat(text ?? '0')).toBeCloseTo(expectedTotal, 3);
        });

        await test.step('Verify USD value is shown', async () => {
          await expect(claimCard.root).toContainText(/\$\d[\d,]*(\.\d{2})?/);
        });
      },
    );
  },
);
