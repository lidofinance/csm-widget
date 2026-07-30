import { test } from '../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { Tags, TokenSymbol } from 'tests/shared/consts/common.const';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

test.describe(
  'Operator with keys. IDVTC issued. Claim transaction (forked)',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(
      async ({
        useFork,
        evmNode,
        forkActionService,
        widgetService,
        secretPhrase,
        keysGeneratorService,
      }) => {
        test.skip(!useFork, 'Test suite runs only on forked network');

        snapshotId = await evmNode.snapshot();

        await evmNode.setBalance(mnemonicToAccount(secretPhrase).address, 1000);

        await test.step('Create a node operator via UI', async () => {
          const keys = keysGeneratorService.generateKeys(1);
          await widgetService.keysPage.goto();
          await widgetService.submitKeys(keys, TokenSymbol.ETH);
        });

        await test.step('Issue IDVTC status to the operator owner', async () => {
          await forkActionService.setGateAddrs(
            'idvtc',
            mnemonicToAccount(secretPhrase).address,
          );
        });

        await widgetService.setFeatureFlag('icsApplyForm', true);
      },
    );

    test.afterAll(async ({ evmNode, widgetService }) => {
      await widgetService.setFeatureFlag('icsApplyForm', false);
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test(
      qase(467, 'Should claim the IDVTC type successfully'),
      async ({ widgetService }) => {
        const claim = widgetService.operatorType.claimIdvtc;
        const txModal = widgetService.operatorType.txModal;
        await claim.open();

        await test.step('Confirm and submit the claim transaction', async () => {
          await claim.claimButton.click();
          await claim.confirmContinueButton.click();
          await widgetService.page.waitForSelector(
            'text=Sign the message to set up your cluster members after the transaction',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
          await widgetService.walletPage.confirmTx();

          await widgetService.page.waitForSelector(
            'text=Please confirm this transaction in your wallet',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
          await widgetService.walletPage.confirmTx();
        });

        await test.step('Transaction succeeds with an Etherscan link', async () => {
          await expect(txModal.title).toContainText(
            'IDVTC type has been successfully claimed',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
          await expect(txModal.etherscanLink).toBeVisible();
          await expect(txModal.etherscanLink).toHaveAttribute(
            'href',
            /\/tx\/0x[0-9a-fA-F]+$/,
          );
        });

        await test.step('Closing the modal shows the success screen', async () => {
          await txModal.closeModal();

          await expect(
            widgetService.page.getByText('Congratulations!'),
          ).toBeVisible();
          await expect(
            widgetService.page.getByText(
              'You have claimed the Identified DVT Cluster operator type',
            ),
          ).toBeVisible();
          await expect(
            widgetService.page.getByText(
              'You can see the new parameters for your Node Operator by clicking the IDVTC badge at the top of the screen',
            ),
          ).toBeVisible();
          await expect(
            widgetService.page.getByRole('button', { name: 'Amazing!' }),
          ).toBeVisible();
        });

        await test.step('Operator type is now IDVTC in the header', async () => {
          await expect(widgetService.header.operatorTypeCurve).toContainText(
            'IDVTC',
          );
        });
      },
    );
  },
);
