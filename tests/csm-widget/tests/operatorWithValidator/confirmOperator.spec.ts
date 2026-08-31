import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { expect } from '@playwright/test';
import { Tags, TokenSymbol } from 'tests/shared/consts/common.const';
import {
  COMMON_ACTION_TIMEOUT,
  PAGE_WAIT_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
} from 'tests/shared/consts/timeouts';
import { test } from '../test.fixture';

const BOND_AMOUNT = '0.1';

test.describe(
  'Operator with validator. Confirm operator modal',
  { tag: [Tags.forked, Tags.performTX] },
  () => {
    let snapshotId: string;
    let activeOperatorId: number;

    test.beforeAll(async ({ useFork, evmNode, widgetService }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
      snapshotId = await evmNode.snapshot();
      activeOperatorId = await widgetService.extractNodeOperatorId();
    });

    test.afterAll(async ({ evmNode, widgetService }) => {
      if (snapshotId) await evmNode.revert(snapshotId);
      await widgetService.selectOperatorModal.forgetSelectionAndReload();
    });

    test('Should name the active operator before Add bond', async ({
      widgetService,
    }) => {
      const addBond = widgetService.bondRewardsPage.addBond;
      const modal = widgetService.confirmOperatorModal;

      await test.step('Fill the Add bond form with ETH', async () => {
        await addBond.open();
        await addBond.selectBondToken(TOKENS.eth).click();
        await addBond.amountInput.fill(BOND_AMOUNT);
        await addBond.addBondButton.click();
      });

      await test.step('The modal names the active operator', async () => {
        await expect(modal.modal).toBeVisible({
          timeout: PAGE_WAIT_TIMEOUT,
        });
        await expect(modal.title).toContainText('Confirm your Node Operator');
        await expect(modal.description).toContainText(
          'Check that the Node Operator below is the one you intend to use before proceeding',
        );
        await expect(modal.operatorId).toContainText(
          new RegExp(`Node Operator #${activeOperatorId}$`),
        );
      });

      await test.step('Continue proceeds to the transaction', async () => {
        await modal.continueButton.click();
        await widgetService.page.waitForSelector(
          'text=Confirm this transaction in your wallet',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
      });

      await test.step('Dispose of the wallet request', async () => {
        await widgetService.walletPage.cancelTx();
        await expect(widgetService.txModal.title).toContainText(
          'Transaction Failed',
          { timeout: PAGE_WAIT_TIMEOUT },
        );
        await widgetService.txModal.closeModal();
        await expect(widgetService.txModal.modalContent).toBeHidden();
      });
    });

    test('Should not send the transaction when dismissed', async ({
      widgetService,
    }) => {
      const addBond = widgetService.bondRewardsPage.addBond;
      const modal = widgetService.confirmOperatorModal;
      const dismissals: [string, () => Promise<void>][] = [
        ['the cross', () => modal.clickCross()],
        ['Escape', () => modal.pressEscape()],
        ['the backdrop', () => modal.clickBackdrop()],
      ];

      await test.step('Fill the Add bond form with ETH', async () => {
        await addBond.open();
        await addBond.selectBondToken(TOKENS.eth).click();
        await addBond.amountInput.fill(BOND_AMOUNT);
      });

      for (const [name, dismiss] of dismissals) {
        await test.step(`Dismissing by ${name} keeps the transaction unsent`, async () => {
          await addBond.addBondButton.click();
          await dismiss();

          await widgetService.page.waitForTimeout(COMMON_ACTION_TIMEOUT);

          await expect(
            widgetService.txModal.modalContent,
            'the transaction flow must not start',
          ).toBeHidden();
        });

        await test.step(`The form survives dismissal by ${name}`, async () => {
          await expect(addBond.amountInput).toHaveValue(BOND_AMOUNT);
          await expect(addBond.addBondButton).toBeEnabled();
        });
      }
    });

    test('Should name the active operator before Add keys', async ({
      widgetService,
      keysGeneratorService,
    }) => {
      const submit = widgetService.keysPage.submitPage;
      const modal = widgetService.confirmOperatorModal;
      const keys = keysGeneratorService.generateKeys(1);

      await test.step('Fill the Add keys form with ETH', async () => {
        await submit.open();
        await submit.fillAndClickSubmit(keys, TokenSymbol.ETH);
      });

      await test.step('The modal names the active operator', async () => {
        await expect(modal.modal).toBeVisible({
          timeout: PAGE_WAIT_TIMEOUT,
        });
        await expect(modal.title).toContainText('Confirm your Node Operator');
        await expect(modal.description).toContainText(
          'Check that the Node Operator below is the one you intend to use before proceeding',
        );
        await expect(modal.operatorId).toContainText(
          new RegExp(`Node Operator #${activeOperatorId}$`),
        );
      });

      await test.step('Continue proceeds to the transaction', async () => {
        await modal.continueButton.click();
        await widgetService.page.waitForSelector(
          'text=Confirm this transaction in your wallet',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
      });

      await test.step('Dispose of the wallet request', async () => {
        await widgetService.walletPage.cancelTx();
        await expect(widgetService.txModal.title).toContainText(
          'Transaction Failed',
          { timeout: PAGE_WAIT_TIMEOUT },
        );
        await widgetService.txModal.closeModal();
        await expect(widgetService.txModal.modalContent).toBeHidden();
      });
    });
  },
);
