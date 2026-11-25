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

        const csmCount = await page.csmCards.count();

        await test.step('Nav item and list visible', async () => {
          await expect(page.navItem).toBeVisible();
          await expect(page.list).toBeVisible();
          await expect(page.summary).toHaveCount(csmCount >= 2 ? 1 : 0);
        });

        await test.step('Card for the active operator shows dashboard action', async () => {
          const card = page.card(noId, 'CSM');
          await expect(card).toBeVisible();
          await expect(card.getByTestId('goToDashboardBtn')).toBeVisible();
        });

        await test.step('Bond balance matches SDK', async () => {
          const address = mnemonicToAccount(secretPhrase).address;
          const expected = await csmSDK.getMyOperatorsBond(address);
          const locator =
            csmCount >= 2
              ? page.summaryBondBalance_Text
              : page.csmCards
                  .getByTestId('operatorBondBalance')
                  .getByTestId('textContent');
          const text = await locator.first().textContent();
          const shown = parseFloat((text ?? '').replace(/[^\d.]/g, ''));
          expect(Math.abs(shown - Number(formatEther(expected)))).toBeLessThan(
            0.0002,
          );
        });
      },
    );
  },
);
