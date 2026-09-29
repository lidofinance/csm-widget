import { expect } from '@playwright/test';
import { formatEther } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import { test } from '../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { qase } from 'playwright-qase-reporter/playwright';

test.describe(
  ...suite({
    epic: EPIC.myOperators,
    story: 'View my operators',
  }),
  async () => {
    test.beforeEach(async ({ widgetService }) => {
      await widgetService.myOperatorsPage.open();
    });

    test(
      qase(563, 'Should show summary, card, and nav item'),
      async ({ widgetService, csmSDK, secretPhrase }) => {
        const page = widgetService.myOperatorsPage;
        const noId = await widgetService.extractNodeOperatorId();

        await test.step('Nav item and summary visible', async () => {
          await expect(page.navItem).toBeVisible();
          await expect(page.summary).toContainText('My operators summary');
          await expect(page.summaryIssuesChip).toBeVisible();
        });

        await test.step('Card for the active operator shows dashboard action', async () => {
          const card = page.cards.filter({ hasText: `Node Operator #${noId}` });
          await expect(card).toBeVisible();
          await expect(card.getByTestId('goToDashboardBtn')).toBeVisible();
        });

        await test.step('Summary bond balance matches SDK', async () => {
          const address = mnemonicToAccount(secretPhrase).address;
          const expected = await csmSDK.getMyOperatorsBond(address);
          const text = await page.summaryBondBalance_Text.textContent();
          const shown = parseFloat((text ?? '').replace(/[^\d.]/g, ''));
          expect(Math.abs(shown - Number(formatEther(expected)))).toBeLessThan(
            0.0002,
          );
        });
      },
    );
  },
);
