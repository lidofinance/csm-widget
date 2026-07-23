import { test } from '../../../test.fixture';
import { qase } from 'playwright-qase-reporter/playwright';
import { expect } from '@playwright/test';
import { mnemonicToAccount, generateMnemonic } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Tags } from 'tests/shared/consts/common.const';
import { OPERATOR_TYPE_METADATA } from 'tests/shared/consts/operatorTypes.const';

const secretPhrase = generateMnemonic(english, 128);
test.use({ secretPhrase });

const IDVTC_TITLE = OPERATOR_TYPE_METADATA[OPERATOR_TYPE.CSM_IDVTC].title;

const PARAMETERS = [
  {
    title: 'Node Operator reward',
    help: 'A share of the Consensus and Execution layers rewards',
  },
  {
    title: 'Bond',
    help: 'A security collateral that Node Operators must submit before uploading validator keys into',
  },
  {
    title: 'Priority queue',
    help: 'A queue that stays ahead of the general queue',
  },
  {
    title: 'Removal fee',
    help: 'An amount deducted from the Node Operator',
  },
  {
    title: 'Performance leeway',
    help: 'A value that is deducted from the network average performance',
  },
  {
    title: 'Penalty fee',
    help: 'An additional amount that is levied for violations committed by a Node Operator',
  },
  {
    title: 'Strikes parameters',
    help: 'A number of strikes requires for a key to be exited',
  },
  {
    title: 'Bad performance penalty',
    help: 'A penalty for the validator that was ejected due to strikes',
  },
  {
    title: 'Keys limit',
    help: 'A maximum number of non-withdrawn keys a Node Operator can upload',
  },
  {
    title: 'Performance coefficients',
    help: 'Parameter weights accounted for in the calculation of the aggregated performance metric',
  },
  {
    title: 'Allowed exit delay',
    help: 'A timeframe for a key to be exited voluntary before it gets ejected',
  },
  {
    title: 'Exit delay penalty',
    help: 'A fine charged in case of the key exit delay',
  },
];

test.describe(
  'Operator without keys. IDVTC. Header badge (forked)',
  { tag: [Tags.forked] },
  () => {
    let snapshotId: string;

    test.beforeAll(
      async ({ useFork, evmNode, forkActionService, secretPhrase }) => {
        test.skip(!useFork, 'Test suite runs only on forked network');

        snapshotId = await evmNode.snapshot();

        await test.step('Issue IDVTC status to the connected address', async () => {
          await forkActionService.setGateAddrs(
            'idvtc',
            mnemonicToAccount(secretPhrase).address,
          );
        });
      },
    );

    test.afterAll(async ({ evmNode }) => {
      if (snapshotId) await evmNode.revert(snapshotId);
    });

    test(
      qase(
        470,
        'Should show the IDVTC badge in the header on the create operator page',
      ),
      async ({ widgetService }) => {
        await widgetService.keysPage.goto();

        await expect(widgetService.header.operatorTypeBadge).toBeVisible();
        await expect(widgetService.header.operatorTypeBadge).toContainText(
          'IDVTC',
        );
      },
    );

    test(
      qase(445, 'Should hide the IDVTC badge outside the create operator page'),
      async ({ widgetService }) => {
        await test.step('Badge is shown on the create operator page', async () => {
          await widgetService.keysPage.goto();
          await expect(widgetService.header.operatorTypeBadge).toBeVisible();
        });

        await test.step('Badge is gone on the main page', async () => {
          await widgetService.mainPage.goto();
          await expect(widgetService.header.operatorTypeBadge).toBeHidden();
        });
      },
    );

    test(
      qase(446, 'Should open a parameters modal with a toggle from the badge'),
      async ({ widgetService }) => {
        const modal = widgetService.parametersModal;
        await widgetService.keysPage.goto();

        await test.step('Open the modal from the header badge', async () => {
          await widgetService.header.operatorTypeBadge.click();
          await expect(modal.modal).toBeVisible();
          await expect(modal.modal).toContainText(IDVTC_TITLE);
        });

        await test.step('Show more reveals the folded parameters', async () => {
          await expect(modal.foldableSection).toBeHidden();
          await expect(modal.showMoreToggle).toContainText('Show more');

          await modal.showMoreToggle.click();
          await expect(modal.foldableSection).toBeVisible();
          await expect(modal.showMoreToggle).toContainText('Show less');
        });

        await test.step('Show less folds them again', async () => {
          await modal.showMoreToggle.click();
          await expect(modal.foldableSection).toBeHidden();
          await expect(modal.showMoreToggle).toContainText('Show more');
        });
      },
    );

    test(
      qase(447, 'Should show the label and help tooltip for every parameter'),
      async ({ widgetService }) => {
        const modal = widgetService.parametersModal;
        await widgetService.keysPage.goto();
        await widgetService.header.operatorTypeBadge.click();
        await expect(modal.modal).toBeVisible();
        await expect(modal.modal).toContainText(IDVTC_TITLE);

        await test.step('Reveal all parameters', async () => {
          await modal.showMoreToggle.click();
        });

        for (const { title, help } of PARAMETERS) {
          await test.step(`Parameter "${title}" shows its label and help`, async () => {
            await expect(modal.getParameter(title)).toBeVisible();

            await modal.getParameterTooltipIcon(title).hover();
            await expect(modal.getTooltipText(help)).toBeVisible();
          });
        }
      },
    );
  },
);
