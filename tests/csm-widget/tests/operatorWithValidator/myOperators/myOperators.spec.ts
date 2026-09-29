import { expect } from '@playwright/test';
import { test } from '../../test.fixture';

// Authored to match tests/CLAUDE.md conventions; not run locally (needs the e2e stand env).
test.describe('Operator with validator. My operators.', async () => {
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.myOperatorsPage.open();
  });

  test('Should show summary, card, and nav item', async ({
    widgetService,
    csmSDK,
  }) => {
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

    await test.step('Bond balance matches SDK', async () => {
      const bond = await csmSDK.operator.getBondBalance(BigInt(noId));
      const text = await page.summary
        .getByTestId('summaryBondBalance')
        .textContent();
      const shown = parseFloat((text ?? '').replace(/[^\d.]/g, ''));
      expect(Math.abs(shown - Number(bond.current) / 1e18)).toBeLessThan(0.1);
    });
  });
});
