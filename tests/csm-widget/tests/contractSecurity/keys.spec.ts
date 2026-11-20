import { qase } from 'playwright-qase-reporter/playwright';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { contracts } from 'tests/csm-widget/consts/contracts.const';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { Tags } from 'tests/shared/consts/common.const';
import { STAGE_WAIT_TIMEOUT } from 'tests/shared/consts/timeouts';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.FULL_OPERATOR.secretPhrase });

const PERMIT_TOKEN = {
  [TOKENS.steth]: contracts.stETH,
  [TOKENS.wsteth]: contracts.wstETH,
};

test.describe(
  ...suite({
    epic: EPIC.security,
    feature: 'Contract address',
    story: 'Keys',
    tag: Tags.contractSecurityCheck,
  }),
  () => {
    let snapshotId: string;
    let pubkey: string;
    let depositedPubkey: string;

    test.beforeAll(
      async ({ csmSDK, forkActionService, widgetService, clMock }) => {
        snapshotId = await csmSDK.evmSnapshot();
        await widgetService.keysPage.submitPage.open();
        const noId = await widgetService.extractNodeOperatorId();

        await test.step('Set up: add a non-deposited key to remove', async () => {
          await forkActionService.addKeys(noId, 1);
          pubkey = (await csmSDK.getAllKeys(BigInt(noId))).at(-1) as string;
        });

        await test.step('Set up: mark a deposited key active on CL', async () => {
          depositedPubkey = (await csmSDK.operator.getKeys(BigInt(noId)))[0];
          clMock.set(depositedPubkey, 'ACTIVE');
        });
      },
    );

    test.afterAll(async ({ csmSDK, clMock }) => {
      clMock.reset();
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    [
      { token: TOKENS.eth, qaseId: 744 },
      { token: TOKENS.steth, qaseId: 745 },
      { token: TOKENS.wsteth, qaseId: 746 },
    ].forEach(({ token, qaseId }) => {
      test(
        qase(qaseId, `Should send Add keys with ${token} to CSModule`),
        async ({ widgetService, keysGeneratorService }) => {
          const { submitPage } = widgetService.keysPage;
          const { walletPage } = widgetService;

          await test.step(`Submit 1 key with ${token} bond`, async () => {
            await submitPage.open();
            await submitPage.submitKeys(
              keysGeneratorService.generateKeys(),
              token,
            );
          });

          if (token !== TOKENS.eth) {
            await test.step(`Permit is signed for ${token}`, async () => {
              await walletPage.assertReceiptAddress(PERMIT_TOKEN[token]);
              await walletPage.confirmTx();
            });
          }

          await test.step('Transaction goes to CSModule', async () => {
            await walletPage.assertReceiptAddress(contracts.csm.module);
            await walletPage.cancelTx();
          });
        },
      );
    });

    test(
      qase(747, 'Should send Remove keys to CSModule'),
      async ({ widgetService }) => {
        const { removePage } = widgetService.keysPage;
        const { walletPage } = widgetService;

        await test.step('Select 1 key and remove', async () => {
          await removePage.open();
          await removePage.getCheckboxByAddress(pubkey.slice(2)).click();
          await removePage.removeKeysButton.click();
        });

        await test.step('Transaction goes to CSModule', async () => {
          await walletPage.assertReceiptAddress(contracts.csm.module);
          await walletPage.cancelTx();
        });
      },
    );

    test(
      qase(748, 'Should send Eject keys to Ejector'),
      async ({ widgetService }) => {
        const { page, walletPage } = widgetService;

        await test.step('Select the active key and eject', async () => {
          await page.goto('/keys/eject');
          await page
            .locator('label', { hasText: depositedPubkey.slice(0, 14) })
            .locator('svg')
            .click();
          await page.getByRole('button', { name: 'Eject Keys' }).click();
          await page
            .getByRole('dialog')
            .getByRole('button', { name: 'Continue', exact: true })
            .click({ timeout: STAGE_WAIT_TIMEOUT });
        });

        await test.step('Transaction goes to Ejector', async () => {
          await walletPage.assertReceiptAddress(contracts.csm.ejector);
          await walletPage.cancelTx();
        });
      },
    );
  },
);
