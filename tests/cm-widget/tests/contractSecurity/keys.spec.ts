import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { EPIC, suite } from 'tests/cm-widget/consts/qase.const';
import { PRESETS } from 'tests/cm-widget/config/walletSetup';
import { contracts } from 'tests/cm-widget/consts/contracts.const';
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
      async ({ cmSDK, forkActionService, widgetService, clMock }) => {
        snapshotId = await cmSDK.evmSnapshot();
        await widgetService.keysPage.submitPage.open();
        const noId = await widgetService.extractNodeOperatorId();

        await test.step('Set up: tokens and a non-deposited key', async () => {
          await forkActionService.fundTokens(
            PRESETS.FULL_OPERATOR.address,
            '10',
          );
          await forkActionService.addKeys(noId, 1);
          pubkey = (await cmSDK.getAllKeys(BigInt(noId))).at(-1) as string;
        });

        await test.step('Set up: mark a deposited key active on CL', async () => {
          depositedPubkey = (await cmSDK.getAllKeys(BigInt(noId)))[0];
          clMock.set(depositedPubkey, 'ACTIVE');
        });
      },
    );

    test.afterAll(async ({ cmSDK, clMock }) => {
      clMock.reset();
      if (snapshotId) await cmSDK.evmRevert(snapshotId);
    });

    [TOKENS.eth, TOKENS.steth, TOKENS.wsteth].forEach((token) => {
      test(`Should send Add keys with ${token} to CuratedModule`, async ({
        widgetService,
        keysGeneratorService,
      }) => {
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

        await test.step('Transaction goes to CuratedModule', async () => {
          await walletPage.assertReceiptAddress(contracts.module);
          await walletPage.cancelTx();
        });
      });
    });

    test('Should send Remove keys to CuratedModule', async ({
      widgetService,
    }) => {
      const { removePage } = widgetService.keysPage;
      const { walletPage } = widgetService;

      await test.step('Select 1 key and remove', async () => {
        await removePage.open();
        await removePage.getCheckboxByAddress(pubkey.slice(2)).click();
        await removePage.removeKeysButton.click();
      });

      await test.step('Transaction goes to CuratedModule', async () => {
        await walletPage.assertReceiptAddress(contracts.module);
        await walletPage.cancelTx();
      });
    });

    test('Should send Eject keys to Ejector', async ({ widgetService }) => {
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
        await walletPage.assertReceiptAddress(contracts.ejector);
        await walletPage.cancelTx();
      });
    });
  },
);
