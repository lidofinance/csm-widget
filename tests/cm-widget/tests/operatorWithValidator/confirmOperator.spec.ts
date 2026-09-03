import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { expect } from '@playwright/test';
import { PRESETS } from 'tests/cm-widget/config/walletSetup/walletPresets.state';
import { Tags, TokenSymbol } from 'tests/shared/consts/common.const';
import {
  PAGE_WAIT_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
} from 'tests/shared/consts/timeouts';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const BOND_AMOUNT = '0.1';
const ACTIVE_OPERATOR_ID = PRESETS.FULL_OPERATOR.noIds[0];

test.describe(
  'Operator with validator. Confirm operator modal.',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(({ useFork }) => {
      test.skip(!useFork, 'Test suite runs only on forked network');
    });

    test.beforeEach(async ({ evmNode }) => {
      snapshotId = await evmNode.snapshot();
    });

    test.afterEach(async ({ evmNode }) => {
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test('Should display the active operator and add bond to it', async ({
      widgetService,
      cmSDK,
    }) => {
      const addBond = widgetService.bondRewardsPage.addBond;
      const confirmModal = widgetService.confirmOperatorModal;
      const bondBefore = await cmSDK.getBondSummary(ACTIVE_OPERATOR_ID);

      await test.step('Fill the Add bond form with ETH', async () => {
        await addBond.open();
        await addBond.selectBondToken(TOKENS.eth).click();
        await addBond.amountInput.fill(BOND_AMOUNT);
        await addBond.addBondButton.click();
      });

      await test.step('Confirm modal shows the active operator', async () => {
        await expect(confirmModal.modal).toBeVisible({
          timeout: PAGE_WAIT_TIMEOUT,
        });
        await expect(confirmModal.title).toContainText(
          'Confirm your Node Operator',
        );
        await expect(confirmModal.description).toContainText(
          'Check that the Node Operator below is the one you intend to use before proceeding',
        );
        await expect(confirmModal.operatorId).toHaveText(
          `Node Operator #${ACTIVE_OPERATOR_ID}`,
        );
      });

      await test.step('Continue sends the transaction', async () => {
        await confirmModal.continueButton.click();
        await widgetService.page.waitForSelector(
          'text=Confirm this transaction in your wallet',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
        await widgetService.walletPage.confirmTx();
        await expect(
          widgetService.page.getByText('Adding Bond operation was successful'),
        ).toBeVisible({ timeout: STAGE_WAIT_TIMEOUT });
      });

      await test.step('The bond lands on the confirmed operator', async () => {
        const expected =
          parseFloat(bondBefore.current) + parseFloat(BOND_AMOUNT);
        await expect
          .poll(
            async () =>
              parseFloat(
                (await cmSDK.getBondSummary(ACTIVE_OPERATOR_ID)).current,
              ),
            { timeout: PAGE_WAIT_TIMEOUT },
          )
          .toBeCloseTo(expected, 3);
      });
    });

    test('Should not send the transaction when dismissed', async ({
      widgetService,
    }) => {
      const addBond = widgetService.bondRewardsPage.addBond;
      const confirmModal = widgetService.confirmOperatorModal;
      const dismissals: [string, () => Promise<void>][] = [
        ['the cross', () => confirmModal.clickCross()],
        ['Escape', () => confirmModal.pressEscape()],
        ['the backdrop', () => confirmModal.clickBackdrop()],
      ];

      await test.step('Fill the Add bond form with ETH', async () => {
        await addBond.open();
        await addBond.selectBondToken(TOKENS.eth).click();
        await addBond.amountInput.fill(BOND_AMOUNT);
      });

      for (const [name, dismiss] of dismissals) {
        await test.step(`Dismissing by ${name} closes the modal`, async () => {
          await addBond.addBondButton.click();
          await dismiss();
          await expect(confirmModal.modal).toBeHidden({
            timeout: PAGE_WAIT_TIMEOUT,
          });
        });

        await test.step(`The form survives dismissal by ${name} and nothing is sent`, async () => {
          await expect(addBond.amountInput).toHaveValue(BOND_AMOUNT);
          await expect(addBond.addBondButton).toBeEnabled();
          await expect(
            widgetService.txModal.modalContent,
            'the transaction flow must not start',
          ).toBeHidden();
        });
      }
    });

    test('Should display the active operator and add keys to it', async ({
      widgetService,
      keysGeneratorService,
      cmSDK,
    }) => {
      const submit = widgetService.keysPage.submitPage;
      const confirmModal = widgetService.confirmOperatorModal;
      const keys = keysGeneratorService.generateKeys(1);
      const keysBefore = await cmSDK.getAllKeys(BigInt(ACTIVE_OPERATOR_ID));

      await test.step('Fill the Add keys form with ETH', async () => {
        await submit.open();
        await submit.fillAndClickSubmit(keys, TokenSymbol.ETH);
      });

      await test.step('Confirm modal shows the active operator', async () => {
        await expect(confirmModal.modal).toBeVisible({
          timeout: PAGE_WAIT_TIMEOUT,
        });
        await expect(confirmModal.title).toContainText(
          'Confirm your Node Operator',
        );
        await expect(confirmModal.description).toContainText(
          'Check that the Node Operator below is the one you intend to use before proceeding',
        );
        await expect(confirmModal.operatorId).toHaveText(
          `Node Operator #${ACTIVE_OPERATOR_ID}`,
        );
      });

      await test.step('Continue sends the transaction', async () => {
        await confirmModal.continueButton.click();
        await widgetService.page.waitForSelector(
          'text=Confirm this transaction in your wallet',
          { timeout: STAGE_WAIT_TIMEOUT },
        );
        await widgetService.walletPage.confirmTx();
        await expect(
          widgetService.page.getByText('Uploading operation was successful.'),
        ).toBeVisible({ timeout: STAGE_WAIT_TIMEOUT });
      });

      await test.step('The key lands on the confirmed operator', async () => {
        await expect
          .poll(
            async () =>
              (await cmSDK.getAllKeys(BigInt(ACTIVE_OPERATOR_ID))).length,
            { timeout: PAGE_WAIT_TIMEOUT },
          )
          .toBe(keysBefore.length + keys.length);
      });
    });
  },
);
