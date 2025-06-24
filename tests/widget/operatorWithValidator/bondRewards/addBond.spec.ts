/* eslint-disable no-irregular-whitespace */
import { expect } from '@playwright/test';
import { test } from '../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import {
  STAGE_WAIT_TIMEOUT,
  WALLET_PAGE_TIMEOUT_WAITER,
} from 'tests/consts/timeouts';

test.describe('Bond & Rewards. Add bond.', async () => {
  test.setTimeout(60_000);
  test.beforeEach(async ({ widgetService }) => {
    await widgetService.connectWallet();
    await widgetService.bondRewardsPage.open();
  });

  test('Should displays balance and explanatory text for stETH bond', async ({
    widgetService,
    contractClients,
  }) => {
    const bondRewardsPage = widgetService.bondRewardsPage;

    await test.step('Verify information about bond', async () => {
      const nodeOperatorId = await widgetService.extractNodeOperatorId();

      if (!nodeOperatorId) {
        throw new Error('Node operator ID not found');
      }

      await test.step('Verify bond balance', async () => {
        await expect(
          bondRewardsPage.titledAmount.locator('div').first(),
        ).toContainText('Bond balance');
        const bondSummary =
          await contractClients.CSAccounting.getBondSummary(nodeOperatorId);

        await expect(bondRewardsPage.titledAmountBalance).toHaveText(
          `${bondSummary.excess.toCut(4)} stETH`,
        );
      });

      await test.step('Verify text', async () => {
        const expectedText =
          'Why you might need to add bond:Adding a bond serves as a voluntary security measure for your Node Operator to prevent your validators from becoming unbonded and being requested to exit in case of applied penalties.Supplied bond will be stored as stETH, which also garners staking rewards.';
        await expect(bondRewardsPage.formInfoText).toContainText(expectedText);

        const expectedLinkHref =
          'https://docs.lido.fi/staking-modules/csm/guides/unbonded-validators';
        const linkUnbondedElement = bondRewardsPage.formInfoText.locator('a');
        // @todo: check to click on the link
        await expect(linkUnbondedElement).toHaveAttribute(
          'href',
          expectedLinkHref,
        );
      });
    });
  });

  test(`Should adds bond using ETH as bond token`, async ({
    widgetService,
  }) => {
    const tokenName = 'ETH';

    const expectedAmount = '0.0003';

    const bondRewardsPage = widgetService.bondRewardsPage;
    const bondToken = bondRewardsPage.selectBondToken(tokenName);
    await bondToken.click();
    await bondRewardsPage.amountInput.fill(expectedAmount);

    const [txPage] = await Promise.all([
      bondRewardsPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
      bondRewardsPage.form.getByRole('button', { name: 'Add Bond' }).click(),
    ]);

    await bondRewardsPage.page.waitForSelector(
      `text=Confirm this transaction in your wallet`,
      { timeout: STAGE_WAIT_TIMEOUT },
    );
    await widgetService.walletPage.confirmTx(txPage);
    await bondRewardsPage.page.waitForSelector(
      `text=Awaiting block confirmation`,
      { timeout: STAGE_WAIT_TIMEOUT },
    );
    await bondRewardsPage.page.waitForSelector(
      `text=Adding Bond operation was successful`,
      { timeout: STAGE_WAIT_TIMEOUT },
    );
    // @todo: check balance
  });

  (['STETH', 'WSTETH'] as const).forEach((tokenName) => {
    test(`Should adds bond using ${tokenName} as bond token`, async ({
      widgetService,
    }) => {
      qase.parameters({ tokenName });

      const expectedAmount = '0.0003';

      const bondRewardsPage = widgetService.bondRewardsPage;
      const bondToken = bondRewardsPage.selectBondToken(tokenName);
      await bondToken.click();
      await bondRewardsPage.amountInput.fill(expectedAmount);

      const [requestTxPage] = await Promise.all([
        bondRewardsPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
        bondRewardsPage.form.getByRole('button', { name: 'Add Bond' }).click(),
      ]);
      await bondRewardsPage.page.waitForSelector(
        `text=Confirm request in your wallet`,
        { timeout: STAGE_WAIT_TIMEOUT },
      );

      const [txPage] = await Promise.all([
        bondRewardsPage.waitForPage(WALLET_PAGE_TIMEOUT_WAITER),
        widgetService.walletPage.confirmTx(requestTxPage),
      ]);

      await bondRewardsPage.page.waitForSelector(
        `text=Confirm this transaction in your wallet`,
        { timeout: STAGE_WAIT_TIMEOUT },
      );
      await widgetService.walletPage.confirmTx(txPage);
      await bondRewardsPage.page.waitForSelector(
        `text=Awaiting block confirmation`,
        { timeout: STAGE_WAIT_TIMEOUT },
      );
      await bondRewardsPage.page.waitForSelector(
        `text=Adding Bond operation was successful`,
        { timeout: STAGE_WAIT_TIMEOUT },
      );
      // @todo: check balance
    });
  });

  test.skip(
    qase(65, 'Add bond using maximum available ETH amount'),
    async () => {},
  );

  test.skip(
    qase(66, 'Add bond with manual token amount entry'),
    async () => {},
  );

  test.skip(
    qase(67, 'Attempt to add bond exceeding available balance'),
    async () => {},
  );
});
