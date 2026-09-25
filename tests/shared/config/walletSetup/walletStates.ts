import { parseEther } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import {
  ForkActionsService,
  type ForkActionsOptions,
} from 'tests/shared/contracts/forkActions.service';
import {
  type GateSelector,
  type Handler,
  type PresetDefinition,
  type StateCtx,
} from './types';

const PRESET_BALANCE = parseEther('1000');

export type WalletPreset = PresetDefinition & { secretPhrase: string };

export type WalletStateOptions = ForkActionsOptions & {
  handlers: Record<string, Handler>;
  order: readonly string[];
};

export class WalletStateService {
  readonly fork: ForkActionsService;
  private readonly handlers: Record<string, Handler>;
  private readonly order: readonly string[];

  constructor({ handlers, order, ...forkOptions }: WalletStateOptions) {
    this.fork = new ForkActionsService(forkOptions);
    this.handlers = handlers;
    this.order = order;
  }

  async applyAll(presets: WalletPreset[]): Promise<{ noId?: number }[]> {
    const gateMap = new Map<GateSelector, `0x${string}`[]>();
    for (const preset of presets) {
      const address = mnemonicToAccount(preset.secretPhrase).address;
      for (const gate of preset.gates ?? []) {
        gateMap.set(gate, [...(gateMap.get(gate) ?? []), address]);
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

    await this.fork.fund(ctx.address, PRESET_BALANCE);

    const sorted = [...preset.state].sort(
      (a, b) => this.order.indexOf(a) - this.order.indexOf(b),
    );

    for (const key of sorted) {
      const handler = this.handlers[key];
      if (!handler) throw new Error(`Unknown wallet state handler "${key}"`);
      console.info(`[WalletState] → ${key}`);
      const patch = await handler.call(this, ctx);
      ctx = { ...ctx, ...patch };
    }

    console.info(`[WalletState] done  noId=${ctx.noId}`);
    return { noId: ctx.noId };
  }
}
