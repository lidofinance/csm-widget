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
  'IDVTC operator. ICS issued. Claim or create ICS (forked)',
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
        const address = mnemonicToAccount(secretPhrase).address;

        await evmNode.setBalance(address, 1000);

        await test.step('Issue IDVTC status to the connected address', async () => {
          await forkActionService.setGateAddrs('idvtc', address);
        });

        await widgetService.setFeatureFlag('icsApplyForm', true);

        await test.step('Create an IDVTC operator by adding a key', async () => {
          const keys = keysGeneratorService.generateKeys(1);
          await widgetService.keysPage.goto();
          await widgetService.keysPage.createNodeOperatorForm.submitNewKeys(
            keys,
            TokenSymbol.ETH,
          );
          await test.step('Sign the message to set up your cluster members', async () => {
            await widgetService.page.waitForSelector(
              'text=Sign the message to set up your cluster members after the transaction',
              { timeout: STAGE_WAIT_TIMEOUT },
            );
            await widgetService.walletPage.confirmTx();
          });

          await test.step('Confirm tx for creating operator', async () => {
            await widgetService.page.waitForSelector(
              'text=Creating Node Operator',
              { timeout: STAGE_WAIT_TIMEOUT },
            );

            await widgetService.walletPage.confirmTx();
            await widgetService.page.waitForSelector(
              'text=Node Operator has been created',
              { timeout: STAGE_WAIT_TIMEOUT },
            );
          });
        });

        await test.step('Issue ICS status to the same address', async () => {
          await forkActionService.setGateAddrs('ics', address);
        });

        snapshotId = await evmNode.snapshot();
      },
    );

    test.afterEach(async ({ evmNode }) => {
      if (snapshotId) {
        await evmNode.revert(snapshotId);
        snapshotId = await evmNode.snapshot();
      }
    });

    test.afterAll(async ({ evmNode, widgetService }) => {
      await widgetService.setFeatureFlag('icsApplyForm', false);
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test(
      qase(466, 'Should overwrite IDVTC with ICS when claimed'),
      async ({ widgetService }) => {
        const claim = widgetService.operatorType.claimIcs;
        const txModal = widgetService.operatorType.txModal;
        const header = widgetService.header;

        await test.step('Operator type is IDVTC before claiming', async () => {
          await widgetService.operatorType.openTypePage();
          await expect(header.operatorTypeCurve).toContainText('IDVTC');
        });

        await claim.open();

        await test.step('Confirm and submit the ICS claim transaction', async () => {
          await claim.claimButton.click();
          await expect(claim.confirmModal).toContainText(
            'You are claiming the Identified Community Staker operator type',
          );
          await claim.confirmContinueButton.click();
          await widgetService.page.waitForSelector(
            'text=Please confirm this transaction in your wallet',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
          await widgetService.walletPage.confirmTx();
        });

        await test.step('Claim transaction succeeds', async () => {
          await expect(txModal.title).toContainText(
            'ICS type has been successfully claimed',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
          await txModal.closeModal();
          await expect(
            widgetService.page.getByText(
              'You have claimed the Identified Community Staker operator type',
            ),
          ).toBeVisible();
        });

        await test.step('Header shows only ICS, IDVTC overwritten', async () => {
          await expect(header.operatorTypeCurve).toContainText('ICS');
          await expect(header.operatorTypeCurve).not.toContainText('IDVTC');
        });
      },
    );

    test(
      qase(510, 'Should offer a switch to the new operator on success'),
      async ({ widgetService, keysGeneratorService }) => {
        const form = widgetService.keysPage.createNodeOperatorForm;
        const txModal = widgetService.operatorType.txModal;
        const keys = keysGeneratorService.generateKeys(1);
        const idvtcOperatorId = await widgetService.extractNodeOperatorId();

        await test.step('Create a new ICS operator on the create page', async () => {
          await widgetService.keysPage.goto();
          await form.getBondTokenElement(TokenSymbol.ETH).click();
          await form.fillKeys(keys);
          await form.confirmKeysReady.click();
          await form.submitKeysButton.click();
          await widgetService.walletPage.confirmTx();
          await widgetService.page.waitForSelector(
            'text=Node Operator has been created',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
        });

        const description = await txModal.description.innerText();
        const idMatch = description.match(/Node Operator ID is (\d+)/);
        expect(
          idMatch,
          `success description must name the new operator, got: ${description}`,
        ).not.toBeNull();
        const icsOperatorId = Number(idMatch?.[1]);

        await test.step('The created operator is a new one', async () => {
          expect(icsOperatorId).not.toBe(idvtcOperatorId);
        });

        await test.step('Success screen offers a switch to it', async () => {
          await expect(txModal.switchToOperatorBtn).toHaveText(
            `Switch to Node Operator #${icsOperatorId}`,
          );
        });

        await test.step('The IDVTC operator stays active until the switch', async () => {
          expect(await widgetService.extractNodeOperatorId()).toBe(
            idvtcOperatorId,
          );
        });
      },
    );

    test(
      qase(437, 'Should keep IDVTC and add an ICS operator when created'),
      async ({ widgetService, keysGeneratorService }) => {
        const form = widgetService.keysPage.createNodeOperatorForm;
        const header = widgetService.header;
        const switchModal = widgetService.switchOperatorModal;
        const keys = keysGeneratorService.generateKeys(1);

        await test.step('Create a new ICS operator on the create page', async () => {
          await widgetService.keysPage.goto();
          await form.getBondTokenElement(TokenSymbol.ETH).click();
          await form.fillKeys(keys);
          await expect(form.amountInput).toHaveValue('1.5');
          await form.confirmKeysReady.click();
          await form.submitKeysButton.click();
          await widgetService.walletPage.confirmTx();
          await widgetService.page.waitForSelector(
            'text=Node Operator has been created',
            { timeout: STAGE_WAIT_TIMEOUT },
          );
        });

        await test.step('Switch to the created ICS operator', async () => {
          await widgetService.operatorType.txModal.switchToOperatorBtn.click();
        });

        await test.step('Header switch panel shows two operators', async () => {
          await widgetService.operatorType.openTypePage();
          await expect(header.switchOperatorButton).toBeVisible();
          await header.switchOperatorButton.click();
          await expect(switchModal.modal).toBeVisible();
          await expect(switchModal.rows).toHaveCount(2);
        });

        await test.step('Both IDVTC and ICS operators are listed', async () => {
          await expect(
            switchModal.rows.filter({ hasText: 'IDVTC' }),
          ).toBeVisible();
          await expect(
            switchModal.rows.filter({ hasText: 'ICS' }),
          ).toBeVisible();
        });
      },
    );
  },
);
