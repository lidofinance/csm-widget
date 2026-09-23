import type { GateSelector } from 'tests/shared/contracts/constants';
import type { ForkActionsService } from 'tests/shared/contracts/forkActions.service';

export type { GateSelector };

export type StateCtx = {
  address: `0x${string}`;
  gates: GateSelector[];
  noId?: number;
};

export type HandlerThis = { fork: ForkActionsService };
