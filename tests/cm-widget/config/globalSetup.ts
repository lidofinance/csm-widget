import { widgetFullConfig } from './';
import { warmUpForkedNode } from 'tests/shared/helpers/warmUpFork';
import { LidoSDKClient } from '../services/cmSDK.client';
import {
  startForkNode,
  assertForkReachable,
} from 'tests/shared/services/forkNode.service';
import { generateMnemonic, mnemonicToAccount } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import {
  WALLET_PRESET_DEFINITIONS,
  type PresetName,
} from './walletSetup/walletPresets';
import { WalletStateService } from './walletSetup/walletStates';
import {
  writePresetsState,
  type PresetsState,
  STATE_FILE,
} from './walletSetup/walletPresets.state';
import { existsSync } from 'fs';

const passthroughStep = <T>(title: string, body: () => Promise<T>) => {
  console.info(`[step] ${title}`);
  return body();
};

export default async function globalSetup() {
  if (process.env.USE_FORK !== 'true') {
    return;
  }

  const secretPhrase = widgetFullConfig.accountConfig.SECRET_PHRASE;
  const { host, rpcUrl } = widgetFullConfig.standConfig.nodeConfig;
  const port = Number(widgetFullConfig.standConfig.nodeConfig.port);
  const forkRpcURL = `http://${host}:${port}`;

  if (process.env.CI) {
    await startForkNode({
      forkUrl: rpcUrl,
      mnemonic: secretPhrase,
      port,
      host,
    });
  }
  await assertForkReachable(forkRpcURL);

  const cmSDK = new LidoSDKClient([forkRpcURL], {} as Record<string, string>);
  await warmUpForkedNode(cmSDK, secretPhrase);

  await setupPresetAccounts(forkRpcURL);
}

const setupPresetAccounts = async (forkRpcURL: string): Promise<void> => {
  if (existsSync(STATE_FILE)) {
    console.info(
      '[globalSetup] Preset accounts state already exists, skipping setup.',
    );
    return;
  }

  const walletService = new WalletStateService({
    module: 'cm',
    rpcUrl: forkRpcURL,
    step: passthroughStep,
  });

  const entries = Object.entries(WALLET_PRESET_DEFINITIONS).map(
    ([name, def]) => ({
      name,
      def,
      secretPhrase: generateMnemonic(english, 128),
    }),
  );

  const presets = entries.map(({ secretPhrase, def }) => ({
    secretPhrase,
    ...def,
  }));
  const results = await walletService.applyAll(presets);

  const state = {} as PresetsState;
  for (const [i, { name, def, secretPhrase }] of entries.entries()) {
    state[name as PresetName] = {
      secretPhrase,
      address: mnemonicToAccount(secretPhrase).address,
      noId: results[i].noId,
      state: def.state,
      gates: 'gates' in def ? def.gates : undefined,
    };
  }

  writePresetsState(state);

  console.info(
    '[globalSetup] Preset accounts ready:',
    Object.fromEntries(
      Object.entries(state).map(([name, { noId }]) => [name, { noId }]),
    ),
  );
};
