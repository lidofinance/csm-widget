import { ForkActionsService } from 'tests/shared/services/forkActions.service';

export type GateSelector =
  (typeof ForkActionsService.GATE_SELECTOR)[keyof typeof ForkActionsService.GATE_SELECTOR];

export type StateCtx = {
  address: `0x${string}`;
  gates: GateSelector[];
  noId?: number;
};

export type HandlerThis = { fork: ForkActionsService };
