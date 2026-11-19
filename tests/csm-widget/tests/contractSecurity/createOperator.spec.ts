import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { EPIC, suite } from 'tests/csm-widget/consts/qase.const';
import { PRESETS } from 'tests/csm-widget/config/walletSetup';
import { widgetFullConfig } from 'tests/csm-widget/config';
import { contracts } from 'tests/csm-widget/consts/contracts.const';
import { OperatorTypeCard } from 'tests/csm-widget/pages/elements/main/element.operatorTypeCards';
import { Tags } from 'tests/shared/consts/common.const';
import { KeysGeneratorService } from 'tests/shared/services/keysGenerator.service';
import { test } from '../test.fixture';

test.use({ secretPhrase: PRESETS.EMPTY_ADDRESS.secretPhrase });

const PERMIT_TOKEN = {
  [TOKENS.steth]: contracts.stETH,
  [TOKENS.wsteth]: contracts.wstETH,
};

const compoundingKeys = new KeysGeneratorService({
  ...widgetFullConfig.standConfig.keysGeneratorConfig,
  isCM: true,
});

const OPERATOR_TYPES: {
  type: OperatorTypeCard;
  gate: string;
  name: string;
  compounding: boolean;
}[] = [
  {
    type: '0x01',
    gate: contracts.csm.permissionlessGate,
    name: 'CSM PermissionlessGate',
    compounding: false,
  },
  {
    type: '0x02',
    gate: contracts.csm02.permissionlessGate,
    name: 'CSM 0x02 PermissionlessGate',
    compounding: true,
  },
];

test.describe(
  ...suite({
    epic: EPIC.security,
    feature: 'Contract address',
    story: 'Create operator',
    tag: Tags.contractSecurityCheck,
  }),
  () => {
    let snapshotId: string;

    test.beforeAll(async ({ csmSDK, forkActionService }) => {
      snapshotId = await csmSDK.evmSnapshot();

      await test.step('Set up: stETH and wstETH for a 0x02 bond', async () => {
        await forkActionService.fundTokens(PRESETS.EMPTY_ADDRESS.address, '40');
      });
    });

    test.afterAll(async ({ csmSDK }) => {
      if (snapshotId) await csmSDK.evmRevert(snapshotId);
    });

    OPERATOR_TYPES.forEach(({ type, gate, name, compounding }) => {
      [TOKENS.eth, TOKENS.steth, TOKENS.wsteth].forEach((token) => {
        test(`Should send Create ${type} operator with ${token} to ${name}`, async ({
          widgetService,
          keysGeneratorService,
        }) => {
          const form = widgetService.keysPage.createNodeOperatorForm;
          const { walletPage } = widgetService;
          const keys = (
            compounding ? compoundingKeys : keysGeneratorService
          ).generateKeys();

          await test.step(`Submit 1 key with ${token} bond`, async () => {
            await widgetService.keysPage.goto(type);
            await form.getBondTokenElement(token).click();
            await form.fillKeys(keys);
            await form.confirmKeysReady.click();
            await form.submitKeysButton.click();
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
