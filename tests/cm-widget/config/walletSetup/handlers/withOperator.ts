import { type HandlerThis, type StateCtx } from './types';

export const withOperator = async function (
  this: HandlerThis,
  ctx: StateCtx,
): Promise<Partial<StateCtx>> {
  const noId = await this.fork.createCuratedOperator(ctx.gates[0], ctx.address);
  // undefined means the gate is already consumed — fail here, not later in
  // withGroup/withKeys, which need ctx.noId
  if (noId === undefined)
    throw new Error(`Operator was not created via gate "${ctx.gates[0]}"`);
  return { noId, noIds: [...(ctx.noIds ?? []), noId] };
};
