import { test } from '../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { Tags, TokenSymbol } from 'tests/shared/consts/common.const';
import { KeysGeneratorService } from 'tests/shared/services/keysGenerator.service';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

test.describe(
  'Operator with keys. IDVTC issued. Claim operator type (forked)',
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
      }) => {
        test.skip(!useFork, 'Test suite runs only on forked network');

        snapshotId = await evmNode.snapshot();

        await evmNode.setBalance(mnemonicToAccount(secretPhrase).address, 1000);

        await test.step('Create a node operator via UI', async () => {
          const keys = await new KeysGeneratorService().generateKeys(1);
          await widgetService.keysPage.goto();
          await widgetService.submitKeys(keys, TokenSymbol.ETH);
        });

        await test.step('Issue IDVTC status to the operator owner', async () => {
          await forkActionService.setGateAddrs(
            'idvtc',
            mnemonicToAccount(secretPhrase).address,
          );
        });
      },
    );

    test.beforeEach(async ({ widgetService }) => {
      await widgetService.setFeatureFlag('icsApplyForm', true);
    });

    test.afterAll(async ({ evmNode, widgetService }) => {
      await widgetService.setFeatureFlag('icsApplyForm', false);
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test(
      qase(468, 'Should show the claim notification, badge and claim button'),
      async ({ widgetService }) => {
        const operatorType = widgetService.operatorType;
        await operatorType.openTypePage();

        await test.step('IDVTC card is issued and claimable', async () => {
          await expect(operatorType.idvtcIssuedChip).toBeVisible();
          await expect(operatorType.idvtcApplyButton).toContainText(
            'Claim IDVTC type',
          );
        });

        await test.step('Claim notification is shown', async () => {
          await expect(operatorType.claimAlert).toBeVisible();
          await expect(operatorType.claimAlert).toContainText(
            'You have a new operator type to be claimed',
          );
          await expect(operatorType.claimAlert).toContainText(
            'The Identified DVT Cluster type is now available to be claimed for your node operator.',
          );
          await expect(operatorType.claimAlertButton).toBeVisible();
        });

        await test.step('Operator Type nav item shows the claim counter', async () => {
          await expect(operatorType.navClaimCounter).toHaveText('1');
        });
      },
    );

    test(
      qase(438, 'Should open the claim page from the claim button'),
      async ({ widgetService }) => {
        const operatorType = widgetService.operatorType;
        await operatorType.openTypePage();

        await operatorType.idvtcApplyButton.click();

        await widgetService.page.waitForURL(/\/type\/idvtc-claim/);
        await expect(operatorType.claimPageTitle).toHaveText(
          'Apply for Identified DVT Cluster',
        );
      },
    );

    test(
      qase(439, 'Should open the claim page from the notification'),
      async ({ widgetService }) => {
        const operatorType = widgetService.operatorType;
        await operatorType.openTypePage();

        await operatorType.claimAlertButton.click();

        await widgetService.page.waitForURL(/\/type\/idvtc-claim/);
        await expect(operatorType.claimPageTitle).toHaveText(
          'Apply for Identified DVT Cluster',
        );
      },
    );

    test(
      qase(440, 'Should show the claim page content'),
      async ({ widgetService }) => {
        const claim = widgetService.operatorType.claimIdvtc;
        await claim.open();

        await test.step('Page header', async () => {
          await expect(claim.title).toHaveText(
            'Apply for Identified DVT Cluster',
          );
          await expect(claim.subtitle).toHaveText(
            'Get verified as an Independent DVT Cluster',
          );
        });

        await test.step('Claim card', async () => {
          await expect(claim.formTitle).toContainText(
            'Claim Identified DVT Cluster operator type',
          );
          await expect(
            claim.page.getByText(
              'You are eligible to claim a new operator type. Claiming the Identified DVT Cluster operator type will change some parameters for your node operator according to the section below.',
            ),
          ).toBeVisible();
          await expect(claim.parameterChanges).toBeVisible();
          await expect(claim.claimButton).toBeVisible();
        });
      },
    );

    test(
      qase(441, 'Should show the parameter changes (current vs new)'),
      async ({ widgetService }) => {
        const claim = widgetService.operatorType.claimIdvtc;
        await claim.open();

        await claim.expandParameterChanges();

        await test.step('Current and new operator type columns', async () => {
          await expect(claim.getColumn('Current (DEF)')).toBeVisible();
          await expect(claim.getColumn('New (IDVTC)')).toBeVisible();
        });

        await test.step('Parameter rows are listed', async () => {
          for (const title of [
            'Node Operator reward',
            'Bond',
            'Removal fee',
            'Keys limit',
          ]) {
            await expect(claim.getParameter(title)).toBeVisible();
          }
        });
      },
    );

    test(
      qase(442, 'Should show the claim confirmation modal'),
      async ({ widgetService }) => {
        const claim = widgetService.operatorType.claimIdvtc;
        await claim.open();

        await claim.claimButton.click();

        await expect(claim.confirmModal).toBeVisible();
        await expect(claim.confirmModal).toContainText(
          'You are claiming the Identified DVT Cluster operator type',
        );
        await expect(claim.confirmModal).toContainText(
          'This action is irreversible, you will not be able to claim your current operator type back.',
        );
        await expect(claim.confirmContinueButton).toBeVisible();
      },
    );
  },
);
