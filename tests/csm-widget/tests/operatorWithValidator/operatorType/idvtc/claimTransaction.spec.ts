import { test } from '../../../test.fixture';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import {
  PAGE_WAIT_TIMEOUT,
  STAGE_WAIT_TIMEOUT,
} from 'tests/shared/consts/timeouts';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

test.describe(
  ...suite({
    epic: EPIC.operatorType,
    feature: 'IDVTC',
    story: 'Claim transaction',
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(
      async ({ evmNode, forkActionService, widgetService, secretPhrase }) => {
        snapshotId = await evmNode.snapshot();

        await evmNode.setBalance(mnemonicToAccount(secretPhrase).address, 1000);

        await forkActionService.createPermissionlessOperator(
          mnemonicToAccount(secretPhrase).address,
        );

        await test.step('Issue IDVTC status to the operator owner', async () => {
          await forkActionService.setGateAddrs(
            'idvtc',
            mnemonicToAccount(secretPhrase).address,
          );
        });

        await widgetService.setFeatureFlag('icsApplyForm', true);

        await test.step('Claim the IDVTC operator type', async () => {
          const claim = widgetService.operatorType.claimIdvtc;
          const txModal = widgetService.operatorType.txModal;

          await claim.open();
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

          await expect(txModal.title).toContainText(
            'IDVTC type has been successfully claimed',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
          await expect(txModal.etherscanLink).toHaveAttribute(
            'href',
            /\/tx\/0x[0-9a-fA-F]+$/,
          );

          await txModal.closeModal();
        });
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

        await test.step('Success screen is shown', async () => {
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

        await test.step('DKG files card is shown under the success screen', async () => {
          await expect(claim.dkgRequiredCard).toBeVisible();
          await expect(claim.dkgRequiredCard).toContainText(
            'Upload DKG Files Required',
          );
          await expect(claim.dkgRequiredCard).toContainText(
            'This Node Operator is configured as IDVTC. To keep the IDVTC status, please upload the DKG files that prove the validator keys were generated through a DKG ceremony.',
          );
          await expect(claim.dkgUploadFilesButton).toBeVisible();
        });
      },
    );

    test(
      qase(560, 'Should open the DKG page by "Upload files"'),
      async ({ widgetService }) => {
        const claim = widgetService.operatorType.claimIdvtc;

        await test.step('Follow the "Upload files" button', async () => {
          await expect(claim.dkgUploadFilesButton).toBeVisible();
          await claim.dkgUploadFilesButton.click();
        });

        await test.step('DKG page is opened', async () => {
          await expect(widgetService.page).toHaveURL(/\/idvtc\/dkg$/);
          await expect(widgetService.page.getByTestId('pageTitle')).toHaveText(
            'DKG',
          );
        });

        await test.step('DKG files section is loaded', async () => {
          const page = widgetService.page;

          await expect(page.getByTestId('dkgFilesCounter')).toHaveText('0', {
            timeout: PAGE_WAIT_TIMEOUT,
          });
          await expect(page.getByTestId('sectionHeader')).toContainText(
            'Your DKG files',
          );
          await expect(page.getByTestId('dkgAddFileButton')).toBeVisible();
          await expect(page.getByTestId('switcherTab')).toHaveText([
            'DKG files',
            'Cluster members',
          ]);
        });

        await test.step('Empty state is shown', async () => {
          await expect(
            widgetService.page.getByText('No DKG files at the moment'),
          ).toBeVisible();
          await expect(
            widgetService.page.getByText(
              'Upload your first distributed key generation file',
            ),
          ).toBeVisible();
        });
      },
    );
  },
);
