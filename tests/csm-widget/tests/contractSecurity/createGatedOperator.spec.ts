import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { contracts } from 'tests/csm-widget/consts/contracts.const';
import { OperatorTypeCard } from 'tests/csm-widget/pages/elements/main/element.operatorTypeCards';
import { Tags } from 'tests/shared/consts/common.const';
import { getPendingRequestMethod } from 'tests/shared/helpers/walletRequest';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.EMPTY_ADDRESS.secretPhrase });

const PERMIT_TOKEN = {
  [TOKENS.steth]: contracts.stETH,
  [TOKENS.wsteth]: contracts.wstETH,
};

const OPERATOR_TYPES: { type: OperatorTypeCard; gate: string; name: string }[] =
  [
    { type: 'ics', gate: contracts.csm.icsGate, name: 'ICS gate' },
    { type: 'idvtc', gate: contracts.csm.idvtcGate, name: 'IDVTC gate' },
  ];

test.describe(
  ...suite({
    epic: EPIC.security,
    feature: 'Contract address',
    story: 'Create gated operator',
    tag: Tags.contractSecurityCheck,
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ csmSDK, forkActionService }) => {
      snapshotId = await csmSDK.evmSnapshot();

      await test.step('Set up: tokens and gate membership', async () => {
        await forkActionService.fundTokens(PRESETS.EMPTY_ADDRESS.address, '10');
        await forkActionService.setGateAddrs(
          ['ics', 'idvtc'],
          PRESETS.EMPTY_ADDRESS.address,
        );
      });
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    OPERATOR_TYPES.forEach(({ type, gate, name }) => {
      [TOKENS.eth, TOKENS.steth, TOKENS.wsteth].forEach((token) => {
        test(`Should send Create ${type} operator with ${token} to ${name}`, async ({
          widgetService,
          keysGeneratorService,
        }) => {
          const form = widgetService.keysPage.createNodeOperatorForm;
          const { walletPage } = widgetService;

          await test.step(`Submit 1 key with ${token} bond`, async () => {
            await widgetService.keysPage.goto(type);
            await form.getBondTokenElement(token).click();
            await form.fillKeys(keysGeneratorService.generateKeys());
            await form.confirmKeysReady.click();
            await form.submitKeysButton.click();
          });

          await test.step('Sign the cluster setup message if asked', async () => {
            if (
              (await getPendingRequestMethod(walletPage)) === 'personal_sign'
            ) {
              await walletPage.confirmTx();
            }
          });

          if (token !== TOKENS.eth) {
            await test.step(`Permit is signed for ${token}`, async () => {
              await walletPage.assertReceiptAddress(PERMIT_TOKEN[token]);
              await walletPage.confirmTx();
            });
          }

          await test.step(`Transaction goes to ${name}`, async () => {
            await walletPage.assertReceiptAddress(gate);
            await walletPage.cancelTx();
          });
        });
      });
    });
  },
);
