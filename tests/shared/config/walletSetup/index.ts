import { generateMnemonic, mnemonicToAccount } from 'viem/accounts';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';
import type { ChainName, ModuleName } from 'tests/shared/contracts/constants';
import type { StepFn } from 'tests/shared/contracts/forkActions.service';
import {
  hasModulePresets,
  readPreset,
  writeModulePresets,
  type ModulePresets,
} from './presetsState';
import {
  type Handler,
  type PresetDefinition,
  type PresetRuntime,
} from './types';
import { WalletStateService } from './walletStates';

export * from './types';
export { stateFile } from './presetsState';
export { WalletStateService } from './walletStates';

export type ModuleWalletSetup<
  H extends string = string,
  D extends Record<string, PresetDefinition<H>> = Record<
    string,
    PresetDefinition<H>
  >,
> = {
  chain: ChainName;
  module: ModuleName;
  handlers: Record<H, Handler>;
  order: readonly H[];
  definitions: D;
  presets: Record<keyof D, PresetRuntime>;
  hasPresets: () => boolean;
};

export const defineWalletSetup = <
  H extends string,
  D extends Record<string, PresetDefinition<H>>,
>(setup: {
  chain: ChainName;
  module: ModuleName;
  handlers: Record<H, Handler>;
  order: readonly H[];
  definitions: D;
}): ModuleWalletSetup<H, D> => ({
  ...setup,
  presets: new Proxy({} as Record<keyof D, PresetRuntime>, {
    get: (_target, key) => readPreset(setup.chain, setup.module, key as string),
  }),
  hasPresets: () => hasModulePresets(setup.chain, setup.module),
});

const passthroughStep: StepFn = (title, body) => {
  console.info(`[step] ${title}`);
  return body();
};

export const setupPresets = async <
  H extends string,
  D extends Record<string, PresetDefinition<H>>,
>(
  setup: ModuleWalletSetup<H, D>,
  { rpcUrl }: { rpcUrl: string },
): Promise<void> => {
  const { chain, module, handlers, order, definitions } = setup;

  if (setup.hasPresets()) {
    console.info(
      `[globalSetup] ${module} preset accounts already exist, skipping setup.`,
    );
    return;
  }

  const service = new WalletStateService({
    rpcUrl,
    chain,
    module,
    handlers,
    order,
    step: passthroughStep,
  });

  const entries = Object.entries(definitions).map(([name, def]) => ({
    name,
    def,
    secretPhrase: generateMnemonic(english, 128),
  }));

  const results = await service.applyAll(
    entries.map(({ secretPhrase, def }) => ({ secretPhrase, ...def })),
  );

  const presets: ModulePresets = {};
  for (const [i, { name, def, secretPhrase }] of entries.entries()) {
    presets[name] = {
      secretPhrase,
      address: mnemonicToAccount(secretPhrase).address,
      noId: results[i].noId,
      state: def.state,
      gates: def.gates,
    };
  }

  writeModulePresets(chain, module, presets);

  console.info(
    `[globalSetup] ${module} preset accounts ready:`,
    Object.fromEntries(
      Object.entries(presets).map(([name, { noId }]) => [name, { noId }]),
    ),
  );
};
