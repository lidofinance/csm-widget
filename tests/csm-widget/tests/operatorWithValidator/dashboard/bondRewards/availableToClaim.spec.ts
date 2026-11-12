/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { qase } from 'playwright-qase-reporter/playwright';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.dashboard,
    feature: 'Bond & Rewards',
    story: 'Available to claim',
  }),
  async () => {
    let snapshotId: string;

    test.beforeAll(async ({ csmSDK, forkActionService, widgetService }) => {
      snapshotId = await csmSDK.evmSnapshot();

      await test.step('Set up: report rewards', async () => {
        await widgetService.dashboardPage.open();
        await forkActionService.reportRewards();
      });
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.dashboardPage.open();
    });

    test(
      qase(134, 'Should correctly display the balance'),
      async ({ widgetService, csmSDK }) => {
        const { claimCard } = widgetService.dashboardPage;

        const nodeOperatorId = await widgetService.extractNodeOperatorId();

        const totalClaimable = await csmSDK.getAvailableToClaim(nodeOperatorId);

        await test.step('Verify "Available to claim" value', async () => {
          await expect(claimCard.value).toHaveText(/\d/);
          const value = parseFloat(
            ((await claimCard.value.textContent()) ?? '').replace(/,/g, ''),
          );
          expect(Math.abs(value - totalClaimable)).toBeLessThan(0.1);
        });
      },
    );
  },
);
