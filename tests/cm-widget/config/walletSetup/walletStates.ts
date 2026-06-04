import { mnemonicToAccount } from 'viem/accounts';
import {
  ForkActionsService,
  type ForkActionsOptions,
} from 'tests/shared/services/forkActions.service';
import { withOperator, withGroup, withKeys, HANDLER_ORDER } from './handlers';
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
  };

  constructor(options?: ForkActionsOptions) {
    this.fork = new ForkActionsService(options);
  }

  async apply(preset: WalletPreset): Promise<{ noId?: number }> {
    let ctx: StateCtx = {
      address: mnemonicToAccount(preset.secretPhrase).address,
      gates: preset.gates ?? [],
    };

    const sorted = [...preset.state].sort(
      (a, b) => HANDLER_ORDER.indexOf(a) - HANDLER_ORDER.indexOf(b),
    );

    for (const key of sorted) {
      const patch = await this.handlers[key](ctx);
      ctx = { ...ctx, ...patch };
    }

    return { noId: ctx.noId };
  }
}
