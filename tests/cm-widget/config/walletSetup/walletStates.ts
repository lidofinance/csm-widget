import { mnemonicToAccount } from 'viem/accounts';
import {
  ForkActionsService,
  type ForkActionsOptions,
} from 'tests/shared/services/forkActions.service';
import {
  withOperator,
  withGroup,
  withKeys,
  withDeposit,
  HANDLER_ORDER,
} from './handlers';
import { type GateSelector, type StateCtx } from './handlers/types';

export type WalletPreset = {
  secretPhrase: string;
  state: (keyof WalletStateService['handlers'])[];
  gates?: GateSelector[];
};

export class WalletStateService {
  fork: ForkActionsService;

  readonly handlers = {
    withOperator: withOperator.bind(this),
    withGroup: withGroup.bind(this),
    withKeys: withKeys.bind(this),
    withDeposit: withDeposit.bind(this),
  };

  constructor(options?: ForkActionsOptions) {
    this.fork = new ForkActionsService(options);
  }

  async applyAll(presets: WalletPreset[]): Promise<{ noId?: number }[]> {
    // Batch gate setup: group all addresses by gate, call setGateAddrs once per gate
    const gateMap = new Map<GateSelector, `0x${string}`[]>();
    for (const preset of presets) {
      const address = mnemonicToAccount(preset.secretPhrase).address;
      for (const gate of preset.gates ?? []) {
        const list = gateMap.get(gate) ?? [];
        gateMap.set(gate, [...list, address]);
      }
    }
    for (const [gate, addresses] of gateMap) {
      console.info(
        `[WalletState] setGateAddrs ${gate} → ${addresses.length} address(es)`,
      );
      await this.fork.setGateAddrs([gate], ...addresses);
    }

    const results: { noId?: number }[] = [];
    for (const preset of presets) {
      results.push(await this.apply(preset));
    }
    return results;
  }

  async apply(preset: WalletPreset): Promise<{ noId?: number }> {
    let ctx: StateCtx = {
      address: mnemonicToAccount(preset.secretPhrase).address,
      gates: preset.gates ?? [],
    };

    console.info(
      `[WalletState] address=${ctx.address} state=[${preset.state.join(', ')}] gates=[${ctx.gates.join(', ')}]`,
    );

    const sorted = [...preset.state].sort(
      (a, b) => HANDLER_ORDER.indexOf(a) - HANDLER_ORDER.indexOf(b),
    );

    for (const key of sorted) {
      console.info(`[WalletState] → ${key}`);
      const patch = await this.handlers[key](ctx);
      ctx = { ...ctx, ...patch };
    }

    console.info(`[WalletState] done  noId=${ctx.noId}`);
    return { noId: ctx.noId };
  }
}
