import type { GateSelector } from 'tests/shared/contracts/constants';
import type { ForkActionsService } from 'tests/shared/contracts/forkActions.service';

export type { GateSelector };

export type StateCtx = {
  address: `0x${string}`;
  gates: GateSelector[];
  noId?: number;
};

export type HandlerThis = { fork: ForkActionsService };

export type Handler = (
  this: HandlerThis,
  ctx: StateCtx,
) => Promise<Partial<StateCtx>>;

export type PresetDefinition<H extends string = string> = {
  state: H[];
  gates?: GateSelector[];
};

export type PresetRuntime = {
  secretPhrase: string;
  address: `0x${string}`;
  noId?: number;
  state: string[];
  gates?: string[];
};
